#!/usr/bin/env bash
python auto_setup.py
gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8000}
