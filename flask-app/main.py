import os
import uuid
import json
import shutil
from flask import Flask, render_template, request, jsonify, send_from_directory
from PIL import Image

app = Flask(__name__)

UPLOAD_FOLDER = os.path.join('static', 'uploads')
PROCESSED_FOLDER = os.path.join('static', 'processed')
CATALOG_FILE = 'catalog_order.json'
TARGET_WIDTH = 800
TARGET_HEIGHT = 1000
ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', '.gif'}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)


def allowed_file(filename):
    return os.path.splitext(filename)[1].lower() in ALLOWED_EXTENSIONS


def smart_crop_resize(img, target_w, target_h):
    img_ratio = img.width / img.height
    target_ratio = target_w / target_h
    if img_ratio > target_ratio:
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


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/upload', methods=['POST'])
def upload():
    files = request.files.getlist('images')
    uploaded = []
    for f in files:
        if f and f.filename and allowed_file(f.filename):
            ext = os.path.splitext(f.filename)[1].lower()
            filename = f'{uuid.uuid4().hex}{ext}'
            f.save(os.path.join(UPLOAD_FOLDER, filename))
            uploaded.append(filename)
    return jsonify({'files': uploaded})


@app.route('/process', methods=['POST'])
def process():
    data = request.get_json()
    order = data.get('order', [])

    for old in os.listdir(PROCESSED_FOLDER):
        os.remove(os.path.join(PROCESSED_FOLDER, old))

    processed = []
    errors = []
    for i, filename in enumerate(order):
        src = os.path.join(UPLOAD_FOLDER, filename)
        if not os.path.exists(src):
            errors.append(f'Missing: {filename}')
            continue
        try:
            img = Image.open(src).convert('RGB')
            img = smart_crop_resize(img, TARGET_WIDTH, TARGET_HEIGHT)
            out_name = f'page_{i + 1:03d}.jpg'
            out_path = os.path.join(PROCESSED_FOLDER, out_name)
            img.save(out_path, 'JPEG', quality=72, optimize=True, progressive=True)
            processed.append(out_name)
        except Exception as e:
            errors.append(f'Error processing {filename}: {e}')

    with open(CATALOG_FILE, 'w') as f:
        json.dump(processed, f)

    return jsonify({'processed': processed, 'count': len(processed), 'errors': errors})


@app.route('/catalog')
def catalog():
    pages = []
    if os.path.exists(CATALOG_FILE):
        with open(CATALOG_FILE) as f:
            pages = json.load(f)
    return render_template('catalog.html', pages=pages)


@app.route('/clear', methods=['POST'])
def clear():
    for folder in [UPLOAD_FOLDER, PROCESSED_FOLDER]:
        for f in os.listdir(folder):
            os.remove(os.path.join(folder, f))
    if os.path.exists(CATALOG_FILE):
        os.remove(CATALOG_FILE)
    return jsonify({'ok': True})


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=False)
