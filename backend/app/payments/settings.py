from pydantic import BaseSettings, Field


class PaymentsSettings(BaseSettings):
    # M-Pesa / Daraja
    MPESA_CONSUMER_KEY: str = Field(...)
    MPESA_CONSUMER_SECRET: str = Field(...)
    MPESA_PASSKEY: str = Field(...)
    MPESA_SHORTCODE: str = Field(...)
    MPESA_CALLBACK_URL: str = Field(...)
    MPESA_BASE_URL: str = Field("https://sandbox.safaricom.co.ke")

    # Bank / manual
    DEFAULT_CURRENCY: str = Field("KES")

    class Config:
        env_file = ".env"


def get_settings() -> PaymentsSettings:
    return PaymentsSettings()
