
from sqlalchemy import Column, Integer, String, Text
from app.database.connection import Base


class LockerStation(Base):
    __tablename__ = "locker_stations"

    station_id = Column(
        Integer,
        primary_key=True,
        autoincrement=False
    )

    station_name = Column(String(100), nullable=False)

    location = Column(Text, nullable=False)

    operating_hours = Column(String(100))

    total_compartments = Column(Integer)

    operational_status = Column(
        String(20),
        default="ACTIVE"
    )

    connectivity_status = Column(
        String(20),
        default="OFFLINE"
    )
