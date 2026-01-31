from sqlalchemy.orm import Session
from typing import List, Optional
from BACKEND.data.models.song_model import Song
from BACKEND.data.schemas.song_schema import SongCreate, SongUpdate
from BACKEND.data.repositories.base_repository import BaseRepository


class SongRepository(BaseRepository[Song, SongCreate, SongUpdate]):
    """Repository for Song model with custom methods."""

    def __init__(self, db: Session):
        super().__init__(Song, db)

    # Alias methods for backward compatibility
    def get_song(self, song_id: int) -> Optional[Song]:
        return self.get(song_id)

    def get_songs(self, skip: int = 0, limit: int = 10) -> List[Song]:
        return self.get_multi(skip=skip, limit=limit)

    def create_song(self, song: SongCreate) -> Song:
        return self.create(song)

    def update_song(self, song_id: int, song: SongUpdate) -> Optional[Song]:
        return self.update(song_id, song)

    def delete_song(self, song_id: int) -> bool:
        return self.delete(song_id)

    # Custom query methods
    def search_by_artist(self, artist: str, skip: int = 0, limit: int = 10) -> List[Song]:
        """Search songs by artist name."""
        return self.db.query(Song).filter(
            Song.artist.ilike(f"%{artist}%")
        ).offset(skip).limit(limit).all()

    def search_by_title(self, title: str, skip: int = 0, limit: int = 10) -> List[Song]:
        """Search songs by title."""
        return self.db.query(Song).filter(
            Song.title.ilike(f"%{title}%")
        ).offset(skip).limit(limit).all()
