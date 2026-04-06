#!/bin/bash

# Default to 80 if PORT is not set
export PORT=${PORT:-80}
echo "Starting application on PORT: $PORT"

# Replace ${PORT} placeholder in nginx config template
envsubst '${PORT}' < /etc/nginx/sites-available/default.template > /etc/nginx/sites-enabled/default

# Start supervisor
exec /usr/bin/supervisord -n -c /etc/supervisor/conf.d/supervisord.conf
