
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.security import get_current_admin
from app.database.dependencies import get_db
from app.models.compartment import Compartment
from app.models.locker_station import LockerStation
from app.schemas.compartment import (
    CompartmentCreate,
    CompartmentResponse
)


router = APIRouter(
    prefix="/compartments",
    tags=["Compartments"]
)


@router.post("/", response_model=CompartmentResponse, status_code=201)
def create_compartment(
    compartment_data: CompartmentCreate,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    existing_compartment = db.query(Compartment).filter(
        Compartment.compartment_id == compartment_data.compartment_id
    ).first()

    if existing_compartment:
        raise HTTPException(
            status_code=400,
            detail="Compartment ID already exists"
        )

    station = db.query(LockerStation).filter(
        LockerStation.station_id == compartment_data.station_id
    ).first()

    if not station:
        raise HTTPException(
            status_code=404,
            detail="Locker station not found"
        )

    new_compartment = Compartment(**compartment_data.model_dump())

    db.add(new_compartment)
    db.commit()
    db.refresh(new_compartment)

    return new_compartment


@router.get("/", response_model=list[CompartmentResponse])
def get_compartments(
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    return db.query(Compartment).order_by(
        Compartment.compartment_id
    ).all()
