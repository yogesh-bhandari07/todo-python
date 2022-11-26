from sqlalchemy import Column, Integer, String, Boolean, DateTime
from config import Base
import datetime


class Users(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    password = Column(String)
    email = Column(String)
    
    created_at = Column(DateTime, default=datetime.datetime.now())
    updated_at = Column(DateTime)
    
class Tasks(Base):
    __tablename__ = 'tasks'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    task= Column(String)
    is_completed = Column(Integer)
    created_at = Column(DateTime, default=datetime.datetime.now())
    updated_at = Column(DateTime)
    
