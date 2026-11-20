
from sqlalchemy import Column, Integer, String, DateTime, text
from app.database.connection import Base


class Admin(Base):
    __tablename__ = "admins"

    admin_id = Column(Integer, primary_key=True, autoincrement=True)

    username = Column(String(100), unique=True, nullable=False)

    email = Column(String(150), unique=True, nullable=False)

    password_hash = Column(String(255), nullable=False)

    created_at = Column(
        DateTime,
        server_default=text("CURRENT_TIMESTAMP")
    )
