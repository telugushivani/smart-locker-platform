from app.routers import parcel_events
from app.database.mongodb import check_mongodb_connection
from app.routers.admin import router as admin_router
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException
from sqlalchemy import text

from app.database.connection import engine
from app.database.connection import Base
from app.models.admin import Admin

from app.routers.customer import router as customer_router
from app.routers.locker_station import router as locker_station_router
from app.routers.compartment import router as compartment_router
from app.routers.parcel import router as parcel_router
from app.routers.courier import router as courier_router


app = FastAPI(
    title="Smart Locker Platform",
    description="Smart Parcel and E-Commerce Delivery Locker Network"
)
# Register database models and create missing tables
Base.metadata.create_all(bind=engine)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Register all routers
app.include_router(customer_router)
app.include_router(locker_station_router)
app.include_router(compartment_router)
app.include_router(parcel_router)
app.include_router(courier_router)
app.include_router(admin_router)
app.include_router(parcel_events.router)

@app.get("/")
def home():
    return {
        "message": "Welcome To Smart Locker Platform",
        "status": "Application runs successfully"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/mongo-health")
def mongo_health():
    try:
        check_mongodb_connection()
        return {
            "database": "MongoDB",
            "status": "connected"
        }
    except Exception as e:
        print("MongoDB health error:", repr(e))
        raise HTTPException(
            status_code=503,
            detail="MongoDB connection failed"
        )

@app.get("/db-health")
def database_health_check():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "database": "connected",
            "status": "healthy"
        }

    except Exception as exc:
        raise HTTPException(
            status_code=503,
            detail="Database connection failed"
        ) from exc
