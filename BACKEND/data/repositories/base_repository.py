"""
Base repository with common CRUD operations.
"""
from typing import Generic, TypeVar, Type, Optional, List
from sqlalchemy.orm import Session
from pydantic import BaseModel

from BACKEND.data.db import Base

ModelType = TypeVar("ModelType", bound=Base)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)


class BaseRepository(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    """Base repository with common CRUD operations."""

    def __init__(self, model: Type[ModelType], db: Session):
        """
        Initialize repository.

        Args:
            model: SQLAlchemy model class
            db: Database session
        """
        self.model = model
        self.db = db

    def get(self, id: int) -> Optional[ModelType]:
        """Get a single record by ID."""
        return self.db.query(self.model).filter(self.model.id == id).first()

    def get_multi(self, skip: int = 0, limit: int = 100) -> List[ModelType]:
        """Get multiple records with pagination."""
        return self.db.query(self.model).offset(skip).limit(limit).all()

    def get_all(self) -> List[ModelType]:
        """Get all records."""
        return self.db.query(self.model).all()

    def create(self, obj_in: CreateSchemaType) -> ModelType:
        """Create a new record."""
        obj_data = obj_in.model_dump() if hasattr(
            obj_in, 'model_dump') else obj_in.dict()
        db_obj = self.model(**obj_data)
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj

    def update(self, id: int, obj_in: UpdateSchemaType) -> Optional[ModelType]:
        """Update an existing record."""
        db_obj = self.get(id)
        if not db_obj:
            return None

        update_data = obj_in.model_dump(exclude_unset=True) if hasattr(
            obj_in, 'model_dump') else obj_in.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)

        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj

    def delete(self, id: int) -> bool:
        """Delete a record."""
        db_obj = self.get(id)
        if not db_obj:
            return False

        self.db.delete(db_obj)
        self.db.commit()
        return True

    def count(self) -> int:
        """Count total records."""
        return self.db.query(self.model).count()
