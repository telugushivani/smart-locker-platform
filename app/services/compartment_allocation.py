
from sqlalchemy.orm import Session

from app.models.compartment import Compartment
from app.models.parcel import Parcel


def allocate_compartment(
    db: Session,
    parcel: Parcel
):
    available_compartments = db.query(Compartment).filter(
        Compartment.status == "AVAILABLE"
    ).order_by(
        Compartment.compartment_id
    ).with_for_update().all()

    for compartment in available_compartments:

        if (
            float(compartment.width_cm) >= float(parcel.width_cm)
            and float(compartment.height_cm) >= float(parcel.height_cm)
            and float(compartment.depth_cm) >= float(parcel.depth_cm)
        ):
            compartment.status = "RESERVED"
            parcel.compartment_id = compartment.compartment_id
            parcel.status = "RESERVED"

            return compartment

    return None
