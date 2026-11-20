
from app.database.connection import SessionLocal


def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()
"""Simple explanation
- SessionLocal() creates a database session.
- yield db provides that session to the API.
- finally closes the session after the request finishes.
This is called Dependency Injection in FastAPI."""