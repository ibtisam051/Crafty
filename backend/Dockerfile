FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# system deps
RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential gcc libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# install pip requirements
COPY requirements.txt ./
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# copy project
COPY . /app

# make entrypoint executable if possible
RUN chmod +x /app/entrypoint.sh || true

EXPOSE 8000

ENTRYPOINT ["sh", "/app/entrypoint.sh"]
CMD ["gunicorn", "crafty_backend.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]
