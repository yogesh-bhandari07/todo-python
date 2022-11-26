from fastapi import APIRouter, Depends
from schema import *
from sqlalchemy.orm import Session
from config import get_db, ACCESS_TOKEN_EXPIRE_MINUTES
from passlib.context import CryptContext
from repository import JWTRepo, JWTBearer, UsersRepo,TasksRepo
from model import Users,Tasks
from datetime import datetime, timedelta

router = APIRouter()

# encrypt password
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


"""
    Authentication Router

"""


@router.post('/signup')
async def signup(request: RequestSchema, db: Session = Depends(get_db)):
    try:
        # insert user to db
        _user = Users(
                      email=request.parameter.data["email"],
                      password=pwd_context.hash(request.parameter.data["password"]),
                      name=request.parameter.data['name'])
        UsersRepo.insert(db, _user)

        token = JWTRepo.generate_token({"sub": _user.email})

        user={
            'name':_user.name,
            'email':_user.email,
            'id':_user.id,
        }

        return ResponseSchema(code="200", status="OK", message="Successfully Register", result=TokenResponse(access_token=token, token_type="Bearer",user_data=user),).dict(exclude_none=True)
    except Exception as error:
        print(error.args)
        return ResponseSchema(code="500", status="Error", message="Internal Server Error").dict(exclude_none=True)


@router.post('/login')
async def login(request: RequestSchema, db: Session = Depends(get_db)):
    try:
       # find user by email
        _user = UsersRepo.find_by_email(
            db, Users, request.parameter.data["email"])

        if not pwd_context.verify(request.parameter.data["password"], _user.password):
            return ResponseSchema(code="400", status="Bad Request", message="Invalid password").dict(exclude_none=True)

        token = JWTRepo.generate_token({"sub": _user.email})

        user={
            'name':_user.name,
            'email':_user.email,
            'id':_user.id,
        }

        return ResponseSchema(code="200", status="OK", message="success login!", result=TokenResponse(access_token=token, token_type="Bearer",user_data=user),).dict(exclude_none=True)
    except Exception as error:
        error_message = str(error.args)
        print(error_message)
        return ResponseSchema(code="500", status="Internal Server Error", message="Internal Server Error").dict(exclude_none=True)


"""
    Tasks Router

"""




@router.post('/task')
async def createTask(request: RequestSchema, db: Session = Depends(get_db)):
    try:
        # insert task to db
        _task = Tasks(
            user_id=request.parameter.data["user_id"],
            task=request.parameter.data["task"])
        TasksRepo.insert(db, _task)
        return ResponseSchema(code="200", status="Ok", message="Success save data").dict(exclude_none=True)
    except Exception as error:
        print(error.args)
        return ResponseSchema(code="500", status="Error", message="Internal Server Error").dict(exclude_none=True)



@router.get('/task/{id}')
async def getOneTask(id:int, db: Session = Depends(get_db)):
    try:
       # find user by email
       
        _task = TasksRepo.retrieve_by_id(db,Tasks,id)

        taskData={
            'task':_task[0].task,
            'user_id':_task[0].user_id,
            'id':_task[0].id,
            'is_completed':_task[0].is_completed
        }
        print(taskData)

        return ResponseSchema(code="200", status="OK", message="successfully Fetched!", result=TaskResponse(task=taskData)).dict(exclude_none=True)
    except Exception as error:
        error_message = str(error.args)
        print(error_message)
        return ResponseSchema(code="500", status="Internal Server Error", message="Internal Server Error").dict(exclude_none=True)


@router.delete('/task/{id}')
async def deleteOneTask(id:int, db: Session = Depends(get_db)):
    try:
       # find user by email
        task = TasksRepo.retrieve_by_id(db,Tasks,id)
        if(not task):
            return ResponseSchema(code="400", status="Bad Request", message="Invalid task ID").dict(exclude_none=True)
        _task = TasksRepo.delete_by_id(db,Tasks,id)
        return ResponseSchema(code="200", status="OK", message="successfully deleted").dict(exclude_none=True)
    except Exception as error:
        error_message = str(error.args)
        print(error_message)
        return ResponseSchema(code="500", status="Internal Server Error", message="Internal Server Error").dict(exclude_none=True)



@router.put('/task')
async def updateTask(request: RequestSchema, db: Session = Depends(get_db)):
    try:
       # find user by email
        id = request.parameter.data["id"]
        print(id)
        task = TasksRepo.retrieve_by_id(db,Tasks,id)
        if(not task):
            return ResponseSchema(code="400", status="Bad Request", message="Invalid task ID").dict(exclude_none=True)

        taskData={
            "id":id,
            "task":request.parameter.data["task"],
            "is_completed":request.parameter.data["is_completed"]
        }

        _task = TasksRepo.update_by_id(db,Tasks,id,taskData)
        return ResponseSchema(code="200", status="OK", message="successfully updated").dict(exclude_none=True)


    except Exception as error:
        error_message = str(error.args)
        print(error_message)
        return ResponseSchema(code="500", status="Internal Server Error", message="Internal Server Error").dict(exclude_none=True)





@router.get('/tasks/{user_id}')
async def getTasks(user_id:int, db: Session = Depends(get_db)):
    try:
       # find user by email
       
        _tasks = TasksRepo.get_task_by_user_id(db,Tasks,user_id)


        taskData=[]

        for _task in _tasks:
            task={
                'task':_task.task,
                'user_id':_task.user_id,
                'id':_task.id,
                'is_completed':_task.is_completed
            }
            taskData.append(task)

     
       

        return ResponseSchema(code="200", status="OK", message="successfully Fetched!", result=TasksResponse(tasks=taskData)).dict(exclude_none=True)
    except Exception as error:
        error_message = str(error.args)
        print(error_message)
        return ResponseSchema(code="500", status="Internal Server Error", message="Internal Server Error").dict(exclude_none=True)


