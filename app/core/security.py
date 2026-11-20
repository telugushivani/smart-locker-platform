
from datetime import datetime, timedelta, timezone
from jose import jwt
from jose.exceptions import JWTError
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.models.admin import Admin

SECRET_KEY = "change-this-to-a-long-random-secret-before-deployment"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

bearer_scheme = HTTPBearer()


def create_access_token(data: dict):
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt


def verify_access_token(token: str):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        return payload

    except JWTError:
        return None


def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db)
):
    token = credentials.credentials

    payload = verify_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    admin_id = payload.get("sub")

    if admin_id is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    admin = db.query(Admin).filter(
        Admin.admin_id == int(admin_id)
    ).first()

    if admin is None:
        raise HTTPException(
            status_code=401,
            detail="Admin not found"
        )

    return admin
