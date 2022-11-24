import datetime
from database import Base
from sqlalchemy import String,Boolean,Integer,Column,Text, DateTime


class Users(Base):
    __tablename__='users'
    id=Column(Integer,primary_key=True,autoincrement=True)
    name=Column(String(255),nullable=False)
    email=Column(String(255),nullable=False)
    password=Column(String(255),nullable=False)
    status=Column(Boolean,default=True)
    created_at=Column(DateTime,default=datetime.datetime.now())
    updated_at=Column(DateTime)


class Todo(Base):
    __tablename__='todo'
    id=Column(Integer,primary_key=True,autoincrement=True)
    user_id=Column(Integer,nullable=False)
    task=Column(Text,nullable=True)
    is_done=Column(Boolean,default=False)
    status=Column(Boolean,default=True)
    created_at=Column(DateTime,default=datetime.datetime.now())
    updated_at=Column(DateTime)
    