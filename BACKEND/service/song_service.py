from typing import List, Optional
from sqlalchemy.orm import Session

from BACKEND.data.models.song_model import Song as SongModel
from BACKEND.data.schemas.song_schema import Song, SongCreate, SongUpdate
from BACKEND.data.repositories.song_repository import SongRepository
from BACKEND.utils.redis_utils import Redis_Caching
from BACKEND.service.base_service import BaseService


class SongService(BaseService[SongModel, SongCreate, SongUpdate, Song]):
    """Service for song-related business logic."""

    def __init__(self, db: Session, redis_cache: Redis_Caching):
        repository = SongRepository(db)
        super().__init__(repository, redis_cache, Song)
        self.song_repo = repository  # Keep typed reference

    # Alias methods for backward compatibility
    async def get_song(self, song_id: int) -> Optional[Song]:
        return await self.get_by_id(song_id)

    async def get_songs(self, skip: int = 0, limit: int = 10) -> List[Song]:
        return await self.get_multi(skip=skip, limit=limit)

    async def create_song(self, song_data: SongCreate) -> Song:
        return await self.create(song_data)

    async def update_song(self, song_id: int, song_data: SongUpdate) -> Optional[Song]:
        return await self.update(song_id, song_data)

    async def delete_song(self, song_id: int) -> bool:
        return await self.delete(song_id)

    # Custom business logic methods
    async def search_by_artist(self, artist: str, skip: int = 0, limit: int = 10) -> List[Song]:
        """Search songs by artist name."""
        db_songs = self.song_repo.search_by_artist(
            artist, skip=skip, limit=limit)
        return [Song.from_orm(song) for song in db_songs]

    async def search_by_title(self, title: str, skip: int = 0, limit: int = 10) -> List[Song]:
        """Search songs by title."""
        db_songs = self.song_repo.search_by_title(
            title, skip=skip, limit=limit)
        return [Song.from_orm(song) for song in db_songs]
