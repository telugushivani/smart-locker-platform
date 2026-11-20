
from pydantic import BaseModel, Field, ConfigDict
from typing import Literal


class CompartmentCreate(BaseModel):
    compartment_id: int
    station_id: int
    compartment_size: Literal["SMALL", "MEDIUM", "LARGE"]
    status: Literal[
        "AVAILABLE",
        "RESERVED",
        "OCCUPIED",
        "BLOCKED",
        "MAINTENANCE",
        "INACTIVE"
    ] = "AVAILABLE"

    width_cm: float = Field(gt=0)
    height_cm: float = Field(gt=0)
    depth_cm: float = Field(gt=0)


class CompartmentResponse(BaseModel):
    compartment_id: int
    station_id: int
    compartment_size: str
    status: str
    width_cm: float
    height_cm: float
    depth_cm: float

    model_config = ConfigDict(from_attributes=True)
