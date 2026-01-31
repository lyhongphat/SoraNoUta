from sqlalchemy.orm import Session
from typing import List, Optional
from BACKEND.data.models.song_model import Song
from BACKEND.data.schemas.song_schema import SongCreate, SongUpdate


class SongRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_song(self, song_id: int) -> Optional[Song]:
        return self.db.query(Song).filter(Song.id == song_id).first()

    def get_songs(self, skip: int = 0, limit: int = 10) -> List[Song]:
        return self.db.query(Song).offset(skip).limit(limit).all()

    def create_song(self, song: SongCreate) -> Song:
        db_song = Song(**song.dict())
        self.db.add(db_song)
        self.db.commit()
        self.db.flush()
        self.db.refresh(db_song)
        return db_song

    def update_song(self, song_id: int, song: SongUpdate) -> Optional[Song]:
        db_song = self.get_song(song_id)
        if db_song:
            for key, value in song.dict(exclude_unset=True).items():
                setattr(db_song, key, value)
            self.db.commit()
            self.db.flush()
            self.db.refresh(db_song)
        return db_song

    def delete_song(self, song_id: int) -> bool:
        db_song = self.get_song(song_id)
        if db_song:
            self.db.delete(db_song)
            self.db.commit()
            return True
        return False
