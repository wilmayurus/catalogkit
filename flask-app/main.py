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

TARGET_WIDTH = 800
TARGET_HEIGHT = 1000
ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', '.gif'}
FREE_CATALOG_LIMIT = 1
PRO_PRICE_PGK = 20

PAYMENT_INFO = {
    'cell_moni': os.environ.get('CELL_MONI_NUMBER', '7XX XXX XXX'),
    'bank': os.environ.get('BANK_ACCOUNT', 'BSP — Account: 1000XXXXXX — Name: Your Business Name'),
    'contact': os.environ.get('ADMIN_CONTACT', 'admin@youremail.com'),
}


# ── Models ──────────────────────────────────────────────────────────────────

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    plan = db.Column(db.String(20), default='free')
    plan_expires = db.Column(db.DateTime, nullable=True)
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    catalogs = db.relationship('Catalog', backref='user', lazy=True, cascade='all, delete-orphan')
    payments = db.relationship('PaymentRequest', backref='user', lazy=True, cascade='all, delete-orphan')

    @property
    def is_pro(self):
        return (self.plan == 'pro'
                and self.plan_expires is not None
                and self.plan_expires > datetime.utcnow())

    @property
    def plan_label(self):
        if self.is_admin:
            return 'Admin'
        if self.is_pro:
            return 'Pro'
        return 'Free'

    @property
    def catalog_count(self):
        return len(self.catalogs)

    @property
    def can_create_catalog(self):
        if self.is_admin or self.is_pro:
            return True
        return self.catalog_count < FREE_CATALOG_LIMIT

    def has_pending_payment(self):
        return any(p.status == 'pending' for p in self.payments)


class Catalog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(255), default='My Catalog')
    page_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class PaymentRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    amount = db.Column(db.Float, default=20.0)
    payment_method = db.Column(db.String(100))
    reference = db.Column(db.String(500))
    notes = db.Column(db.Text)
    status = db.Column(db.String(20), default='pending')
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)
    processed_at = db.Column(db.DateTime, nullable=True)
    months = db.Column(db.Integer, default=1)


# ── Helpers ─────────────────────────────────────────────────────────────────

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


# ── Auth Routes ──────────────────────────────────────────────────────────────

@app.route('/register', methods=['GET', 'POST'])
def register():
    if 'user_id' in session:
        return redirect(url_for('index'))
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip().lower()
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
        user = User(
            name=name,
            email=email,
            password_hash=generate_password_hash(password),
            is_admin=is_first
        )
        db.session.add(user)
        db.session.commit()
        session['user_id'] = user.id
        if is_first:
            flash('Account created! You are the admin.', 'success')
        else:
            flash('Account created! You are on the Free plan.', 'success')
        return redirect(url_for('index'))
    return render_template('register.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if 'user_id' in session:
        return redirect(url_for('index'))
    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
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


# ── Dashboard ────────────────────────────────────────────────────────────────

@app.route('/dashboard')
@login_required
def dashboard():
    user = current_user()
    catalogs = Catalog.query.filter_by(user_id=user.id).order_by(Catalog.created_at.desc()).all()
    pending = PaymentRequest.query.filter_by(user_id=user.id, status='pending').first()
    return render_template('dashboard.html', user=user, catalogs=catalogs, pending=pending,
                           free_limit=FREE_CATALOG_LIMIT, pro_price=PRO_PRICE_PGK)


# ── Upgrade / Payment ────────────────────────────────────────────────────────

@app.route('/upgrade')
@login_required
def upgrade():
    user = current_user()
    if user.is_pro:
        flash('You are already on the Pro plan!', 'success')
        return redirect(url_for('dashboard'))
    pending = PaymentRequest.query.filter_by(user_id=user.id, status='pending').first()
    return render_template('upgrade.html', user=user, payment_info=PAYMENT_INFO,
                           pro_price=PRO_PRICE_PGK, pending=pending)


@app.route('/upgrade/submit', methods=['POST'])
@login_required
def submit_payment():
    user = current_user()
    if user.is_pro:
        return jsonify({'error': 'Already pro'}), 400
    if user.has_pending_payment():
        flash('You already have a payment pending approval. Please wait.', 'error')
        return redirect(url_for('upgrade'))
    method = request.form.get('method', '').strip()
    reference = request.form.get('reference', '').strip()
    notes = request.form.get('notes', '').strip()
    months = int(request.form.get('months', 1))
    if not method or not reference:
        flash('Payment method and reference are required.', 'error')
        return redirect(url_for('upgrade'))
    pr = PaymentRequest(
        user_id=user.id,
        amount=PRO_PRICE_PGK * months,
        payment_method=method,
        reference=reference,
        notes=notes,
        months=months
    )
    db.session.add(pr)
    db.session.commit()
    flash('Payment submitted! We will review and activate your Pro plan shortly.', 'success')
    return redirect(url_for('dashboard'))


# ── Admin ────────────────────────────────────────────────────────────────────

@app.route('/admin')
@admin_required
def admin():
    pending = PaymentRequest.query.filter_by(status='pending').order_by(PaymentRequest.submitted_at).all()
    all_users = User.query.order_by(User.created_at.desc()).all()
    recent = PaymentRequest.query.filter(PaymentRequest.status != 'pending').order_by(
        PaymentRequest.processed_at.desc()).limit(20).all()
    return render_template('admin.html', pending=pending, all_users=all_users,
                           recent=recent, pro_price=PRO_PRICE_PGK)


@app.route('/admin/payment/<int:payment_id>/approve', methods=['POST'])
@admin_required
def approve_payment(payment_id):
    pr = db.session.get(PaymentRequest, payment_id)
    if not pr:
        flash('Payment not found.', 'error')
        return redirect(url_for('admin'))
    pr.status = 'approved'
    pr.processed_at = datetime.utcnow()
    user = pr.user
    months = pr.months or 1
    start = max(datetime.utcnow(), user.plan_expires or datetime.utcnow())
    user.plan = 'pro'
    user.plan_expires = start + timedelta(days=30 * months)
    db.session.commit()
    flash(f'Approved! {user.name} is now Pro until {user.plan_expires.strftime("%d %b %Y")}.', 'success')
    return redirect(url_for('admin'))


@app.route('/admin/payment/<int:payment_id>/reject', methods=['POST'])
@admin_required
def reject_payment(payment_id):
    pr = db.session.get(PaymentRequest, payment_id)
    if not pr:
        flash('Payment not found.', 'error')
        return redirect(url_for('admin'))
    pr.status = 'rejected'
    pr.processed_at = datetime.utcnow()
    db.session.commit()
    flash('Payment rejected.', 'success')
    return redirect(url_for('admin'))


@app.route('/admin/user/<int:user_id>/revoke', methods=['POST'])
@admin_required
def revoke_pro(user_id):
    user = db.session.get(User, user_id)
    if user:
        user.plan = 'free'
        user.plan_expires = None
        db.session.commit()
        flash(f'{user.name} reverted to Free plan.', 'success')
    return redirect(url_for('admin'))


@app.route('/admin/user/<int:user_id>/grant', methods=['POST'])
@admin_required
def grant_pro(user_id):
    user = db.session.get(User, user_id)
    months = int(request.form.get('months', 1))
    if user:
        start = max(datetime.utcnow(), user.plan_expires or datetime.utcnow())
        user.plan = 'pro'
        user.plan_expires = start + timedelta(days=30 * months)
        db.session.commit()
        flash(f'{user.name} granted Pro for {months} month(s).', 'success')
    return redirect(url_for('admin'))


# ── Core App Routes ──────────────────────────────────────────────────────────

@app.route('/')
@login_required
def index():
    user = current_user()
    return render_template('index.html', user=user,
                           can_create=user.can_create_catalog,
                           free_limit=FREE_CATALOG_LIMIT)


@app.route('/upload', methods=['POST'])
@login_required
def upload():
    user = current_user()
    files = request.files.getlist('images')
    uploaded = []
    upload_dir = user_upload_dir(user.id)
    for f in files:
        if f and f.filename and allowed_file(f.filename):
            ext = os.path.splitext(f.filename)[1].lower()
            filename = f'{uuid.uuid4().hex}{ext}'
            f.save(os.path.join(upload_dir, filename))
            uploaded.append(filename)
    return jsonify({'files': uploaded})


@app.route('/process', methods=['POST'])
@login_required
def process():
    user = current_user()
    if not user.can_create_catalog:
        return jsonify({'error': 'upgrade_required',
                        'message': 'Free plan allows 1 catalog. Upgrade to Pro for unlimited.'}), 403
    data = request.get_json()
    order = data.get('order', [])
    catalog_name = data.get('name', 'My Catalog')

    proc_dir = user_processed_dir(user.id)
    upload_dir = user_upload_dir(user.id)

    for old in os.listdir(proc_dir):
        os.remove(os.path.join(proc_dir, old))

    processed = []
    errors = []
    for i, filename in enumerate(order):
        src = os.path.join(upload_dir, filename)
        if not os.path.exists(src):
            errors.append(f'Missing: {filename}')
            continue
        try:
            img = Image.open(src).convert('RGB')
            img = smart_crop_resize(img, TARGET_WIDTH, TARGET_HEIGHT)
            out_name = f'page_{i + 1:03d}.jpg'
            out_path = os.path.join(proc_dir, out_name)
            img.save(out_path, 'JPEG', quality=72, optimize=True, progressive=True)
            processed.append(out_name)
        except Exception as e:
            errors.append(f'Error: {e}')

    catalog_file = user_catalog_file(user.id)
    with open(catalog_file, 'w') as f:
        json.dump(processed, f)

    catalog = Catalog(user_id=user.id, name=catalog_name, page_count=len(processed))
    db.session.add(catalog)
    db.session.commit()

    return jsonify({'processed': processed, 'count': len(processed), 'errors': errors})


@app.route('/catalog')
@login_required
def catalog():
    user = current_user()
    pages = load_catalog_pages(user.id)
    return render_template('catalog.html', user=user, pages=pages)


@app.route('/download-all')
@login_required
def download_all():
    user = current_user()
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
    user = current_user()
    upload_dir = user_upload_dir(user.id)
    proc_dir = user_processed_dir(user.id)
    for folder in [upload_dir, proc_dir]:
        for f in os.listdir(folder):
            os.remove(os.path.join(folder, f))
    fname = user_catalog_file(user.id)
    if os.path.exists(fname):
        os.remove(fname)
    return jsonify({'ok': True})


# ── Static file paths ────────────────────────────────────────────────────────

@app.context_processor
def inject_globals():
    return dict(current_user=current_user())


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=False)
