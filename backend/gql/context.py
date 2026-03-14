from typing import Any, Optional

from fastapi import Request, WebSocket
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from auth.jwt import decode_token
from database import AsyncSessionLocal
from models.user import User


async def _get_user_from_token(token: str, db: AsyncSession) -> Optional[User]:
    """Decode JWT and fetch user. Returns None if token is invalid."""
    try:
        user_id = decode_token(token)
    except ValueError:
        return None
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()


def _extract_token(authorization: str) -> Optional[str]:
    """Extract bearer token from Authorization header. Returns None for malformed headers."""
    if not authorization.startswith("Bearer "):
        return None
    return authorization[len("Bearer "):]


async def get_context(request: Request = None, websocket: WebSocket = None) -> dict[str, Any]:
    """Strawberry context getter. Supports both HTTP and WebSocket."""
    if request is not None:
        headers = request.headers
    else:
        headers = websocket.headers

    authorization = headers.get("authorization", "")

    async with AsyncSessionLocal() as db:
        user: Optional[User] = None
        if authorization:
            token = _extract_token(authorization)
            if token is not None:
                user = await _get_user_from_token(token, db)

        yield {"user": user, "db": db, "request": request}
