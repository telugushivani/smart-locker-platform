
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.security import get_current_admin
from app.database.dependencies import get_db
from app.models.locker_station import LockerStation
from app.schemas.locker_station import (
    LockerStationCreate,
    LockerStationResponse
)


router = APIRouter(
    prefix="/locker-stations",
    tags=["Locker Stations"]
)


@router.post("/", response_model=LockerStationResponse, status_code=201)
def create_locker_station(
    station_data: LockerStationCreate,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    existing_station = db.query(LockerStation).filter(
        LockerStation.station_id == station_data.station_id
    ).first()

    if existing_station:
        raise HTTPException(
            status_code=400,
            detail="Station ID already exists"
        )

    new_station = LockerStation(**station_data.model_dump())

    db.add(new_station)
    db.commit()
    db.refresh(new_station)

    return new_station


@router.get("/", response_model=list[LockerStationResponse])
def get_locker_stations(
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    return db.query(LockerStation).order_by(
        LockerStation.station_id
    ).all()
