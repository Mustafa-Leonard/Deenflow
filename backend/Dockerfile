# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . /app/

# Collect static files (requires SECRET_KEY at build time — use a dummy)
RUN SECRET_KEY=dummy python manage.py collectstatic --noinput

# Expose port (Render overrides this with $PORT)
EXPOSE $PORT

# Run migrations then start gunicorn on Render's dynamic port
CMD python manage.py migrate --noinput && \
    gunicorn config.wsgi:application \
    --bind 0.0.0.0:${PORT:-8000} \
    --workers 2 \
    --timeout 120 \
    --log-file -
