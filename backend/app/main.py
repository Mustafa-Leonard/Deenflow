from fastapi import FastAPI
from .payments.router import router as payments_router, admin_router as payments_admin_router
from .database import engine, Base
import asyncio

app = FastAPI(title="DeenFlow API")

# Include routers
app.include_router(payments_router)
app.include_router(payments_admin_router)

@app.get("/")
async def root():
    return {"message": "DeenFlow API is running"}

@app.on_event("startup")
async def startup():
    # Create tables locally for development (use Alembic for production)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
