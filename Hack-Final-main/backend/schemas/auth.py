"""Auth & token schemas."""
from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, model_validator


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    token: Optional[str] = None

    @model_validator(mode="after")
    def populate_token_alias(self) -> "TokenResponse":
        if not self.token and self.access_token:
            self.token = self.access_token
        return self


class RefreshRequest(BaseModel):
    refresh_token: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)


class RegisterRequest(BaseModel):
    email: EmailStr
    username: Optional[str] = None
    name: Optional[str] = None
    password: str = Field(..., min_length=6)
    full_name: Optional[str] = None
    organization_name: Optional[str] = None

    @model_validator(mode="after")
    def populate_username(self) -> "RegisterRequest":
        if not self.username:
            self.username = self.name or self.full_name or self.email.split("@")[0]
        if not self.full_name and self.name:
            self.full_name = self.name
        return self


class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)
