#!/bin/bash

# Default to 80 if PORT is not set
export PORT=${PORT:-80}
echo "Starting application on PORT: $PORT"

# Ensure nginx directories exist and are writable
mkdir -p /var/run/nginx /var/log/nginx /var/cache/nginx
chmod -R 777 /var/run/nginx /var/log/nginx /var/cache/nginx

# Debug: check if template exists
if [ ! -f /etc/nginx/sites-available/default.template ]; then
    echo "ERROR: nginx template not found at /etc/nginx/sites-available/default.template"
    exit 1
fi

# Replace ${PORT} placeholder in nginx config template
echo "Generating Nginx configuration..."
envsubst '${PORT}' < /etc/nginx/sites-available/default.template > /etc/nginx/sites-enabled/default

echo "Starting Supervisor..."
exec /usr/bin/supervisord -n -c /etc/supervisor/conf.d/supervisord.conf
