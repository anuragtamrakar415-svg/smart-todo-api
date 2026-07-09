from pydantic import BaseModel, Field, EmailStr, field_validator, ValidationInfo


class Login(BaseModel):
    email: EmailStr = Field(..., description="User's email address")
    password: str = Field(..., min_length=8, description="User's password")


class Register(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, description="User's username")
    email: EmailStr = Field(..., description="User's email address")
    password: str = Field(..., min_length=8, description="User's password")
    confirm_password: str = Field(..., min_length=8, description="Confirmation of user's password")

    # ✅ This was previously written OUTSIDE the class body, so it was
    # never actually attached as a validator — passwords could mismatch
    # silently. Moved inside the class, and it now returns `v` (it was
    # returning None, which would have wiped out confirm_password).
    @field_validator("confirm_password")
    @classmethod
    def passwords_match(cls, v: str, info: ValidationInfo) -> str:
        if v != info.data.get("password"):
            raise ValueError("Passwords do not match")
        return v
