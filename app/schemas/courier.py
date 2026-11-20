
from datetime import datetime
from pydantic import BaseModel


class DepositResponse(BaseModel):
    message: str
    parcel_id: int
    tracking_number: str
    status: str
    compartment_id: int
    collection_deadline: datetime

    # For local development/testing only
    development_otp: str
