FROM python:3.12-slim

ARG HTTP_PROXY
ARG HTTPS_PROXY
ARG NO_PROXY
ENV HTTP_PROXY=${HTTP_PROXY}
ENV HTTPS_PROXY=${HTTPS_PROXY}
ENV NO_PROXY=${NO_PROXY}

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
RUN pip install --upgrade pip wheel setuptools==70.0.0
RUN pip install -r requirements.txt

# copy project
COPY . /app

# make entrypoint executable if possible
RUN chmod +x /app/entrypoint.sh || true

# Add a small wrapper that normalizes CRLF line endings on the entrypoint
# and then delegates to the real script. This helps machines that checked out
# the repository with CRLF line endings before `.gitattributes` was added.
RUN cat > /usr/local/bin/normalize-entrypoint.sh <<'SH'
#!/bin/sh
if [ -f /app/docker-entrypoint.sh ]; then
    # remove possible CRLF characters from the entrypoint
    sed -i 's/\r$//' /app/docker-entrypoint.sh || true
    chmod +x /app/docker-entrypoint.sh || true
fi
exec sh /app/docker-entrypoint.sh "$@"
SH
RUN chmod +x /usr/local/bin/normalize-entrypoint.sh || true

EXPOSE 8000

ENTRYPOINT ["sh", "/usr/local/bin/normalize-entrypoint.sh"]
CMD ["gunicorn", "crafty_backend.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]
