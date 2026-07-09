from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status
from typing import Annotated
from sqlalchemy.orm import Session
from .helper import decode_access_token
from .database.db import get_db
from .database.schema.user_schema import UserSchema
from jwt.exceptions import InvalidTokenError

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def authenticate_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Annotated[Session, Depends(get_db)],
) -> UserSchema:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = decode_access_token(token)
    except InvalidTokenError:
        raise credentials_exception

    email = payload.get("email")
    if email is None:
        raise credentials_exception

    user = db.query(UserSchema).filter(UserSchema.email == email).first()
    if user is None:
        raise credentials_exception

    return user
