from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Any
from datetime import datetime

from . import schemas, mpesa, bank, service, models, settings as payments_settings
from ..dependencies import get_db, get_current_user, require_admin
from sqlalchemy import select

router = APIRouter(prefix="/api/payments", tags=["payments"])


@router.post("/mpesa/initiate", response_model=schemas.PaymentInitiateResponse)
async def mpesa_initiate(payload: schemas.PaymentCreateMpesa, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    # create payment record
    async with db.begin():
        payment = models.Payment(
            user_id=user.id,
            amount=payload.amount,
            currency=payments_settings.get_settings().DEFAULT_CURRENCY,
            method=models.PaymentMethod.mpesa.value,
            status=models.PaymentStatus.pending.value,
            purpose=payload.purpose,
            phone=payload.phone,
        )
        db.add(payment)
        await db.flush()

    # initiate STK (external network call outside DB transaction)
    mpesa_cfg = mpesa.MpesaSettings(
        consumer_key=payments_settings.get_settings().MPESA_CONSUMER_KEY,
        consumer_secret=payments_settings.get_settings().MPESA_CONSUMER_SECRET,
        passkey=payments_settings.get_settings().MPESA_PASSKEY,
        shortcode=payments_settings.get_settings().MPESA_SHORTCODE,
        callback_url=payments_settings.get_settings().MPESA_CALLBACK_URL,
        base_url=payments_settings.get_settings().MPESA_BASE_URL,
    )

    resp = await mpesa.initiate_stk_push(mpesa_cfg, payload.amount, payload.phone, f"{payload.purpose}:{payment.id}", "DeenFlow payment")

    # store raw payload for audit and return ids
    async with db.begin():
        payment.raw_payload = str(resp)
        await db.flush()

    checkout_request_id = resp.get("CheckoutRequestID")
    return {"payment_id": payment.id, "checkout_request_id": checkout_request_id}


@router.post("/mpesa/callback")
async def mpesa_callback(request: Request, db: AsyncSession = Depends(get_db)):
    payload = await request.json()
    # Store raw payload for audit
    # validate
    if not mpesa.validate_callback(payload, payments_settings.get_settings().MPESA_SHORTCODE):
        raise HTTPException(status_code=400, detail="Invalid callback payload")

    body = payload.get("Body", {})
    stk = body.get("stkCallback", {})
    result = stk.get("ResultCode")
    metadata = stk.get("CallbackMetadata", {}).get("Item", [])
    meta = {m.get("Name"): m.get("Value") for m in metadata if m.get("Name")}
    receipt = meta.get("MpesaReceiptNumber") or meta.get("ReceiptNumber")
    amount = meta.get("Amount")
    phone = meta.get("PhoneNumber") or meta.get("Phone")

    # Idempotency: try to locate by CheckoutRequestID saved in raw_payload or match pending by amount+phone
    chk_id = None
    try:
        chk_id = stk.get("CheckoutRequestID")
    except Exception:
        chk_id = None

    matched = None
    if chk_id:
        stmt = select(models.Payment).where(models.Payment.raw_payload.ilike(f"%{chk_id}%"))
        res = await db.execute(stmt)
        matched = res.scalars().first()

    if not matched:
        # fallback by phone+amount
        stmt = select(models.Payment).where(models.Payment.status == models.PaymentStatus.pending.value)
        res = await db.execute(stmt)
        candidates = res.scalars().all()
        for p in candidates:
            if p.phone and phone and p.phone.endswith(str(phone)[-9:]) and float(p.amount) == float(amount):
                matched = p
                break

    if not matched:
        # log and return 200 to M-Pesa to avoid retries
        return {"ResultCode": 0, "ResultDesc": "No matching payment found"}

    # idempotent processing
    # idempotent processing
    if matched.status == models.PaymentStatus.paid.value:
        return {"ResultCode": 0, "ResultDesc": "Already processed"}

    async with db.begin():
        if int(result) == 0:
            matched.status = models.PaymentStatus.paid.value
            matched.provider_ref = receipt
            matched.confirmed_at = datetime.utcnow()
            matched.raw_payload = str(payload)
        else:
            matched.status = models.PaymentStatus.failed.value
            matched.raw_payload = str(payload)

    if matched.status == models.PaymentStatus.paid.value:
        # call business logic outside DB transaction to avoid long locks
        await service.process_successful_payment(db, matched)

    return {"ResultCode": 0, "ResultDesc": "Accepted"}


@router.post("/bank/submit", response_model=schemas.PaymentOut)
async def bank_submit(payload: schemas.BankSubmitRequest, db: AsyncSession = Depends(get_db), user=Depends(get_current_user)):
    async with db.begin():
        payment = models.Payment(
            user_id=user.id,
            amount=payload.amount,
            currency=payments_settings.get_settings().DEFAULT_CURRENCY,
            method=models.PaymentMethod.bank.value,
            status=models.PaymentStatus.pending.value,
            provider_ref=payload.reference_number,
            purpose=f"deposit:{payload.reference_number}",
        )
        payment.raw_payload = str(bank.create_bank_payment_payload(user.id, payload.amount, payload.bank_name, payload.reference_number, payload.deposit_date, payload.proof_image_url))
        db.add(payment)
        await db.flush()
        await db.refresh(payment)
        return payment


# Admin endpoints
admin_router = APIRouter(prefix="/api/admin/payments", tags=["admin_payments"])


@admin_router.get("/bank/pending")
async def list_pending_bank_payments(db: AsyncSession = Depends(get_db), admin=Depends(require_admin)):
    stmt = select(models.Payment).where(models.Payment.method == models.PaymentMethod.bank.value, models.Payment.status == models.PaymentStatus.pending.value)
    res = await db.execute(stmt)
    return res.scalars().all()


@admin_router.patch("/{payment_id}/approve")
async def approve_payment(payment_id: int, db: AsyncSession = Depends(get_db), admin=Depends(require_admin)):
    stmt = select(models.Payment).where(models.Payment.id == payment_id)
    res = await db.execute(stmt)
    payment = res.scalar_one_or_none()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    async with db.begin():
        payment.status = models.PaymentStatus.paid.value
        payment.confirmed_at = datetime.utcnow()
    await service.process_successful_payment(db, payment)
    return {"status": "approved"}


@admin_router.patch("/{payment_id}/reject")
async def reject_payment(payment_id: int, db: AsyncSession = Depends(get_db), admin=Depends(require_admin)):
    stmt = select(models.Payment).where(models.Payment.id == payment_id)
    res = await db.execute(stmt)
    payment = res.scalar_one_or_none()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    async with db.begin():
        payment.status = models.PaymentStatus.failed.value
        
    return {"status": "rejected"}
