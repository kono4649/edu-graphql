from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt

from config import settings

_SUBJECT_KEY = "sub"


def encode_token(user_id: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(hours=settings.jwt_expire_hours)
    payload = {_SUBJECT_KEY: str(user_id), "exp": expire}
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def decode_token(token: str) -> int:
    """Decode JWT and return user_id. Raises ValueError on invalid token."""
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
        user_id_str: str = payload.get(_SUBJECT_KEY)
        if user_id_str is None:
            raise ValueError("Token missing subject")
        return int(user_id_str)
    except JWTError as e:
        raise ValueError(f"Invalid token: {e}") from e
