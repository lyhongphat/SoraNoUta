from typing import List, Optional
from sqlalchemy.orm import Session

from BACKEND.data.models.song_model import Song as SongModel
from BACKEND.data.schemas.song_schema import Song, SongCreate, SongUpdate
from BACKEND.data.repositories.song_repository import SongRepository
from BACKEND.utils.redis_utils import Redis_Caching


class SongService:
    def __init__(self, db: Session, redis_cache: Redis_Caching):
        self.repository = SongRepository(db)
        self.cache = redis_cache

    async def get_song(self, song_id: int) -> Optional[Song]:
        # Try cache first
        cached_song = await self.cache.get_object(song_id, Song)
        if cached_song:
            return cached_song

        # Fetch from DB
        db_song = self.repository.get_song(song_id)
        if db_song:
            song = Song.from_orm(db_song)
            # Cache for 1 hour
            await self.cache.set_object(song, expire=3600)
            return song
        return None

    async def get_songs(self, skip: int = 0, limit: int = 10) -> List[Song]:
        db_songs = self.repository.get_songs(skip=skip, limit=limit)
        return [Song.from_orm(song) for song in db_songs]

    async def create_song(self, song_data: SongCreate) -> Song:
        db_song = self.repository.create_song(song_data)
        song = Song.from_orm(db_song)
        # Cache the new song
        await self.cache.set_object(song, expire=3600)
        return song

    async def update_song(self, song_id: int, song_data: SongUpdate) -> Optional[Song]:
        db_song = self.repository.update_song(song_id, song_data)
        if db_song:
            song = Song.from_orm(db_song)
            # Update cache
            await self.cache.set_object(song, expire=3600)
            return song
        return None

    async def delete_song(self, song_id: int) -> bool:
        success = self.repository.delete_song(song_id)
        if success:
            # Remove from cache
            await self.cache.delete_object(song_id, Song)
        return success
