#!/bin/bash
set -e

# Install Python dependencies
pip install -r flask-app/requirements.txt -q

# Start Flask via Gunicorn on port 8000 (background)
cd flask-app
gunicorn -w 2 -b 0.0.0.0:8000 main:app &
GUNICORN_PID=$!
cd ..

echo "Gunicorn started (PID $GUNICORN_PID) on port 8000"

# Start Node.js API server on port 8080 (foreground — keeps container alive)
node --enable-source-maps artifacts/api-server/dist/index.mjs

# If Node exits, shut down gunicorn too
kill $GUNICORN_PID 2>/dev/null || true
