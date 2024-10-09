from sqlalchemy import Column, Integer, String, Float
from db import Base


class Song(Base):
    __tablename__ = "songs"

    songid = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    artist = Column(String, index=True)
    album = Column(String, index=True)
    duration = Column(Float, nullable=True)
    # Thời lượng bài hát
