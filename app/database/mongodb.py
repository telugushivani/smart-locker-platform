
import os

from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise ValueError("MONGO_URI is missing from .env file")

mongo_client = MongoClient(
    MONGO_URI,
    serverSelectionTimeoutMS=5000
)

mongo_db = mongo_client["smart_locker_events"]


def check_mongodb_connection():
    mongo_client.admin.command("ping")
    return True
