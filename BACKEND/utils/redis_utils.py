from typing import Type, TypeVar, Optional
from pydantic import BaseModel
import redis.asyncio as aioredis
from BACKEND.config import REDIS_URL

T = TypeVar("T", bound=BaseModel)

# Singleton instance
_redis_cache: Optional['Redis_Caching'] = None


class Redis_Caching:
    def __init__(self, redis_url: str):
        self.redis = aioredis.from_url(redis_url, decode_responses=True)
        self.redis_url = redis_url

    async def get_object(self, object_id: int, model: Type[T]) -> Optional[T]:
        """
        Lấy object từ cache với object_id và model chỉ định.
        """
        data = await self.redis.get(f"{model.__name__.lower()}:{object_id}")
        if data:
            # Sử dụng model_validate_json để xử lý dữ liệu JSON
            return model.model_validate_json(data)
        return None

    async def set_object(self, obj: T, expire: int = 3600):
        """
        Lưu object vào cache với thời gian hết hạn (expire) mặc định là 1 giờ.
        """
        # Sử dụng model_dump_json thay vì json()
        await self.redis.set(f"{obj.__class__.__name__.lower()}:{obj.id}", obj.model_dump_json(), ex=expire)

    async def delete_object(self, object_id: int, model: Type[T]):
        """
        Xóa object khỏi cache với object_id và model chỉ định.
        """
        await self.redis.delete(f"{model.__name__.lower()}:{object_id}")

    async def close(self):
        """Close Redis connection."""
        await self.redis.close()


def get_redis_cache() -> Redis_Caching:
    """Get or create singleton Redis cache instance."""
    global _redis_cache
    if _redis_cache is None:
        _redis_cache = Redis_Caching(REDIS_URL)
    return _redis_cache
