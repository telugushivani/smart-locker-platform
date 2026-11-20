
from pydantic import BaseModel, EmailStr, Field


class AdminRegister(BaseModel):
    username: str = Field(min_length=3, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class AdminLogin(BaseModel):
    email: EmailStr
    password: str


class AdminResponse(BaseModel):
    admin_id: int
    username: str
    email: EmailStr
