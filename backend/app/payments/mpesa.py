import base64
import asyncio
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
from urllib.parse import urljoin

import httpx
from pydantic import BaseSettings


class MpesaSettings(BaseSettings):
    consumer_key: str
    consumer_secret: str
    passkey: str
    shortcode: str
    callback_url: str
    base_url: str = "https://sandbox.safaricom.co.ke"


# simple in-memory token cache (process-lifetime)
_token: Optional[str] = None
_token_expires_at: Optional[datetime] = None
_token_lock = asyncio.Lock()


async def _get_access_token(settings: MpesaSettings) -> str:
    global _token, _token_expires_at
    async with _token_lock:
        if _token and _token_expires_at and datetime.utcnow() < _token_expires_at:
            return _token
        url = urljoin(settings.base_url, "/oauth/v1/generate?grant_type=client_credentials")
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(url, auth=(settings.consumer_key, settings.consumer_secret))
            resp.raise_for_status()
            data = resp.json()
            _token = data.get("access_token")
            # token expiry - Daraja tokens typically valid 3600s
            _token_expires_at = datetime.utcnow() + timedelta(seconds=int(data.get("expires_in", 3600)))
            return _token


def _timestamp() -> str:
    return datetime.utcnow().strftime("%Y%m%d%H%M%S")


def _password(shortcode: str, passkey: str, timestamp: str) -> str:
    data = f"{shortcode}{passkey}{timestamp}"
    return base64.b64encode(data.encode()).decode()


async def initiate_stk_push(settings: MpesaSettings, amount: float, phone: str, account_reference: str, description: str) -> Dict[str, Any]:
    token = await _get_access_token(settings)
    ts = _timestamp()
    pwd = _password(settings.shortcode, settings.passkey, ts)
    url = urljoin(settings.base_url, "/mpesa/stkpush/v1/processrequest")
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    payload = {
        "BusinessShortCode": settings.shortcode,
        "Password": pwd,
        "Timestamp": ts,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": int(amount),
        "PartyA": phone,
        "PartyB": settings.shortcode,
        "PhoneNumber": phone,
        "CallBackURL": settings.callback_url,
        "AccountReference": account_reference,
        "TransactionDesc": description,
    }
    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.post(url, json=payload, headers=headers)
        resp.raise_for_status()
        return resp.json()


def validate_callback(payload: Dict[str, Any], expected_shortcode: str) -> bool:
    """Validate structure and basic integrity of Daraja callback.

    Note: Daraja does not provide a builtin HMAC signature header for callbacks
    in the basic flow. Best practice: verify callback contents against an
    earlier saved CheckoutRequestID / MerchantRequestID and confirm amount/phone.
    This function performs lightweight structural checks.
    """
    try:
        body = payload.get("Body", {})
        stk = body.get("stkCallback", {})
        # ensure minimal fields exist
        if not stk.get("MerchantRequestID") and not stk.get("CheckoutRequestID"):
            return False
        return True
    except Exception:
        return False
