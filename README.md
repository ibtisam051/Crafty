# Crafty

Crafty is a full-stack e-commerce application built with Django, Django REST Framework, Redis, and React.

## Overview

- Backend: Django
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

3. Build and run the complete stack:

```bash
docker compose up --build
```

4. If you prefer separate build and run steps:

```bash
docker compose build

docker compose up -d
```

5. To stop the stack:

```bash
docker compose down
```

## Service URLs

When Docker Compose is running, the app is available at:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`

If you want to access the Django admin, use:

- Admin: `http://localhost:8000/admin/`

## Environment variables

The app expects the following values in `.env`:

- `REDIS_URL` — Redis connection URL (example: `redis://redis:6379/0`)
- `DJANGO_SECRET_KEY` — Django secret key
- `DEBUG` — `True` or `False`
- `ALLOWED_HOSTS` — comma-separated hostnames (default: `localhost,127.0.0.1`)
- `CORS_ALLOW_ALL_ORIGINS` — `True` or `False`

## Docker notes

- `docker compose up --build` rebuilds both frontend and backend images before starting the containers.
- `frontend` is built from `Dockerfile.frontend` and served by Nginx on port `3000`.
- `web` is built from `backend/Dockerfile` and served by Gunicorn on port `8000`.
- The backend container depends on Redis, so Redis must be available for the stack to start successfully.
- The Docker build supports `HTTP_PROXY`, `HTTPS_PROXY`, and `NO_PROXY` build args if you need proxy configuration.

### Windows line endings (CRLF) and `entrypoint.sh` failures

On Windows, Git may convert line endings to CRLF which can break shell scripts inside Linux containers and produce errors like:

```
/app/entrypoint.sh: 2: set: Illegal option -
```

To avoid this:


```powershell
git rm --cached -r .
git reset --hard
```

Or convert the script manually and recommit (example using `dos2unix` on WSL or Linux):

```bash
dos2unix backend/entrypoint.sh
git add backend/entrypoint.sh
git commit -m "Normalize entrypoint line endings"
```

Runtime fallback in the Docker image

The backend image includes a small startup wrapper that strips CRLF from
`/app/entrypoint.sh` automatically. This allows containers to start even if a
developer accidentally checked out the repo with CRLF before `.gitattributes`
was added. However it's still best to re-normalize your working copy (see
above) so future commits don't reintroduce CRLF.


```bash
docker compose ps
docker compose logs web --tail=200
docker inspect --format='{{.State.ExitCode}}' $(docker compose ps -q web)
```

To enter a failed container for debugging (if it's still present):

```bash
docker compose run --rm web sh -c 'cat -v /app/entrypoint.sh'
```

This will show `^M` characters if CRLF line endings are present.

## Static files and media

- Static files are collected into `backend/staticfiles/` via Django `collectstatic`.
- Uploaded media files are stored under `backend/media/` during development.
- `backend/staticfiles/` is generated output and should not be committed to Git.

## Linting

### Frontend
Run JavaScript linting and formatting from the project root:

```bash
npm run lint
npm run lint:fix
npm run format
```

### Backend
Install dev tools in the backend environment and run:

```bash
cd backend
python -m pip install -r requirements-dev.txt
python -m ruff check .
python -m black .
python -m isort .
```

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
