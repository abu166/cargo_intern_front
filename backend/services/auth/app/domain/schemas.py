from datetime import datetime
from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserCreate(BaseModel):
    username: str
    password: str
    full_name: str | None = None
    roles: list[str] = []


class UserUpdate(BaseModel):
    full_name: str | None = None
    roles: list[str] | None = None
    is_active: bool | None = None


class UserOut(BaseModel):
    id: int
    username: str
    full_name: str | None
    roles: list[str]
    is_active: bool
    created_at: datetime


class LoginRequest(BaseModel):
    username: str
    password: str


class ClientCreate(BaseModel):
    full_name: str
    document_id: str
    phone: str | None = None


class ClientOut(BaseModel):
    id: int
    full_name: str
    document_id: str
    phone: str | None
    created_at: datetime


class AuditOut(BaseModel):
    id: int
    user_id: int | None
    action: str
    details: str | None
    created_at: datetime
