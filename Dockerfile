# ── Stage 1: Build React frontend ─────────────────────
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./

# Point API calls to relative paths (nginx handles routing)
ENV VITE_API_BASE=""
RUN npm run build

# ── Stage 2: Python backend + nginx ───────────────────
FROM python:3.13-slim

# Install nginx, supervisor, and gettext-base (for envsubst)
RUN apt-get update && apt-get install -y nginx supervisor gettext-base && \
    mkdir -p /var/log/supervisor /var/run/supervisor /var/cache/nginx /var/run/nginx && \
    chmod -R 777 /var/log/supervisor /var/run/supervisor /var/cache/nginx /var/run/nginx /etc/nginx/sites-available /etc/nginx/sites-enabled && \
    rm -rf /var/lib/apt/lists/*

# Backend
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app/ ./app/

# Copy built frontend into nginx html folder
COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html

# Copy nginx template (will be substituted at runtime)
COPY nginx/nginx.conf.template /etc/nginx/sites-available/default.template

# Supervisor config to run both nginx and uvicorn
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copy startup script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Dynamic port handled by Railway
EXPOSE 80

CMD ["/bin/bash", "/app/start.sh"]
