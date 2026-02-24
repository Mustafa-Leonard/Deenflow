from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, DateTime, Enum, Text
from sqlalchemy.sql import func
import enum
from ..database import Base


class PaymentStatus(str, enum.Enum):
    pending = "pending"
    paid = "paid"
    failed = "failed"


class PaymentMethod(str, enum.Enum):
    mpesa = "mpesa"
    bank = "bank"


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True) # Pointing to auth_user.id
    amount = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(10), default="KES", nullable=False)
    method = Column(String(20), nullable=False) # mpesa | bank
    status = Column(Enum(PaymentStatus), default=PaymentStatus.pending, nullable=False)
    provider_ref = Column(String(128), nullable=True, index=True) # mpesa receipt or bank ref
    purpose = Column(String(64), nullable=False) # e.g. "course:123"
    phone = Column(String(32), nullable=True)
    raw_payload = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    confirmed_at = Column(DateTime(timezone=True), nullable=True)
