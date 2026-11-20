
from sqlalchemy import Column, Integer, String, DateTime, text
from app.database.connection import Base


class Customer(Base):
    __tablename__ = "customers"

    customer_id = Column(Integer, primary_key=True, autoincrement=False)
    full_name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    phone_number = Column(String(15), nullable=False)
    created_at = Column(
        DateTime,
        server_default=text("CURRENT_TIMESTAMP")
    )
