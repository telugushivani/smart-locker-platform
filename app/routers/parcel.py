
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.security import get_current_admin
from app.database.dependencies import get_db
from app.models.parcel import Parcel
from app.models.customer import Customer
from app.schemas.parcel import ParcelCreate, ParcelResponse
from app.services.compartment_allocation import allocate_compartment
from app.services.parcel_event_service import log_parcel_event


router = APIRouter(
    prefix="/parcels",
    tags=["Parcels"]
)


@router.post("/", response_model=ParcelResponse, status_code=201)
def create_parcel(
    parcel_data: ParcelCreate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    customer = db.query(Customer).filter(
        Customer.customer_id == parcel_data.customer_id
    ).first()

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    new_parcel = Parcel(
        tracking_number=f"PKG-{uuid4().hex[:10].upper()}",
        customer_id=parcel_data.customer_id,
        parcel_description=parcel_data.parcel_description,
        width_cm=parcel_data.width_cm,
        height_cm=parcel_data.height_cm,
        depth_cm=parcel_data.depth_cm,
        status="REGISTERED"
    )

    try:
        db.add(new_parcel)
        db.flush()

        allocated_compartment = allocate_compartment(db, new_parcel)

        if not allocated_compartment:
            raise HTTPException(
                status_code=400,
                detail="No suitable available compartment found for this parcel"
            )

        db.commit()
        db.refresh(new_parcel)

    except HTTPException:
        db.rollback()
        raise

    except Exception as exc:
        db.rollback()
        print("Parcel registration error:", repr(exc))
        raise HTTPException(
            status_code=500,
            detail="Parcel registration failed"
        ) from exc

    try:
        log_parcel_event(
            parcel_id=new_parcel.parcel_id,
            tracking_number=new_parcel.tracking_number,
            event_type="REGISTERED",
            details={
                "status": new_parcel.status,
                "customer_id": new_parcel.customer_id
            }
        )
    except Exception as exc:
        print("MongoDB event logging failed:", repr(exc))

    return new_parcel



    # Save parcel registration event in MongoDB
    try:
        log_parcel_event(
            parcel_id=new_parcel.parcel_id,
            tracking_number=new_parcel.tracking_number,
            event_type="REGISTERED",
            details={
                "status": new_parcel.status,
                "customer_id": new_parcel.customer_id
            }
        )
    except Exception as exc:
        print("MongoDB event logging failed:", repr(exc))

    return new_parcel


@router.get("/", response_model=list[ParcelResponse])
def get_parcels(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    return db.query(Parcel).order_by(
        Parcel.parcel_id
    ).all()


@router.get("/track/{tracking_number}")
def track_parcel(
    tracking_number: str,
    db: Session = Depends(get_db)
):
    parcel = db.query(Parcel).filter(
        Parcel.tracking_number == tracking_number
    ).first()

    if not parcel:
        raise HTTPException(
            status_code=404,
            detail="Parcel not found. Please check your tracking number."
        )

    return {
        "tracking_number": parcel.tracking_number,
        "parcel_description": parcel.parcel_description,
        "status": parcel.status,
        "collection_deadline": parcel.collection_deadline
    }


@router.get("/{parcel_id}", response_model=ParcelResponse)
def get_parcel(
    parcel_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    parcel = db.query(Parcel).filter(
        Parcel.parcel_id == parcel_id
    ).first()

    if not parcel:
        raise HTTPException(
            status_code=404,
            detail="Parcel not found"
        )

    return parcel
