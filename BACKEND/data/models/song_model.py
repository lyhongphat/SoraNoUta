from sqlalchemy import Column, Integer, String, Float
from BACKEND.data.db import Base


class Song(Base):
    __tablename__ = "songs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    artist = Column(String, index=True)
    album = Column(String, index=True)
    duration = Column(Float, nullable=True)
