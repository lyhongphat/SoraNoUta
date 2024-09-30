"""
Database initialization script.
Run this to create all tables.
"""
from BACKEND.data.db import engine, Base
from BACKEND.data.models.song_model import Song  # Import models to register them

if __name__ == "__main__":
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully!")
