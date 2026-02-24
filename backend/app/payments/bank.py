from typing import Dict, Any
from datetime import datetime


def create_bank_payment_payload(user_id: int, amount: float, bank_name: str, reference: str, deposit_date: datetime, proof_url: str = None) -> Dict[str, Any]:
    return {
        "user_id": user_id,
        "amount": amount,
        "bank_name": bank_name,
        "reference": reference,
        "deposit_date": deposit_date.isoformat(),
        "proof_url": proof_url,
    }
