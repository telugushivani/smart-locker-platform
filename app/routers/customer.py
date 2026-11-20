
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.security import get_current_admin
from app.database.dependencies import get_db
from app.models.admin import Admin
from app.models.customer import Customer
from app.models.parcel import Parcel
from app.models.compartment import Compartment
from app.schemas.customer import CustomerCreate, CustomerResponse
from app.schemas.collection import CollectionRequest, CollectionResponse
from app.services.otp_service import verify_otp
from app.services.parcel_event_service import log_parcel_event


router = APIRouter(
    prefix="/customers",
    tags=["Customers"]
)


@router.post("/", response_model=CustomerResponse, status_code=201)
def create_customer(
    customer_data: CustomerCreate,
    db: Session = Depends(get_db)
):
    existing_customer = db.query(Customer).filter(
        Customer.email == customer_data.email
    ).first()

    if existing_customer:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_customer = Customer(
        customer_id=customer_data.customer_id,
        full_name=customer_data.full_name,
        email=customer_data.email,
        phone_number=customer_data.phone_number
    )

    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)

    return new_customer


@router.get("/", response_model=list[CustomerResponse])
def get_customers(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    return db.query(Customer).order_by(
        Customer.customer_id
    ).all()


@router.post(
    "/parcels/{parcel_id}/collect",
    response_model=CollectionResponse
)
def collect_parcel(
    parcel_id: int,
    collection_data: CollectionRequest,
    db: Session = Depends(get_db)
):
    parcel = db.query(Parcel).filter(
        Parcel.parcel_id == parcel_id
    ).with_for_update().first()

    if not parcel:
        raise HTTPException(
            status_code=404,
            detail="Parcel not found"
        )

    if parcel.status != "DEPOSITED":
        raise HTTPException(
            status_code=400,
            detail="Parcel is not ready for collection"
        )

    if (
        parcel.collection_deadline
        and datetime.now() > parcel.collection_deadline
    ):
        raise HTTPException(
            status_code=400,
            detail="Collection deadline has expired"
        )

    if not parcel.otp_hash or not verify_otp(
        collection_data.otp,
        parcel.otp_hash
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid OTP"
        )

    compartment = db.query(Compartment).filter(
        Compartment.compartment_id == parcel.compartment_id
    ).with_for_update().first()

    if not compartment or compartment.status != "OCCUPIED":
        raise HTTPException(
            status_code=400,
            detail="Assigned compartment is not occupied"
        )

    try:
        parcel.status = "COLLECTED"
        parcel.otp_hash = None
        compartment.status = "AVAILABLE"

        db.commit()
        db.refresh(parcel)

    except Exception as exc:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Parcel collection failed"
        ) from exc

    # Record successful collection in MongoDB
    try:
        log_parcel_event(
            parcel_id=parcel.parcel_id,
            tracking_number=parcel.tracking_number,
            event_type="COLLECTED",
            details={
                "status": parcel.status,
                "compartment_id": compartment.compartment_id
            }
        )
    except Exception as exc:
        print("MongoDB collection event logging failed:", repr(exc))

    return {
        "message": "Parcel collected successfully",
        "parcel_id": parcel.parcel_id,
        "tracking_number": parcel.tracking_number,
        "status": parcel.status,
        "compartment_id": compartment.compartment_id
    }
