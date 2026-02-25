#!/usr/bin/env bash
python auto_setup.py
gunicorn config.wsgi:application
