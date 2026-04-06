# ── Stage 1: Build React frontend ─────────────────────
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# ── Stage 2: Python backend ──────────────────────────
FROM python:3.13-slim

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY app/ ./app/
COPY rules/ ./rules/
COPY data/ ./data/
# Copy the built frontend into the expected directory
COPY --from=frontend-build /app/frontend/dist /app/frontend/dist

# Ensure the database file is writable (if it exists)
RUN touch invoices.db && chmod 666 invoices.db

# Simple, single-process uvicorn
# Railway provides the $PORT variable
EXPOSE 8000

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
