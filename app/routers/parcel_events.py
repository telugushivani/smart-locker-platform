
from fastapi import APIRouter, Depends, HTTPException
from app.core.security import get_current_admin
from app.services.parcel_event_service import parcel_events

router = APIRouter(
    prefix="/parcel-events",
    tags=["Parcel Events"]
)


@router.get("/{parcel_id}")
def get_parcel_event_history(
    parcel_id: int,
    current_admin=Depends(get_current_admin)
):
    events = list(
        parcel_events.find(
            {"parcel_id": parcel_id},
            {"_id": 0}
        ).sort("created_at", 1)
    )

    if not events:
        raise HTTPException(
            status_code=404,
            detail="No event history found for this parcel"
        )

    return {
        "parcel_id": parcel_id,
        "total_events": len(events),
        "events": events
    }
