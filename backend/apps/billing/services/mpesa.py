"""
M-Pesa (Daraja) STK Push service for Django.
Synchronous implementation using `requests` to match Django's sync request cycle.
"""
import base64
import os
from datetime import datetime, timedelta

import requests

from django.conf import settings


def _settings():
    """Read M-Pesa credentials from Django settings/environment."""
    return {
        'consumer_key': os.environ.get('MPESA_CONSUMER_KEY', ''),
        'consumer_secret': os.environ.get('MPESA_CONSUMER_SECRET', ''),
        'passkey': os.environ.get('MPESA_PASSKEY', ''),
        'shortcode': os.environ.get('MPESA_SHORTCODE', ''),
        'callback_url': os.environ.get('MPESA_CALLBACK_URL', ''),
        'base_url': os.environ.get('MPESA_BASE_URL', 'https://sandbox.safaricom.co.ke'),
    }


def is_configured():
    """Return True if M-Pesa credentials are present in the environment."""
    cfg = _settings()
    return bool(cfg['consumer_key'] and cfg['consumer_secret'] and cfg['passkey'] and cfg['shortcode'])


def _get_access_token(cfg):
    """Obtain an OAuth access token from Daraja."""
    url = f"{cfg['base_url'].rstrip('/')}/oauth/v1/generate?grant_type=client_credentials"
    resp = requests.get(url, auth=(cfg['consumer_key'], cfg['consumer_secret']), timeout=15)
    resp.raise_for_status()
    data = resp.json()
    token = data.get('access_token')
    if not token:
        raise RuntimeError(f"Failed to obtain M-Pesa access token: {data}")
    return token


def _timestamp() -> str:
    return datetime.utcnow().strftime('%Y%m%d%H%M%S')


def _password(shortcode: str, passkey: str, timestamp: str) -> str:
    data = f"{shortcode}{passkey}{timestamp}"
    return base64.b64encode(data.encode()).decode()


def _normalize_phone(phone: str) -> str:
    """Normalize a Kenyan phone number to the 254XXXXXXXXX format Daraja expects."""
    phone = phone.strip().replace(' ', '').replace('-', '')
    if phone.startswith('+'):
        phone = phone[1:]
    if phone.startswith('0'):
        phone = '254' + phone[1:]
    elif phone.startswith('254') and len(phone) == 12:
        pass
    else:
        # Assume it's a 9-digit safaricom number with country omitted
        if len(phone) == 9:
            phone = '254' + phone
    return phone


def initiate_stk_push(amount, phone, account_reference, description):
    """
    Initiate an M-Pesa STK Push transaction.

    Returns:
        dict with checkout_request_id, merchant_request_id, response_code, response_description
    """
    if not is_configured():
        raise RuntimeError('M-Pesa is not configured. Set MPESA_* environment variables.')

    cfg = _settings()
    token = _get_access_token(cfg)
    ts = _timestamp()
    pwd = _password(cfg['shortcode'], cfg['passkey'], ts)

    url = f"{cfg['base_url'].rstrip('/')}/mpesa/stkpush/v1/processrequest"
    headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}

    payload = {
        'BusinessShortCode': cfg['shortcode'],
        'Password': pwd,
        'Timestamp': ts,
        'TransactionType': 'CustomerPayBillOnline',
        'Amount': int(amount),
        'PartyA': _normalize_phone(phone),
        'PartyB': cfg['shortcode'],
        'PhoneNumber': _normalize_phone(phone),
        'CallBackURL': cfg['callback_url'],
        'AccountReference': account_reference[:12],  # max 12 chars
        'TransactionDesc': description[:13],  # max 13 chars
    }

    resp = requests.post(url, json=payload, headers=headers, timeout=20)
    resp.raise_for_status()
    data = resp.json()

    return {
        'checkout_request_id': data.get('CheckoutRequestID'),
        'merchant_request_id': data.get('MerchantRequestID'),
        'response_code': data.get('ResponseCode'),
        'response_description': data.get('ResponseDescription'),
        'customer_message': data.get('CustomerMessage'),
        'raw': data,
    }
