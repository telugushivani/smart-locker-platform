
from pydantic import BaseModel, EmailStr, Field


class CustomerCreate(BaseModel):
    customer_id: int
    full_name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    phone_number: str = Field(min_length=10, max_length=15)


class CustomerResponse(BaseModel):
    customer_id: int
    full_name: str
    email: EmailStr
    phone_number: str

    model_config = {
        "from_attributes": True
    }
