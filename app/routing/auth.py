from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.database.schema.user_schema import UserSchema
from app.models.auth import Login, Register
from app.helper import create_access_token, hash_password, verify_password

router = APIRouter(prefix="/api/auth")


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(data: Register, db: Annotated[Session, Depends(get_db)]):
    existing_user = db.query(UserSchema).filter(
        (UserSchema.username == data.username) |
        (UserSchema.email == data.email)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already exists"
        )

    new_user = UserSchema(
        username=data.username,
        email=data.email,
        password=hash_password(data.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "Registration successful", "user_id": new_user.id}


@router.post("/login")
async def login(data: Login, db: Annotated[Session, Depends(get_db)]):
    user = db.query(UserSchema).filter(UserSchema.email == data.email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not verify_password(data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # ✅ Only put the email in the token now — never the password/hash.
    token = create_access_token({"email": user.email})

    return {
        "message": "Login successful",
        "data": {
            "user_id": user.id,
            "username": user.username,
            "email": user.email,
            "access_token": token,
            "token_type": "bearer"
        }
    }
