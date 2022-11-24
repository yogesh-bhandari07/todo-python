from database import Base,engine
from models import *
print('Connecting.....')
Base.metadata.create_all(engine)