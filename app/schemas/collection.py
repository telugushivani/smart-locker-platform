from pydantic import BaseModel, Field


class CollectionRequest(BaseModel):
    otp: str = Field(
        min_length=6,
        max_length=6,
        pattern=r"^\d{6}$"
    )


class CollectionResponse(BaseModel):
    message: str
    parcel_id: int
    tracking_number: str
    status: str
    compartment_id: int