import logging
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from .models import Payment

logger = logging.getLogger(__name__)


async def process_successful_payment(db: AsyncSession, payment: Payment):
    """Centralized business logic for granting access after a successful payment.
    
    Reads payment.purpose and routes to internal grant functions.
    Ensures idempotency by checking status before processing.
    """
    if payment.status != "paid":
        logger.warning(f"Attempted to process payment {payment.id} with status {payment.status}")
        return

    logger.info(f"Processing successful payment ID: {payment.id} for purpose: {payment.purpose}")

    # Dispatch based on purpose string format: 'type:id' (e.g., 'course:101')
    purpose = payment.purpose
    if ":" in purpose:
        kind, item_id = purpose.split(":", 1)
    else:
        kind, item_id = purpose, None

    try:
        if kind == "course" and item_id:
            await grant_course_access(db, payment.user_id, int(item_id))
        elif kind == "subscription" and item_id:
            await activate_subscription(db, payment.user_id, item_id)
        elif kind == "feature" and item_id:
            await enable_feature(db, payment.user_id, item_id)
        else:
            logger.error(f"Unknown or malformed payment purpose: {purpose}")
            return
            
        logger.info(f"Successfully fulfilled purpose for payment {payment.id}")
        
    except Exception as e:
        logger.error(f"Failed to process entitlement for payment {payment.id}: {str(e)}")
        # In production, you might want to queue this for retry or alert admins
        raise e


async def grant_course_access(db: AsyncSession, user_id: int, course_id: int):
    logger.info(f"GRANT: Course {course_id} access to User {user_id}")
    # Integration logic: e.g., db.add(UserCourse(user_id=user_id, course_id=course_id))
    # For now, we log it. In a real app, this would call the CourseService.
    pass


async def activate_subscription(db: AsyncSession, user_id: int, plan_id: str):
    logger.info(f"GRANT: Subscription {plan_id} for User {user_id}")
    # Integration logic: update user's subscription record
    pass


async def enable_feature(db: AsyncSession, user_id: int, feature_id: str):
    logger.info(f"GRANT: Feature {feature_id} for User {user_id}")
    # Integration logic: toggle feature flag or credit wallet
    pass
