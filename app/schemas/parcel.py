
from datetime import datetime

from pydantic import BaseModel, Field, ConfigDict


class ParcelCreate(BaseModel):
    customer_id: int
    parcel_description: str | None = None

    width_cm: float = Field(gt=0)
    height_cm: float = Field(gt=0)
    depth_cm: float = Field(gt=0)


class ParcelResponse(BaseModel):
    parcel_id: int
    tracking_number: str
    customer_id: int
    compartment_id: int | None
    parcel_description: str | None

    width_cm: float
    height_cm: float
    depth_cm: float

    status: str
    collection_deadline: datetime | None
    created_at: datetime | None

    model_config = ConfigDict(from_attributes=True)
