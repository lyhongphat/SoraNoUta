"""
Base service with common patterns.
"""
from typing import Generic, TypeVar, Type, Optional, List
from sqlalchemy.orm import Session
from pydantic import BaseModel

from BACKEND.data.repositories.base_repository import BaseRepository
from BACKEND.utils.redis_utils import Redis_Caching
from BACKEND.utils.logger import logger

ModelType = TypeVar("ModelType")
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)
SchemaType = TypeVar("SchemaType", bound=BaseModel)


class BaseService(Generic[ModelType, CreateSchemaType, UpdateSchemaType, SchemaType]):
    """Base service with common business logic patterns."""
    
    def __init__(
        self,
        repository: BaseRepository,
        cache: Redis_Caching,
        schema: Type[SchemaType]
    ):
        """
        Initialize base service.
        
        Args:
            repository: Repository instance
            cache: Redis cache instance
            schema: Pydantic schema for serialization
        """
        self.repository = repository
        self.cache = cache
        self.schema = schema
    
    async def get_by_id(self, id: int, use_cache: bool = True) -> Optional[SchemaType]:
        """
        Get entity by ID with optional caching.
        
        Args:
            id: Entity ID
            use_cache: Whether to use cache
            
        Returns:
            Entity schema or None
        """
        if use_cache:
            cached = await self.cache.get_object(id, self.schema)
            if cached:
                logger.info(f"Cache hit for {self.schema.__name__} ID {id}")
                return cached
        
        db_obj = self.repository.get(id)
        if db_obj:
            obj = self.schema.from_orm(db_obj)
            if use_cache:
                await self.cache.set_object(obj, expire=3600)
            return obj
        return None
    
    async def get_multi(self, skip: int = 0, limit: int = 10) -> List[SchemaType]:
        """Get multiple entities with pagination."""
        db_objs = self.repository.get_multi(skip=skip, limit=limit)
        return [self.schema.from_orm(obj) for obj in db_objs]
    
    async def create(self, obj_in: CreateSchemaType) -> SchemaType:
        """Create new entity and cache it."""
        db_obj = self.repository.create(obj_in)
        obj = self.schema.from_orm(db_obj)
        await self.cache.set_object(obj, expire=3600)
        logger.info(f"Created {self.schema.__name__} ID {obj.id}")
        return obj
    
    async def update(self, id: int, obj_in: UpdateSchemaType) -> Optional[SchemaType]:
        """Update entity and refresh cache."""
        db_obj = self.repository.update(id, obj_in)
        if db_obj:
            obj = self.schema.from_orm(db_obj)
            await self.cache.set_object(obj, expire=3600)
            logger.info(f"Updated {self.schema.__name__} ID {id}")
            return obj
        return None
    
    async def delete(self, id: int) -> bool:
        """Delete entity and remove from cache."""
        success = self.repository.delete(id)
        if success:
            await self.cache.delete_object(id, self.schema)
            logger.info(f"Deleted {self.schema.__name__} ID {id}")
        return success
