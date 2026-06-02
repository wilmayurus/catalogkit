import io, os, uuid, json, zipfile, shutil, re, secrets, textwrap
from urllib.parse import quote as url_quote
from datetime import datetime, timedelta
from functools import wraps

from flask import (Flask, render_template, request, jsonify,
                   send_file, session, redirect, url_for, flash)
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message
from werkzeug.security import generate_password_hash, check_password_hash
from PIL import Image, ImageDraw, ImageFont
from sqlalchemy import text

app = Flask(__name__)
app.secret_key = os.environ.get('SESSION_SECRET', 'dev-only-change-in-prod')
app.jinja_env.filters['fromjson'] = json.loads
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///catalogkit.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# ── Mail config (silently skipped if not set) ─────────────────────────────────
app.config['MAIL_SERVER']         = os.environ.get('MAIL_SERVER', '')
app.config['MAIL_PORT']           = int(os.environ.get('MAIL_PORT', 587))
app.config['MAIL_USE_TLS']        = os.environ.get('MAIL_USE_TLS', 'true').lower() == 'true'
app.config['MAIL_USERNAME']       = os.environ.get('MAIL_USERNAME', '')
app.config['MAIL_PASSWORD']       = os.environ.get('MAIL_PASSWORD', '')
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_FROM', '')

db   = SQLAlchemy(app)
mail = Mail(app)

# ── Plan constants ────────────────────────────────────────────────────────────
TARGET_WIDTH  = 800
TARGET_HEIGHT = 1000
ALLOWED_EXTENSIONS  = {'.jpg', '.jpeg', '.png', '.webp', '.gif'}
FREE_CATALOG_LIMIT  = 1
FREE_MAX_IMAGES     = 5
BASIC_MAX_IMAGES    = 20
BASIC_PRICE_PGK     = 5
BASIC_MONTHLY_LIMIT = 2
PRO_PRICE_PGK       = 20

PAYMENT_INFO = {
    'cell_moni': os.environ.get('CELL_MONI_NUMBER', '7XX XXX XXX'),
    'bank':      os.environ.get('BANK_ACCOUNT',     'BSP — Account: 1000XXXXXX — Name: Your Business Name'),
    'contact':   os.environ.get('ADMIN_CONTACT',    'admin@youremail.com'),
}


# ── Models ────────────────────────────────────────────────────────────────────

class User(db.Model):
    id            = db.Column(db.Integer, primary_key=True)
    email         = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    name          = db.Column(db.String(255), nullable=False)
    business_name = db.Column(db.String(255), nullable=True)
    contact_person= db.Column(db.String(255), nullable=True)
    location      = db.Column(db.String(255), nullable=True)
    whatsapp      = db.Column(db.String(50),  nullable=True)
    phone         = db.Column(db.String(50),  nullable=True)
    facebook_url     = db.Column(db.String(500), nullable=True)
    payment_methods  = db.Column(db.Text, nullable=True)
    delivery_methods = db.Column(db.Text, nullable=True)
    reset_token      = db.Column(db.String(100), nullable=True)
    reset_token_exp  = db.Column(db.DateTime, nullable=True)
    plan          = db.Column(db.String(20), default='free')
    plan_expires  = db.Column(db.DateTime, nullable=True)
    plan_start    = db.Column(db.DateTime, nullable=True)
    is_admin      = db.Column(db.Boolean, default=False)
    created_at    = db.Column(db.DateTime, default=datetime.utcnow)
    catalogs      = db.relationship('Catalog', backref='user', lazy=True, cascade='all, delete-orphan')
    payments      = db.relationship('PaymentRequest', backref='user', lazy=True, cascade='all, delete-orphan')

    @property
    def is_basic(self):
        return self.plan == 'basic' and bool(self.plan_expires) and self.plan_expires > datetime.utcnow()

    @property
    def is_pro(self):
        return self.plan == 'pro' and bool(self.plan_expires) and self.plan_expires > datetime.utcnow()

    @property
    def plan_label(self):
        if self.is_admin: return 'Admin'
        if self.is_pro:   return 'Pro'
        if self.is_basic: return 'Basic'
        return 'Free'

    @property
    def max_images(self):
        if self.is_admin or self.is_pro: return None
        if self.is_basic: return BASIC_MAX_IMAGES
        return FREE_MAX_IMAGES

    @property
    def catalogs_this_period(self):
        if not self.plan_start:
            return Catalog.query.filter_by(user_id=self.id).count()
        return Catalog.query.filter(
            Catalog.user_id == self.id,
            Catalog.created_at >= self.plan_start
        ).count()

    @property
    def catalogs_remaining(self):
        if self.is_admin or self.is_pro: return None
        if self.is_basic: return max(0, BASIC_MONTHLY_LIMIT - self.catalogs_this_period)
        return None

    @property
    def can_create_catalog(self):
        if self.is_admin or self.is_pro: return True
        if self.is_basic: return self.catalogs_this_period < BASIC_MONTHLY_LIMIT
        return self.catalog_count < FREE_CATALOG_LIMIT

    @property
    def catalog_count(self):
        return Catalog.query.filter_by(user_id=self.id).count()

    def has_pending_payment(self):
        return any(p.status == 'pending' for p in self.payments)


class Catalog(db.Model):
    id         = db.Column(db.Integer, primary_key=True)
    user_id    = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name       = db.Column(db.String(255), default='My Catalog')
    pages      = db.Column(db.Text, nullable=True)   # JSON list of processed filenames
    page_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)

    def get_pages(self):
        """Return list of filenames only (backward compat)."""
        if not self.pages:
            return []
        data = json.loads(self.pages)
        return [p['file'] if isinstance(p, dict) else p for p in data]

    def get_page_data(self):
        """Return list of {'file': ..., 'price': ...} dicts."""
        if not self.pages:
            return []
        data = json.loads(self.pages)
        return [p if isinstance(p, dict) else {'file': p, 'price': ''} for p in data]

    def set_pages(self, pages_list):
        """Accept list of dicts {'file':..,'price':..} or plain strings."""
        self.pages      = json.dumps(pages_list)
        self.page_count = len(pages_list)
        self.updated_at = datetime.utcnow()

    @property
    def upload_dir(self):
        path = os.path.join('static', 'uploads', str(self.user_id), str(self.id))
        os.makedirs(path, exist_ok=True)
        return path

    @property
    def processed_dir(self):
        path = os.path.join('static', 'processed', str(self.user_id), str(self.id))
        os.makedirs(path, exist_ok=True)
        return path


class PaymentRequest(db.Model):
    id             = db.Column(db.Integer, primary_key=True)
    user_id        = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    requested_plan = db.Column(db.String(20), default='pro')
    amount         = db.Column(db.Float, default=20.0)
    payment_method = db.Column(db.String(100))
    reference      = db.Column(db.String(500))
    notes          = db.Column(db.Text)
    status         = db.Column(db.String(20), default='pending')
    months         = db.Column(db.Integer, default=1)
    submitted_at   = db.Column(db.DateTime, default=datetime.utcnow)
    processed_at   = db.Column(db.DateTime, nullable=True)


# ── Email ─────────────────────────────────────────────────────────────────────

def send_email(to, subject, body):
    if not app.config.get('MAIL_SERVER') or not app.config.get('MAIL_USERNAME'):
        return False
    try:
        mail.send(Message(subject, recipients=[to], body=body))
        return True
    except Exception as exc:
        app.logger.error('Email failed: %s', exc)
        return False

def admin_email():
    admin = User.query.filter_by(is_admin=True).first()
    return admin.email if admin else None


# ── Image helpers ─────────────────────────────────────────────────────────────

def fit_with_padding(img, target_w, target_h, bg=(255, 255, 255)):
    """Resize image to fit inside target dimensions, pad remainder with bg colour."""
    img.thumbnail((target_w, target_h), Image.LANCZOS)
    canvas = Image.new('RGB', (target_w, target_h), bg)
    x = (target_w - img.width)  // 2
    y = (target_h - img.height) // 2
    canvas.paste(img, (x, y))
    return canvas

def allowed_file(filename):
    return os.path.splitext(filename)[1].lower() in ALLOWED_EXTENSIONS


# ── Decorators ────────────────────────────────────────────────────────────────

def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated

def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('login'))
        user = db.session.get(User, session['user_id'])
        if not user or not user.is_admin:
            flash('Admin access required.', 'error')
            return redirect(url_for('index'))
        return f(*args, **kwargs)
    return decorated

def current_user():
    if 'user_id' in session:
        return db.session.get(User, session['user_id'])
    return None

def get_catalog_or_404(catalog_id, user):
    catalog = db.session.get(Catalog, catalog_id)
    if not catalog or catalog.user_id != user.id:
        return None
    return catalog


# ── Auth ──────────────────────────────────────────────────────────────────────

@app.route('/register', methods=['GET', 'POST'])
def register():
    if 'user_id' in session:
        return redirect(url_for('index'))
    if request.method == 'POST':
        name     = request.form.get('name', '').strip()
        email    = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')
        if not name or not email or not password:
            flash('All fields are required.', 'error')
            return render_template('register.html')
        if len(password) < 6:
            flash('Password must be at least 6 characters.', 'error')
            return render_template('register.html')
        if User.query.filter_by(email=email).first():
            flash('An account with that email already exists.', 'error')
            return render_template('register.html')
        is_first = User.query.count() == 0
        user = User(name=name, email=email,
                    password_hash=generate_password_hash(password),
                    is_admin=is_first)
        db.session.add(user)
        db.session.commit()
        session['user_id'] = user.id
        flash('Account created!' if not is_first else 'Account created! You are the admin.', 'success')
        return redirect(url_for('index'))
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if 'user_id' in session:
        return redirect(url_for('index'))
    if request.method == 'POST':
        email    = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')
        user     = User.query.filter_by(email=email).first()
        if not user or not check_password_hash(user.password_hash, password):
            flash('Invalid email or password.', 'error')
            return render_template('login.html')
        session['user_id'] = user.id
        flash(f'Welcome back, {user.name}!', 'success')
        return redirect(url_for('index'))
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))


# ── Catalog list (home) ───────────────────────────────────────────────────────

@app.route('/')
@login_required
def index():
    user     = current_user()
    catalogs = Catalog.query.filter_by(user_id=user.id).order_by(Catalog.updated_at.desc()).all()
    return render_template('index.html', user=user, catalogs=catalogs,
                           free_max_images=FREE_MAX_IMAGES,
                           basic_max_images=BASIC_MAX_IMAGES,
                           basic_monthly_limit=BASIC_MONTHLY_LIMIT,
                           basic_price=BASIC_PRICE_PGK,
                           pro_price=PRO_PRICE_PGK)

@app.route('/catalog/new', methods=['POST'])
@login_required
def new_catalog():
    user = current_user()
    if not user.can_create_catalog:
        flash('You have reached your catalog limit. Upgrade to create more.', 'error')
        return redirect(url_for('index'))
    catalog = Catalog(user_id=user.id, name='My Catalog')
    db.session.add(catalog)
    db.session.commit()
    return redirect(url_for('workspace', catalog_id=catalog.id))


# ── Workspace ─────────────────────────────────────────────────────────────────

@app.route('/workspace/<int:catalog_id>')
@login_required
def workspace(catalog_id):
    user    = current_user()
    catalog = get_catalog_or_404(catalog_id, user)
    if not catalog:
        flash('Catalog not found.', 'error')
        return redirect(url_for('index'))
    return render_template('workspace.html', user=user, catalog=catalog,
                           max_images=user.max_images,
                           free_max_images=FREE_MAX_IMAGES,
                           basic_max_images=BASIC_MAX_IMAGES)

@app.route('/workspace/<int:catalog_id>/upload', methods=['POST'])
@login_required
def upload(catalog_id):
    user    = current_user()
    catalog = get_catalog_or_404(catalog_id, user)
    if not catalog:
        return jsonify({'error': 'Not found'}), 404
    files, uploaded = request.files.getlist('images'), []
    for f in files:
        if f and f.filename and allowed_file(f.filename):
            ext      = os.path.splitext(f.filename)[1].lower()
            filename = f'{uuid.uuid4().hex}{ext}'
            f.save(os.path.join(catalog.upload_dir, filename))
            uploaded.append(filename)
    return jsonify({'files': uploaded})

@app.route('/workspace/<int:catalog_id>/process', methods=['POST'])
@login_required
def process(catalog_id):
    user    = current_user()
    catalog = get_catalog_or_404(catalog_id, user)
    if not catalog:
        return jsonify({'error': 'Not found'}), 404

    data      = request.get_json()
    order     = data.get('order', [])
    name      = data.get('name', '').strip() or catalog.name
    prices    = data.get('prices', {})   # {orig_filename: "K25"}
    names     = data.get('names',  {})   # {orig_filename: "Red Dress"}
    image_cap = user.max_images
    capped    = False
    if image_cap and len(order) > image_cap:
        order, capped = order[:image_cap], True

    proc_dir = catalog.processed_dir
    for old in os.listdir(proc_dir):
        os.remove(os.path.join(proc_dir, old))

    processed, errors = [], []
    for i, filename in enumerate(order):
        src = os.path.join(catalog.upload_dir, filename)
        if not os.path.exists(src):
            # Fall back: user is re-editing an already-processed catalog
            src = os.path.join(catalog.processed_dir, filename)
        if not os.path.exists(src):
            errors.append(f'Missing: {filename}'); continue
        try:
            img      = Image.open(src).convert('RGB')
            img      = fit_with_padding(img, TARGET_WIDTH, TARGET_HEIGHT)
            out_name = f'page_{i + 1:03d}.jpg'
            img.save(os.path.join(proc_dir, out_name), 'JPEG', quality=72, optimize=True, progressive=True)
            processed.append({
                'file':      out_name,
                'src_file':  filename,
                'price':     prices.get(filename, ''),
                'item_name': names.get(filename, ''),
            })
        except Exception as e:
            errors.append(str(e))

    catalog.name = name
    catalog.set_pages(processed)
    db.session.commit()
    return jsonify({'processed': [p['file'] for p in processed], 'count': len(processed),
                    'capped': capped, 'cap': image_cap, 'errors': errors})

@app.route('/workspace/<int:catalog_id>/rename', methods=['POST'])
@login_required
def rename_catalog(catalog_id):
    user    = current_user()
    catalog = get_catalog_or_404(catalog_id, user)
    if not catalog:
        return jsonify({'error': 'Not found'}), 404
    name = (request.get_json() or {}).get('name', '').strip()
    if name:
        catalog.name       = name
        catalog.updated_at = datetime.utcnow()
        db.session.commit()
    return jsonify({'name': catalog.name})

@app.route('/workspace/<int:catalog_id>/clear', methods=['POST'])
@login_required
def clear(catalog_id):
    user    = current_user()
    catalog = get_catalog_or_404(catalog_id, user)
    if not catalog:
        return jsonify({'error': 'Not found'}), 404
    for folder in [catalog.upload_dir, catalog.processed_dir]:
        for f in os.listdir(folder):
            os.remove(os.path.join(folder, f))
    catalog.set_pages([])
    db.session.commit()
    return jsonify({'ok': True})


# ── Flipbook view ─────────────────────────────────────────────────────────────

@app.route('/catalog/<int:catalog_id>')
@login_required
def catalog_view(catalog_id):
    user    = current_user()
    catalog = get_catalog_or_404(catalog_id, user)
    if not catalog:
        flash('Catalog not found.', 'error')
        return redirect(url_for('index'))
    # Build WhatsApp deep-link with PNG number normalisation
    wa_link = None
    if user.whatsapp:
        digits = re.sub(r'[^\d]', '', user.whatsapp)
        if len(digits) == 8:           # local PNG 8-digit
            digits = '675' + digits
        elif digits.startswith('0') and len(digits) == 9:
            digits = '675' + digits[1:]
        msg = "Hi! I just viewed your flipbook catalog and would like to make an order."
        wa_link = f"https://wa.me/{digits}?text={url_quote(msg)}"
    pay_list  = json.loads(user.payment_methods  or '[]')
    delv_list = json.loads(user.delivery_methods or '[]')
    return render_template('catalog.html', user=user, catalog=catalog,
                           page_data=catalog.get_page_data(),
                           wa_link=wa_link,
                           payment_methods_list=pay_list,
                           delivery_methods_list=delv_list)

_FONT_BOLD = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
_FONT_REG  = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'

def _font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

def _gradient_stripe(draw, y0, y1, width):
    stops = [(108,99,255), (200,30,120), (245,0,87), (255,109,0)]
    for x in range(width):
        t   = x / max(width - 1, 1)
        seg = t * (len(stops) - 1)
        i   = min(int(seg), len(stops) - 2)
        f   = seg - i
        c   = tuple(int(stops[i][j] + (stops[i+1][j] - stops[i][j]) * f) for j in range(3))
        draw.line([(x, y0), (x, y1)], fill=c)

def _centered_text(draw, text, x, y, font, fill):
    bb = draw.textbbox((0, 0), text, font=font)
    w  = bb[2] - bb[0]
    draw.text((x - w // 2, y), text, font=font, fill=fill)

def _wrapped_text(draw, text, cx, y, font, fill, max_width):
    words = text.split()
    line  = ''
    for word in words:
        test = (line + ' ' + word).strip()
        bb   = draw.textbbox((0, 0), test, font=font)
        if bb[2] - bb[0] > max_width and line:
            _centered_text(draw, line, cx, y, font, fill)
            y    += (bb[3] - bb[1]) + 6
            line  = word
        else:
            line = test
    if line:
        _centered_text(draw, line, cx, y, font, fill)
    return y

def _make_cover(catalog, user):
    W, H = 800, 1000
    img  = Image.new('RGB', (W, H), (26, 26, 46))
    draw = ImageDraw.Draw(img)
    _gradient_stripe(draw, 0, 6, W)
    # subtle circle accent
    for r in range(200, 0, -1):
        alpha = int(40 * (1 - r / 200))
        draw.ellipse([W - r - 30, H - r - 30, W - 30 + r, H - 30 + r],
                     outline=(108, 99, 255, alpha))
    # eyebrow
    _centered_text(draw, 'PRODUCT CATALOG', W // 2, 90,
                   _font(_FONT_BOLD, 13), (255, 255, 255, 90))
    # catalog name (wrapped)
    name_font = _font(_FONT_BOLD, 52)
    name      = catalog.name
    bb        = draw.textbbox((0, 0), name, font=name_font)
    nw        = bb[2] - bb[0]
    if nw > W - 80:
        name_font = _font(_FONT_BOLD, 36)
    _wrapped_text(draw, name, W // 2, H // 2 - 70, name_font, (255, 255, 255), W - 80)
    # rule
    draw.rectangle([W // 2 - 32, H // 2 + 10, W // 2 + 32, H // 2 + 14], fill=(108, 99, 255))
    # business name
    if user.business_name:
        _centered_text(draw, user.business_name.upper(), W // 2, H // 2 + 34,
                       _font(_FONT_REG, 18), (255, 255, 255, 100))
    return img

def _make_product_page(item, proc_dir, catalog, user):
    W, H  = 800, 1000
    fname = item['file'] if isinstance(item, dict) else item
    iname = (item.get('item_name') or '') if isinstance(item, dict) else ''
    price = (item.get('price') or '')    if isinstance(item, dict) else ''
    path  = os.path.join(proc_dir, fname)
    if os.path.exists(path):
        pg = Image.open(path).convert('RGB').resize((W, H), Image.LANCZOS)
    else:
        pg = Image.new('RGB', (W, H), (255, 255, 255))
    draw = ImageDraw.Draw(pg)
    DARK = (15, 15, 30)
    TXT  = (210, 210, 230)
    # header bar
    draw.rectangle([0, 0, W, 28], fill=DARK)
    _gradient_stripe(draw, 0, 4, W)
    header = f"Product Catalog  —  {catalog.name}"
    _centered_text(draw, header, W // 2, 7, _font(_FONT_REG, 13), TXT)
    # item name bar
    if iname:
        draw.rectangle([0, 28, W, 60], fill=(20, 20, 40))
        _centered_text(draw, iname, W // 2, 35, _font(_FONT_BOLD, 18), (255, 255, 255))
    # price bar
    if price:
        draw.rectangle([0, H - 56, W, H - 28], fill=(20, 20, 40))
        _centered_text(draw, price, W // 2, H - 50, _font(_FONT_BOLD, 22), (255, 255, 255))
    # footer bar
    draw.rectangle([0, H - 28, W, H], fill=DARK)
    parts = []
    if user.business_name: parts.append(user.business_name)
    if user.email:          parts.append(user.email)
    if user.whatsapp:       parts.append(f"WhatsApp: {user.whatsapp}")
    _centered_text(draw, '  |  '.join(parts), W // 2, H - 22,
                   _font(_FONT_REG, 11), (150, 150, 170))
    return pg

def _make_back_cover(catalog, user):
    W, H = 800, 1000
    img  = Image.new('RGB', (W, H), (255, 255, 255))
    draw = ImageDraw.Draw(img)
    _gradient_stripe(draw, 0, 5, W)
    y = 38
    if user.business_name:
        _centered_text(draw, user.business_name.upper(), W // 2, y,
                       _font(_FONT_BOLD, 13), (156, 163, 175))
        y += 32
    _centered_text(draw, 'Thank you for supporting', W // 2, y,
                   _font(_FONT_BOLD, 34), (15, 23, 42))
    y += 44
    _centered_text(draw, 'a local PNG SME!', W // 2, y,
                   _font(_FONT_BOLD, 34), (15, 23, 42))
    y += 44
    _centered_text(draw, 'Got questions or ready to order? Follow the simple steps below.',
                   W // 2, y, _font(_FONT_REG, 16), (100, 116, 139))
    y += 36
    # steps box
    steps = [
        ('1', 'Browse & Choose', 'Pick your favourite items from this catalog.'),
        ('2', 'Contact Us',      'Send us a message on WhatsApp with your order details.'),
        ('3', 'Confirm & Pay',   'We confirm your order and agree on payment & delivery.'),
    ]
    pad  = 60
    bx0, bx1 = pad, W - pad
    bh   = 36 + len(steps) * 62
    try:
        draw.rounded_rectangle([bx0, y, bx1, y + bh], radius=10,
                                fill=(248, 249, 251), outline=(226, 232, 240))
    except AttributeError:
        draw.rectangle([bx0, y, bx1, y + bh], fill=(248, 249, 251), outline=(226, 232, 240))
    sy = y + 18
    for num, title, desc in steps:
        draw.ellipse([bx0 + 12, sy, bx0 + 38, sy + 26], fill=(108, 99, 255))
        _centered_text(draw, num, bx0 + 25, sy + 5, _font(_FONT_BOLD, 13), (255, 255, 255))
        draw.text((bx0 + 50, sy + 2),  title, font=_font(_FONT_BOLD, 15), fill=(15, 23, 42))
        draw.text((bx0 + 50, sy + 20), desc,  font=_font(_FONT_REG, 12),  fill=(100, 116, 139))
        sy += 62
    y = sy + 22
    # WhatsApp button
    if user.whatsapp:
        try:
            draw.rounded_rectangle([pad, y, W - pad, y + 44], radius=8, fill=(37, 211, 102))
        except AttributeError:
            draw.rectangle([pad, y, W - pad, y + 44], fill=(37, 211, 102))
        _centered_text(draw, f"WhatsApp Us: {user.whatsapp}", W // 2, y + 12,
                       _font(_FONT_BOLD, 17), (255, 255, 255))
        y += 58
    # payment / delivery badges
    pay_methods = json.loads(user.payment_methods or '[]')
    del_methods  = json.loads(user.delivery_methods or '[]')
    if pay_methods or del_methods:
        col_w = (W - 120 - 10) // 2
        for col_idx, (label, methods, badge_fill, badge_txt) in enumerate([
            ('PAYMENT',  pay_methods, (237, 233, 254), (91, 33, 182)),
            ('DELIVERY', del_methods, (220, 252, 231), (21, 128, 61)),
        ]):
            bx = pad + col_idx * (col_w + 10)
            bh2 = 28 + max(len(methods), 1) * 20 + 12
            try:
                draw.rounded_rectangle([bx, y, bx + col_w, y + bh2], radius=7,
                                        fill=(248, 249, 251), outline=(226, 232, 240))
            except AttributeError:
                draw.rectangle([bx, y, bx + col_w, y + bh2], fill=(248, 249, 251), outline=(226, 232, 240))
            draw.text((bx + 10, y + 8), label, font=_font(_FONT_BOLD, 11), fill=(100, 116, 139))
            my = y + 24
            for m in methods:
                short = m[:32] + ('…' if len(m) > 32 else '')
                try:
                    draw.rounded_rectangle([bx + 8, my, bx + col_w - 8, my + 16],
                                            radius=3, fill=badge_fill)
                except AttributeError:
                    draw.rectangle([bx + 8, my, bx + col_w - 8, my + 16], fill=badge_fill)
                draw.text((bx + 12, my + 3), short, font=_font(_FONT_REG, 10), fill=badge_txt)
                my += 20
    # footer links
    fy = H - 52
    draw.line([(pad, fy), (W - pad, fy)], fill=(241, 245, 249), width=1)
    fy += 8
    if user.facebook_url:
        draw.text((pad, fy), f"fb  {user.facebook_url}", font=_font(_FONT_BOLD, 12), fill=(24, 119, 242))
        fy += 20
    if user.email:
        draw.text((pad, fy), f"✉  {user.email}", font=_font(_FONT_REG, 11), fill=(148, 163, 184))
    return img

def generate_catalog_pdf(catalog, user):
    page_data = catalog.get_page_data()
    proc_dir  = catalog.processed_dir
    pages     = [_make_cover(catalog, user)]
    for item in page_data:
        pages.append(_make_product_page(item, proc_dir, catalog, user))
    pages.append(_make_back_cover(catalog, user))
    buf = io.BytesIO()
    pages[0].save(buf, format='PDF', save_all=True, append_images=pages[1:], resolution=96)
    buf.seek(0)
    return buf


@app.route('/catalog/<int:catalog_id>/download')
@login_required
def download_catalog(catalog_id):
    user    = current_user()
    catalog = get_catalog_or_404(catalog_id, user)
    if not catalog:
        return jsonify({'error': 'Not found'}), 404
    if not catalog.get_pages():
        flash('No images in this catalog yet.', 'error')
        return redirect(url_for('workspace', catalog_id=catalog_id))
    buf       = generate_catalog_pdf(catalog, user)
    safe_name = ''.join(c for c in catalog.name if c.isalnum() or c in ' _-')[:40].strip()
    return send_file(buf, mimetype='application/pdf',
                     as_attachment=True, download_name=f'{safe_name or "catalog"}.pdf')

@app.route('/catalog/<int:catalog_id>/delete', methods=['POST'])
@login_required
def delete_catalog(catalog_id):
    user    = current_user()
    catalog = get_catalog_or_404(catalog_id, user)
    if not catalog:
        flash('Catalog not found.', 'error')
        return redirect(url_for('index'))
    name = catalog.name
    shutil.rmtree(catalog.upload_dir,    ignore_errors=True)
    shutil.rmtree(catalog.processed_dir, ignore_errors=True)
    db.session.delete(catalog)
    db.session.commit()
    flash(f'"{name}" deleted.', 'success')
    return redirect(url_for('index'))


# ── Dashboard (plan info) ─────────────────────────────────────────────────────

@app.route('/dashboard')
@login_required
def dashboard():
    user    = current_user()
    pending = PaymentRequest.query.filter_by(user_id=user.id, status='pending').first()
    return render_template('dashboard.html', user=user, pending=pending,
                           free_max_images=FREE_MAX_IMAGES,
                           basic_max_images=BASIC_MAX_IMAGES,
                           basic_price=BASIC_PRICE_PGK,
                           pro_price=PRO_PRICE_PGK,
                           basic_monthly_limit=BASIC_MONTHLY_LIMIT)


# ── Forgot / Reset Password ───────────────────────────────────────────────────

@app.route('/forgot-password', methods=['GET', 'POST'])
def forgot_password():
    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        user  = User.query.filter_by(email=email).first()
        # Always show success to avoid user enumeration
        if user:
            token = secrets.token_urlsafe(32)
            user.reset_token     = token
            user.reset_token_exp = datetime.utcnow() + timedelta(hours=1)
            db.session.commit()
            reset_url = request.host_url.rstrip('/') + f'/reset-password/{token}'
            sent = send_email(
                user.email,
                'CatalogKit — Reset your password',
                f'Hi {user.name},\n\nClick the link below to reset your password. '
                f'It expires in 1 hour.\n\n{reset_url}\n\n'
                f'If you did not request this, you can ignore this email.'
            )
            return render_template('forgot_password.html',
                                   sent=sent, reset_url=(None if sent else reset_url),
                                   mail_configured=sent)
        return render_template('forgot_password.html', sent=True, reset_url=None, mail_configured=True)
    return render_template('forgot_password.html', sent=False, reset_url=None, mail_configured=None)


@app.route('/reset-password/<token>', methods=['GET', 'POST'])
def reset_password(token):
    user = User.query.filter_by(reset_token=token).first()
    if not user or not user.reset_token_exp or user.reset_token_exp < datetime.utcnow():
        flash('This reset link is invalid or has expired. Please request a new one.', 'error')
        return redirect(url_for('forgot_password'))
    if request.method == 'POST':
        pw  = request.form.get('password', '')
        pw2 = request.form.get('password2', '')
        if len(pw) < 6:
            return render_template('reset_password.html', token=token, error='Password must be at least 6 characters.')
        if pw != pw2:
            return render_template('reset_password.html', token=token, error='Passwords do not match.')
        user.password_hash  = generate_password_hash(pw)
        user.reset_token    = None
        user.reset_token_exp = None
        db.session.commit()
        flash('Your password has been reset. Please sign in.', 'success')
        return redirect(url_for('login'))
    return render_template('reset_password.html', token=token, error=None)


# ── Profile ───────────────────────────────────────────────────────────────────

@app.route('/profile', methods=['GET', 'POST'])
@login_required
def profile():
    user = current_user()
    if request.method == 'POST':
        user.business_name  = request.form.get('business_name', '').strip() or None
        user.contact_person = request.form.get('contact_person', '').strip() or None
        user.location       = request.form.get('location', '').strip() or None
        user.whatsapp       = request.form.get('whatsapp', '').strip() or None
        user.phone          = request.form.get('phone', '').strip() or None
        user.email          = request.form.get('email', '').strip().lower() or user.email
        user.facebook_url   = request.form.get('facebook_url', '').strip() or None
        pay  = request.form.getlist('payment_methods')
        delv = request.form.getlist('delivery_methods')
        user.payment_methods  = json.dumps(pay)  if pay  else None
        user.delivery_methods = json.dumps(delv) if delv else None
        db.session.commit()
        flash('Profile updated!', 'success')
        return redirect(url_for('profile'))
    return render_template('profile.html', user=user)


# ── Upgrade ───────────────────────────────────────────────────────────────────

@app.route('/upgrade')
@login_required
def upgrade():
    user    = current_user()
    pending = PaymentRequest.query.filter_by(user_id=user.id, status='pending').first()
    return render_template('upgrade.html', user=user,
                           payment_info=PAYMENT_INFO,
                           basic_price=BASIC_PRICE_PGK,
                           pro_price=PRO_PRICE_PGK,
                           basic_max_images=BASIC_MAX_IMAGES,
                           basic_monthly_limit=BASIC_MONTHLY_LIMIT,
                           pending=pending)

@app.route('/upgrade/submit', methods=['POST'])
@login_required
def submit_payment():
    user = current_user()
    if user.has_pending_payment():
        flash('You already have a payment pending approval.', 'error')
        return redirect(url_for('upgrade'))
    requested_plan = request.form.get('plan', 'pro')
    if requested_plan not in ('basic', 'pro'):
        requested_plan = 'pro'
    months    = max(1, int(request.form.get('months', 1)))
    method    = request.form.get('method', '').strip()
    reference = request.form.get('reference', '').strip()
    notes     = request.form.get('notes', '').strip()
    if not method or not reference:
        flash('Payment method and reference are required.', 'error')
        return redirect(url_for('upgrade'))
    price = BASIC_PRICE_PGK if requested_plan == 'basic' else PRO_PRICE_PGK
    pr = PaymentRequest(
        user_id=user.id, requested_plan=requested_plan,
        amount=price * months, months=months,
        payment_method=method, reference=reference, notes=notes,
    )
    db.session.add(pr)
    db.session.commit()

    # Notify admin
    ae = admin_email()
    if ae:
        send_email(ae,
            f'New CatalogKit payment — {user.name} ({requested_plan.capitalize()})',
            f'{user.name} ({user.email}) submitted a {requested_plan.capitalize()} plan payment.\n'
            f'Amount: K{price * months} for {months} month(s)\n'
            f'Method: {method}\nReference: {reference}\n'
            f'Notes: {notes or "(none)"}\n\nReview in the admin panel.'
        )

    flash('Payment submitted! We will review and activate your plan shortly.', 'success')
    return redirect(url_for('dashboard'))


# ── Admin ─────────────────────────────────────────────────────────────────────

@app.route('/admin')
@admin_required
def admin():
    pending   = PaymentRequest.query.filter_by(status='pending').order_by(PaymentRequest.submitted_at).all()
    all_users = User.query.order_by(User.created_at.desc()).all()
    recent    = PaymentRequest.query.filter(PaymentRequest.status != 'pending') \
                    .order_by(PaymentRequest.processed_at.desc()).limit(20).all()
    return render_template('admin.html', pending=pending, all_users=all_users,
                           recent=recent, basic_price=BASIC_PRICE_PGK, pro_price=PRO_PRICE_PGK)

@app.route('/admin/payment/<int:payment_id>/approve', methods=['POST'])
@admin_required
def approve_payment(payment_id):
    pr = db.session.get(PaymentRequest, payment_id)
    if not pr:
        flash('Payment not found.', 'error')
        return redirect(url_for('admin'))
    pr.status       = 'approved'
    pr.processed_at = datetime.utcnow()
    user              = pr.user
    months            = pr.months or 1
    start             = max(datetime.utcnow(), user.plan_expires or datetime.utcnow())
    user.plan         = pr.requested_plan or 'pro'
    user.plan_start   = datetime.utcnow()
    user.plan_expires = start + timedelta(days=30 * months)
    db.session.commit()

    plan_name = 'Basic' if user.plan == 'basic' else 'Pro'
    expires   = user.plan_expires.strftime('%d %b %Y')
    flash(f'Approved! {user.name} is now on {plan_name} until {expires}.', 'success')

    send_email(user.email,
        f'Your CatalogKit {plan_name} plan is now active!',
        f'Hi {user.name},\n\nYour payment has been confirmed and your {plan_name} plan '
        f'is now active until {expires}.\n\nLog in and start building your catalogs!\n\n'
        f'Thank you for subscribing to CatalogKit.'
    )
    return redirect(url_for('admin'))

@app.route('/admin/payment/<int:payment_id>/reject', methods=['POST'])
@admin_required
def reject_payment(payment_id):
    pr = db.session.get(PaymentRequest, payment_id)
    if not pr:
        flash('Payment not found.', 'error')
        return redirect(url_for('admin'))
    pr.status       = 'rejected'
    pr.processed_at = datetime.utcnow()
    db.session.commit()
    flash('Payment rejected.', 'success')

    user = pr.user
    send_email(user.email,
        'CatalogKit — payment could not be verified',
        f'Hi {user.name},\n\nWe could not verify your recent payment. '
        f'Please contact us to sort this out.\n\n'
        f'Contact: {PAYMENT_INFO["contact"]}\n\n'
        f'Please include your payment reference when you get in touch.'
    )
    return redirect(url_for('admin'))

@app.route('/admin/user/<int:user_id>/revoke', methods=['POST'])
@admin_required
def revoke_pro(user_id):
    user = db.session.get(User, user_id)
    if user:
        user.plan = 'free'; user.plan_expires = None; user.plan_start = None
        db.session.commit()
        flash(f'{user.name} reverted to Free plan.', 'success')
    return redirect(url_for('admin'))

@app.route('/admin/user/<int:user_id>/grant', methods=['POST'])
@admin_required
def grant_pro(user_id):
    user   = db.session.get(User, user_id)
    months = int(request.form.get('months', 1))
    plan   = request.form.get('plan', 'pro')
    if plan not in ('basic', 'pro'): plan = 'pro'
    if user:
        start             = max(datetime.utcnow(), user.plan_expires or datetime.utcnow())
        user.plan         = plan
        user.plan_start   = datetime.utcnow()
        user.plan_expires = start + timedelta(days=30 * months)
        db.session.commit()
        flash(f'{user.name} granted {plan.capitalize()} for {months} month(s).', 'success')
    return redirect(url_for('admin'))


# ── Context processor ─────────────────────────────────────────────────────────

@app.context_processor
def inject_globals():
    return dict(current_user=current_user())


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        # Safe migrations for existing DBs
        with db.engine.connect() as conn:
            for stmt in [
                'ALTER TABLE catalog ADD COLUMN pages TEXT',
                'ALTER TABLE catalog ADD COLUMN updated_at DATETIME',
                'ALTER TABLE user ADD COLUMN plan_start DATETIME',
                'ALTER TABLE payment_request ADD COLUMN requested_plan VARCHAR(20) DEFAULT "pro"',
                'ALTER TABLE user ADD COLUMN business_name VARCHAR(255)',
                'ALTER TABLE user ADD COLUMN contact_person VARCHAR(255)',
                'ALTER TABLE user ADD COLUMN location VARCHAR(255)',
                'ALTER TABLE user ADD COLUMN whatsapp VARCHAR(50)',
                'ALTER TABLE user ADD COLUMN phone VARCHAR(50)',
                'ALTER TABLE user ADD COLUMN facebook_url VARCHAR(500)',
                'ALTER TABLE user ADD COLUMN payment_methods TEXT',
                'ALTER TABLE user ADD COLUMN delivery_methods TEXT',
                'ALTER TABLE user ADD COLUMN reset_token VARCHAR(100)',
                'ALTER TABLE user ADD COLUMN reset_token_exp DATETIME',
            ]:
                try:
                    conn.execute(text(stmt))
                    conn.commit()
                except Exception:
                    pass
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=False)
