from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class PaymentCreateMpesa(BaseModel):
    amount: float
    phone: str
    purpose: str


class PaymentInitiateResponse(BaseModel):
    payment_id: int
    checkout_request_id: Optional[str]


class MpesaCallbackPayload(BaseModel):
    Body: dict


class BankSubmitRequest(BaseModel):
    amount: float
    bank_name: str
    reference_number: str
    deposit_date: datetime
    proof_image_url: Optional[str] = None


class PaymentOut(BaseModel):
    id: int
    user_id: int
    amount: float
    currency: str
    method: str
    status: str
    provider_ref: Optional[str]
    purpose: str
    phone: Optional[str]
    created_at: datetime
    confirmed_at: Optional[datetime]

    class Config:
        orm_mode = True
