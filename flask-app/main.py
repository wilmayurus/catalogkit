import io
import os
import uuid
import json
import zipfile
from datetime import datetime, timedelta
from functools import wraps

from flask import (Flask, render_template, request, jsonify,
                   send_file, session, redirect, url_for, flash)
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from PIL import Image

app = Flask(__name__)
app.secret_key = os.environ.get('SESSION_SECRET', 'dev-only-change-in-prod')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///catalogkit.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# ── Plan constants ────────────────────────────────────────────────────────────
TARGET_WIDTH  = 800
TARGET_HEIGHT = 1000
ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', '.gif'}

FREE_CATALOG_LIMIT    = 1      # total catalogs on free plan
FREE_MAX_IMAGES       = 5      # images per catalog on free plan
BASIC_MAX_IMAGES      = 20    # images per catalog on basic plan
BASIC_PRICE_PGK       = 5     # K5/month
BASIC_MONTHLY_LIMIT   = 2     # catalogs per billing period on Basic
PRO_PRICE_PGK         = 20    # K20/month — unlimited

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
    plan          = db.Column(db.String(20), default='free')   # free | basic | pro
    plan_expires  = db.Column(db.DateTime, nullable=True)
    plan_start    = db.Column(db.DateTime, nullable=True)      # start of current billing period
    is_admin      = db.Column(db.Boolean, default=False)
    created_at    = db.Column(db.DateTime, default=datetime.utcnow)
    catalogs      = db.relationship('Catalog', backref='user', lazy=True, cascade='all, delete-orphan')
    payments      = db.relationship('PaymentRequest', backref='user', lazy=True, cascade='all, delete-orphan')

    # ── plan booleans ──
    @property
    def is_basic(self):
        return (self.plan == 'basic'
                and self.plan_expires is not None
                and self.plan_expires > datetime.utcnow())

    @property
    def is_pro(self):
        return (self.plan == 'pro'
                and self.plan_expires is not None
                and self.plan_expires > datetime.utcnow())

    @property
    def plan_label(self):
        if self.is_admin: return 'Admin'
        if self.is_pro:   return 'Pro'
        if self.is_basic: return 'Basic'
        return 'Free'

    # ── image cap per catalog (None = unlimited) ──
    @property
    def max_images(self):
        if self.is_admin or self.is_pro:
            return None
        if self.is_basic:
            return BASIC_MAX_IMAGES
        return FREE_MAX_IMAGES

    # ── catalogs created in current billing period (Basic only) ──
    @property
    def catalogs_this_period(self):
        if not self.plan_start:
            return Catalog.query.filter_by(user_id=self.id).count()
        return Catalog.query.filter(
            Catalog.user_id == self.id,
            Catalog.created_at >= self.plan_start
        ).count()

    # ── remaining catalogs this period (None = unlimited) ──
    @property
    def catalogs_remaining(self):
        if self.is_admin or self.is_pro:
            return None
        if self.is_basic:
            used = self.catalogs_this_period
            return max(0, BASIC_MONTHLY_LIMIT - used)
        return None   # free: unlimited catalogs, just capped images

    # ── can create a new catalog? ──
    @property
    def can_create_catalog(self):
        if self.is_admin or self.is_pro:
            return True
        if self.is_basic:
            return self.catalogs_this_period < BASIC_MONTHLY_LIMIT
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
    page_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class PaymentRequest(db.Model):
    id             = db.Column(db.Integer, primary_key=True)
    user_id        = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    requested_plan = db.Column(db.String(20), default='pro')   # basic | pro
    amount         = db.Column(db.Float, default=20.0)
    payment_method = db.Column(db.String(100))
    reference      = db.Column(db.String(500))
    notes          = db.Column(db.Text)
    status         = db.Column(db.String(20), default='pending')
    months         = db.Column(db.Integer, default=1)
    submitted_at   = db.Column(db.DateTime, default=datetime.utcnow)
    processed_at   = db.Column(db.DateTime, nullable=True)


# ── File helpers ──────────────────────────────────────────────────────────────

def user_upload_dir(user_id):
    path = os.path.join('static', 'uploads', str(user_id))
    os.makedirs(path, exist_ok=True)
    return path

def user_processed_dir(user_id):
    path = os.path.join('static', 'processed', str(user_id))
    os.makedirs(path, exist_ok=True)
    return path

def user_catalog_file(user_id):
    return f'catalog_{user_id}.json'

def load_catalog_pages(user_id):
    fname = user_catalog_file(user_id)
    if os.path.exists(fname):
        with open(fname) as f:
            return json.load(f)
    return []

def smart_crop_resize(img, target_w, target_h):
    ratio = img.width / img.height
    target_ratio = target_w / target_h
    if ratio > target_ratio:
        new_h = target_h
        new_w = int(img.width * target_h / img.height)
        img = img.resize((new_w, new_h), Image.LANCZOS)
        left = (new_w - target_w) // 2
        img = img.crop((left, 0, left + target_w, target_h))
    else:
        new_w = target_w
        new_h = int(img.height * target_w / img.width)
        img = img.resize((new_w, new_h), Image.LANCZOS)
        top = (new_h - target_h) // 2
        img = img.crop((0, top, target_w, top + target_h))
    return img

def allowed_file(filename):
    return os.path.splitext(filename)[1].lower() in ALLOWED_EXTENSIONS


# ── Auth decorators ───────────────────────────────────────────────────────────

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
            return redirect(url_for('dashboard'))
        return f(*args, **kwargs)
    return decorated

def current_user():
    if 'user_id' in session:
        return db.session.get(User, session['user_id'])
    return None


# ── Auth routes ───────────────────────────────────────────────────────────────

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
        flash('Account created! You are on the Free plan.' if not is_first else 'Account created! You are the admin.', 'success')
        return redirect(url_for('index'))
    return render_template('register.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if 'user_id' in session:
        return redirect(url_for('index'))
    if request.method == 'POST':
        email    = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')
        user = User.query.filter_by(email=email).first()
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


# ── Dashboard ─────────────────────────────────────────────────────────────────

@app.route('/dashboard')
@login_required
def dashboard():
    user     = current_user()
    catalogs = Catalog.query.filter_by(user_id=user.id).order_by(Catalog.created_at.desc()).all()
    pending  = PaymentRequest.query.filter_by(user_id=user.id, status='pending').first()
    return render_template('dashboard.html', user=user, catalogs=catalogs, pending=pending,
                           free_max_images=FREE_MAX_IMAGES,
                           basic_max_images=BASIC_MAX_IMAGES,
                           basic_price=BASIC_PRICE_PGK,
                           pro_price=PRO_PRICE_PGK,
                           basic_monthly_limit=BASIC_MONTHLY_LIMIT)


# ── Upgrade / Payment ─────────────────────────────────────────────────────────

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

    months = max(1, int(request.form.get('months', 1)))
    method    = request.form.get('method', '').strip()
    reference = request.form.get('reference', '').strip()
    notes     = request.form.get('notes', '').strip()

    if not method or not reference:
        flash('Payment method and reference are required.', 'error')
        return redirect(url_for('upgrade'))

    price_per_month = BASIC_PRICE_PGK if requested_plan == 'basic' else PRO_PRICE_PGK
    pr = PaymentRequest(
        user_id=user.id,
        requested_plan=requested_plan,
        amount=price_per_month * months,
        months=months,
        payment_method=method,
        reference=reference,
        notes=notes,
    )
    db.session.add(pr)
    db.session.commit()
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
                           recent=recent,
                           basic_price=BASIC_PRICE_PGK,
                           pro_price=PRO_PRICE_PGK)


@app.route('/admin/payment/<int:payment_id>/approve', methods=['POST'])
@admin_required
def approve_payment(payment_id):
    pr = db.session.get(PaymentRequest, payment_id)
    if not pr:
        flash('Payment not found.', 'error')
        return redirect(url_for('admin'))

    pr.status       = 'approved'
    pr.processed_at = datetime.utcnow()

    user   = pr.user
    months = pr.months or 1
    start  = max(datetime.utcnow(), user.plan_expires or datetime.utcnow())
    user.plan        = pr.requested_plan or 'pro'
    user.plan_start  = datetime.utcnow()
    user.plan_expires = start + timedelta(days=30 * months)
    db.session.commit()

    plan_name = 'Basic' if user.plan == 'basic' else 'Pro'
    flash(f'Approved! {user.name} is now {plan_name} until {user.plan_expires.strftime("%d %b %Y")}.', 'success')
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
    return redirect(url_for('admin'))


@app.route('/admin/user/<int:user_id>/revoke', methods=['POST'])
@admin_required
def revoke_pro(user_id):
    user = db.session.get(User, user_id)
    if user:
        user.plan        = 'free'
        user.plan_expires = None
        user.plan_start   = None
        db.session.commit()
        flash(f'{user.name} reverted to Free plan.', 'success')
    return redirect(url_for('admin'))


@app.route('/admin/user/<int:user_id>/grant', methods=['POST'])
@admin_required
def grant_pro(user_id):
    user   = db.session.get(User, user_id)
    months = int(request.form.get('months', 1))
    plan   = request.form.get('plan', 'pro')
    if plan not in ('basic', 'pro'):
        plan = 'pro'
    if user:
        start = max(datetime.utcnow(), user.plan_expires or datetime.utcnow())
        user.plan        = plan
        user.plan_start  = datetime.utcnow()
        user.plan_expires = start + timedelta(days=30 * months)
        db.session.commit()
        flash(f'{user.name} granted {plan.capitalize()} for {months} month(s).', 'success')
    return redirect(url_for('admin'))


# ── Core app routes ───────────────────────────────────────────────────────────

@app.route('/')
@login_required
def index():
    user = current_user()
    return render_template('index.html',
                           user=user,
                           can_create=user.can_create_catalog,
                           max_images=user.max_images,
                           catalogs_remaining=user.catalogs_remaining,
                           basic_monthly_limit=BASIC_MONTHLY_LIMIT,
                           basic_max_images=BASIC_MAX_IMAGES,
                           free_max_images=FREE_MAX_IMAGES)


@app.route('/upload', methods=['POST'])
@login_required
def upload():
    user       = current_user()
    files      = request.files.getlist('images')
    uploaded   = []
    upload_dir = user_upload_dir(user.id)
    for f in files:
        if f and f.filename and allowed_file(f.filename):
            ext      = os.path.splitext(f.filename)[1].lower()
            filename = f'{uuid.uuid4().hex}{ext}'
            f.save(os.path.join(upload_dir, filename))
            uploaded.append(filename)
    return jsonify({'files': uploaded})


@app.route('/process', methods=['POST'])
@login_required
def process():
    user = current_user()

    if not user.can_create_catalog:
        return jsonify({
            'error': 'limit_reached',
            'message': f'You have used your {BASIC_MONTHLY_LIMIT} catalogs this month. '
                       f'Upgrade to Pro (K{PRO_PRICE_PGK}/mo) for unlimited catalogs.'
        }), 403

    data         = request.get_json()
    order        = data.get('order', [])
    catalog_name = data.get('name', 'My Catalog')

    # Apply image cap for free users
    image_cap = user.max_images
    capped    = False
    if image_cap and len(order) > image_cap:
        order  = order[:image_cap]
        capped = True

    proc_dir   = user_processed_dir(user.id)
    upload_dir = user_upload_dir(user.id)

    for old in os.listdir(proc_dir):
        os.remove(os.path.join(proc_dir, old))

    processed = []
    errors    = []
    for i, filename in enumerate(order):
        src = os.path.join(upload_dir, filename)
        if not os.path.exists(src):
            errors.append(f'Missing: {filename}')
            continue
        try:
            img      = Image.open(src).convert('RGB')
            img      = smart_crop_resize(img, TARGET_WIDTH, TARGET_HEIGHT)
            out_name = f'page_{i + 1:03d}.jpg'
            out_path = os.path.join(proc_dir, out_name)
            img.save(out_path, 'JPEG', quality=72, optimize=True, progressive=True)
            processed.append(out_name)
        except Exception as e:
            errors.append(f'Error: {e}')

    with open(user_catalog_file(user.id), 'w') as f:
        json.dump(processed, f)

    catalog = Catalog(user_id=user.id, name=catalog_name, page_count=len(processed))
    db.session.add(catalog)
    db.session.commit()

    return jsonify({
        'processed': processed,
        'count':     len(processed),
        'capped':    capped,
        'cap':       image_cap,
        'errors':    errors,
    })


@app.route('/catalog')
@login_required
def catalog():
    user  = current_user()
    pages = load_catalog_pages(user.id)
    return render_template('catalog.html', user=user, pages=pages)


@app.route('/download-all')
@login_required
def download_all():
    user  = current_user()
    pages = load_catalog_pages(user.id)
    if not pages:
        return jsonify({'error': 'No processed images found'}), 404
    proc_dir = user_processed_dir(user.id)
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, 'w', zipfile.ZIP_DEFLATED) as zf:
        for page in pages:
            path = os.path.join(proc_dir, page)
            if os.path.exists(path):
                zf.write(path, page)
    buf.seek(0)
    return send_file(buf, mimetype='application/zip',
                     as_attachment=True, download_name='catalog_images.zip')


@app.route('/clear', methods=['POST'])
@login_required
def clear():
    user     = current_user()
    for folder in [user_upload_dir(user.id), user_processed_dir(user.id)]:
        for f in os.listdir(folder):
            os.remove(os.path.join(folder, f))
    fname = user_catalog_file(user.id)
    if os.path.exists(fname):
        os.remove(fname)
    return jsonify({'ok': True})


# ── Template globals ──────────────────────────────────────────────────────────

@app.context_processor
def inject_globals():
    return dict(current_user=current_user())


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=False)
