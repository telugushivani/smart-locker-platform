
from pydantic import BaseModel, Field, ConfigDict


class LockerStationCreate(BaseModel):
    station_id: int
    station_name: str = Field(min_length=2, max_length=100)
    location: str
    operating_hours: str | None = None
    total_compartments: int = Field(ge=0)
    operational_status: str = "ACTIVE"
    connectivity_status: str = "OFFLINE"


class LockerStationResponse(BaseModel):
    station_id: int
    station_name: str
    location: str
    operating_hours: str | None
    total_compartments: int
    operational_status: str
    connectivity_status: str

    model_config = ConfigDict(from_attributes=True)
