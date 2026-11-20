
from sqlalchemy import Column, Integer, String, Numeric, ForeignKey
from app.database.connection import Base


class Compartment(Base):
    __tablename__ = "compartments"

    compartment_id = Column(
        Integer,
        primary_key=True,
        autoincrement=False
    )

    station_id = Column(
        Integer,
        ForeignKey("locker_stations.station_id"),
        nullable=False
    )

    compartment_size = Column(String(20), nullable=False)

    status = Column(String(20), default="AVAILABLE")

    width_cm = Column(Numeric(5, 2), nullable=False)

    height_cm = Column(Numeric(5, 2), nullable=False)

    depth_cm = Column(Numeric(5, 2), nullable=False)
