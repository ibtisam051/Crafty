#!/bin/sh
set -e

# Apply database migrations
python manage.py migrate --noinput

# Collect static files (if configured)
python manage.py collectstatic --noinput || true

# Start server (CMD will run gunicorn by default)
exec "$@"
