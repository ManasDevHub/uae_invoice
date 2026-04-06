#!/bin/bash
set -e

echo "=== Building React frontend ==="
cd frontend
npm install
npm run build
cd ..

echo "=== Frontend built into /static ==="
ls -la static/

echo "=== Starting FastAPI ==="
uvicorn app.main:app --host 0.0.0.0 --port $PORT
