#!/bin/sh
set -e

echo "Waiting for database to be ready..."
sleep 5

echo "Creating database tables..."
python -c "
from BACKEND.data.db import engine, Base
from BACKEND.data.models.song_model import Song
print('Running Base.metadata.create_all...')
Base.metadata.create_all(bind=engine)
print('Tables created successfully!')
" || echo "Failed to create tables, will retry on startup event"

echo "Starting application..."
exec "$@"
