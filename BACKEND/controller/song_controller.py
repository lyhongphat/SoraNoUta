from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List

from BACKEND.data.db import get_db
from BACKEND.data.schemas.song_schema import Song, SongCreate, SongUpdate
from BACKEND.service.song_service import SongService
from BACKEND.utils.redis_utils import Redis_Caching
from BACKEND.config import REDIS_URL

router = APIRouter(prefix="/songs", tags=["Songs"])

# Initialize Redis cache
redis_cache = Redis_Caching(REDIS_URL)


def get_song_service(db: Session = Depends(get_db)) -> SongService:
    return SongService(db, redis_cache)


@router.post(
    "/",
    response_model=Song,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new song",
    description="Add a new song to the database and cache it in Redis.",
)
async def create_song(
    song: SongCreate,
    service: SongService = Depends(get_song_service),
):
    return await service.create_song(song)


@router.get(
    "/",
    response_model=List[Song],
    summary="Get all songs",
    description="Retrieve a paginated list of songs from the database.",
)
async def get_songs(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(
        10, ge=1, le=100, description="Maximum number of records to return"),
    service: SongService = Depends(get_song_service),
):
    return await service.get_songs(skip=skip, limit=limit)


@router.get(
    "/{song_id}",
    response_model=Song,
    summary="Get a song by ID",
    description="Retrieve a specific song by its ID. Checks Redis cache first, then database.",
)
async def get_song(
    song_id: int,
    service: SongService = Depends(get_song_service),
):
    song = await service.get_song(song_id)
    if not song:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Song with id {song_id} not found"
        )
    return song


@router.put(
    "/{song_id}",
    response_model=Song,
    summary="Update a song",
    description="Update an existing song's information and refresh the cache.",
)
async def update_song(
    song_id: int,
    song: SongUpdate,
    service: SongService = Depends(get_song_service),
):
    updated_song = await service.update_song(song_id, song)
    if not updated_song:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Song with id {song_id} not found"
        )
    return updated_song


@router.delete(
    "/{song_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a song",
    description="Delete a song from the database and remove it from cache.",
)
async def delete_song(
    song_id: int,
    service: SongService = Depends(get_song_service),
):
    success = await service.delete_song(song_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Song with id {song_id} not found"
        )
