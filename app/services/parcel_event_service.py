from datetime import datetime, timezone

from app.database.mongodb import mongo_db


parcel_events = mongo_db["parcel_events"]


def log_parcel_event(
    parcel_id,
    tracking_number,
    event_type,
    details=None
):
    event = {
        "parcel_id": parcel_id,
        "tracking_number": tracking_number,
        "event_type": event_type,
        "details": details or {},
        "created_at": datetime.now(timezone.utc)
    }

    parcel_events.insert_one(event)

    return event