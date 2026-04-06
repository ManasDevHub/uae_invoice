# --- Stage 1: Build the React Frontend ---
FROM node:20-slim AS frontend-builder
WORKDIR /build
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# --- Stage 2: Final Python/FastAPI Image ---
FROM python:3.11-slim
WORKDIR /code

# Install system dependencies (for building some Python libs if needed)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY app/ ./app
COPY rules/ ./rules
COPY data/ ./data
# Copy the built frontend stage into 'static' for FastAPI to serve
COPY --from=frontend-builder /static ./static

# Permissions for Hugging Face (non-root user is best, but let's ensure it's writable)
RUN chmod -R 777 /code

# Environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=7860

# Command to start FastAPI on Hugging Face's preferred port
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
