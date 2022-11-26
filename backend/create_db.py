from database import Base,engine
from model import *
print('Connecting.....')
Base.metadata.create_all(engine)