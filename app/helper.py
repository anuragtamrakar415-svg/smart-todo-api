import bcrypt
import jwt
from app.config.app_config import getappconfig
from datetime import datetime, timedelta, timezone
from typing import Optional


def hash_password(password: str) -> str:
    # bcrypt has a hard 72-byte limit on the input; encode and truncate defensively.
    pwd_bytes = password.encode("utf-8")[:72]
    return bcrypt.hashpw(pwd_bytes, bcrypt.gensalt()).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    pwd_bytes = plain_password.encode("utf-8")[:72]
    return bcrypt.checkpw(pwd_bytes, hashed_password.encode("utf-8"))


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    config = getappconfig()
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=config.ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, config.SECRET_KEY, algorithm=config.ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> dict:
    """
    Raises jwt.exceptions.InvalidTokenError (or a subclass, e.g.
    ExpiredSignatureError) on any problem with the token. Callers should
    catch jwt.exceptions.InvalidTokenError.
    """
    config = getappconfig()
    payload = jwt.decode(token, config.SECRET_KEY, algorithms=[config.ALGORITHM])
    return payload
