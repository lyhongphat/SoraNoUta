from fastapi import FastAPI

from BACKEND.controller import auth_controller, weather_controller, song_controller
from BACKEND.data.db import Base, engine
from BACKEND.data.models.song_model import Song

app = FastAPI(title="Sora no Uta API")


@app.on_event("startup")
async def startup_event():
    """Create database tables on application startup"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created!")


@app.get("/")
def read_root():
    return {"Hello": "World"}


app.include_router(weather_controller.router)
app.include_router(auth_controller.router)
app.include_router(song_controller.router)
