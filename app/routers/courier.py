
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.core.security import get_current_admin
from app.models.parcel import Parcel
from app.models.compartment import Compartment
from app.schemas.courier import DepositResponse
from app.services.otp_service import generate_otp, hash_otp
from app.services.parcel_event_service import log_parcel_event


router = APIRouter(
    prefix="/courier",
    tags=["Courier"]
)


@router.post(
    "/parcels/{parcel_id}/deposit",
    response_model=DepositResponse
)
def deposit_parcel(
    parcel_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    parcel = db.query(Parcel).filter(
        Parcel.parcel_id == parcel_id
    ).with_for_update().first()

    if not parcel:
        raise HTTPException(
            status_code=404,
            detail="Parcel not found"
        )

    if parcel.status != "RESERVED" or parcel.compartment_id is None:
        raise HTTPException(
            status_code=400,
            detail="Parcel is not ready for deposit"
        )

    compartment = db.query(Compartment).filter(
        Compartment.compartment_id == parcel.compartment_id
    ).with_for_update().first()

    if not compartment or compartment.status != "RESERVED":
        raise HTTPException(
            status_code=400,
            detail="Assigned compartment is not available for deposit"
        )

    try:
        otp = generate_otp()

        parcel.otp_hash = hash_otp(otp)
        parcel.status = "DEPOSITED"
        parcel.collection_deadline = datetime.now() + timedelta(hours=24)

        compartment.status = "OCCUPIED"

        db.commit()
        db.refresh(parcel)

    except Exception as exc:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Parcel deposit failed"
        ) from exc

    # Record successful deposit in MongoDB
    try:
        log_parcel_event(
            parcel_id=parcel.parcel_id,
            tracking_number=parcel.tracking_number,
            event_type="DEPOSITED",
            details={
                "status": parcel.status,
                "compartment_id": compartment.compartment_id
            }
        )
    except Exception as exc:
        print("MongoDB deposit event logging failed:", repr(exc))

    return {
        "message": "Parcel deposited successfully",
        "parcel_id": parcel.parcel_id,
        "tracking_number": parcel.tracking_number,
        "status": parcel.status,
        "compartment_id": compartment.compartment_id,
        "collection_deadline": parcel.collection_deadline,
        "development_otp": otp
    }
