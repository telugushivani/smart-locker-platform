
import os

from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from pwdlib import PasswordHash

from app.database.dependencies import get_db
from app.models.admin import Admin
from app.schemas.admin import AdminRegister, AdminLogin, AdminResponse
from app.core.security import create_access_token, get_current_admin


router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)

password_hash = PasswordHash.recommended()


@router.post("/register", response_model=AdminResponse)
def register_admin(
    admin_data: AdminRegister,
    registration_key: str = Header(...),
    db: Session = Depends(get_db)
):
    expected_key = os.getenv("ADMIN_REGISTRATION_KEY")

    if not expected_key or registration_key != expected_key:
        raise HTTPException(
            status_code=403,
            detail="Invalid registration key"
        )

    existing_admin = db.query(Admin).filter(
        (Admin.username == admin_data.username) |
        (Admin.email == admin_data.email)
    ).first()

    if existing_admin:
        raise HTTPException(
            status_code=409,
            detail="Username or email already exists"
        )

    hashed_password = password_hash.hash(admin_data.password)

    new_admin = Admin(
        username=admin_data.username,
        email=admin_data.email,
        password_hash=hashed_password
    )

    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)

    return new_admin


@router.post("/login")
def login_admin(
    login_data: AdminLogin,
    db: Session = Depends(get_db)
):
    admin = db.query(Admin).filter(
        Admin.email == login_data.email
    ).first()

    if not admin:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not password_hash.verify(
        login_data.password,
        admin.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = create_access_token(
        {"sub": str(admin.admin_id)}
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "message": "Login successful"
    }


@router.get("/me", response_model=AdminResponse)
def get_admin_profile(
    current_admin: Admin = Depends(get_current_admin)
):
    return current_admin
