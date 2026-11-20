
from sqlalchemy import (
    Column,
    Integer,
    String,
    Numeric,
    DateTime,
    ForeignKey,
    text
)
from app.database.connection import Base


class Parcel(Base):
    __tablename__ = "parcels"

    parcel_id = Column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    tracking_number = Column(
        String(50),
        unique=True,
        nullable=False
    )

    customer_id = Column(
        Integer,
        ForeignKey("customers.customer_id"),
        nullable=False
    )

    compartment_id = Column(
        Integer,
        ForeignKey("compartments.compartment_id"),
        nullable=True
    )

    parcel_description = Column(String(200))

    width_cm = Column(Numeric(5, 2), nullable=False)

    height_cm = Column(Numeric(5, 2), nullable=False)

    depth_cm = Column(Numeric(5, 2), nullable=False)

    status = Column(
        String(20),
        default="REGISTERED"
    )

    otp_hash = Column(String(255))

    collection_deadline = Column(DateTime)

    created_at = Column(
        DateTime,
        server_default=text("CURRENT_TIMESTAMP")
    )
