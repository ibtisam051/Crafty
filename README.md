# Crafty

Crafty is a full-stack e-commerce application built with Django, Django REST Framework, Redis, and React.

## Overview

- Backend: Django + DRF
- Frontend: React app built with Create React App and served by Nginx
- Cache layer: Redis
- Backend image uses `python:3.12-slim`

## Prerequisites

- Docker
- Docker Compose

## Setup

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Update `.env` with your values.

3. Build and run the stack:

```bash
docker compose up --build
```

## Access

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`

## Environment variables

The app expects the following values in `.env`:

- `REDIS_URL` � Redis connection URL
- `DJANGO_SECRET_KEY` � Django secret key
- `DEBUG` � `True` or `False`
- `ALLOWED_HOSTS` � comma-separated hostnames
- `CORS_ALLOW_ALL_ORIGINS` � `True` or `False`

## Notes

- The backend uses `backend/entrypoint.sh` to run migrations and collect static files before starting Gunicorn.
- Django now defaults `ALLOWED_HOSTS` to `localhost,127.0.0.1` when the env value is blank.
- The frontend is built and served by Nginx from `Dockerfile.frontend`.

## Common commands

```bash
docker compose down
```

```bash
docker compose logs -f
```

```bash
docker compose exec web python manage.py createsuperuser
```

## Development notes

- If static assets are not served correctly, ensure `docker compose up --build` completes successfully and that the frontend build files are copied into Nginx.
- If Django raises `Invalid HTTP_HOST header`, verify `ALLOWED_HOSTS` includes `localhost`.
