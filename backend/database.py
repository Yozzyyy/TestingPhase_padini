from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

DATABASE_URL = "mysql+pymysql://user:12345@database:3306/padini"

engine = create_engine(DATABASE_URL,
                       pool_pre_ping=True,
                       )
SessionLocal = sessionmaker(autocommit = False, autoflush= False, bind = engine)

class Base(DeclarativeBase):
    pass

# This is the connector function your backend endpoints will use
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
    