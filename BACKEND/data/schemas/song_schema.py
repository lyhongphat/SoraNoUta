from pydantic import BaseModel
from typing import Optional


class SongBase(BaseModel):
    title: str
    artist: str
    album: Optional[str] = None
    duration: float


class SongCreate(SongBase):
    pass


class SongUpdate(BaseModel):
    title: Optional[str] = None
    artist: Optional[str] = None
    album: Optional[str] = None
    duration: Optional[float] = None


class Song(SongBase):
    id: int

    class Config:
        from_attributes = True
