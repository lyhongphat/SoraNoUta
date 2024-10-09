from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from dotenv import load_dotenv
import os
load_dotenv()

# SQLALCHEMY_DATABASE_URL = f"postgresql://username:password@localhost/dbname"
SQLALCHEMY_DATABASE_URL = f"postgresql://{
    os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}@localhost/{os.getenv('POSTGRES_DB')}"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# khi crud phải thêm 2 câu
# session.commit()
# session.flush()
Base = declarative_base()
