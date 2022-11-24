import uvicorn
from fastapi import FastAPI, Request, Form

# Start fastapi application
app = FastAPI()


@app.post("/register")
async def register():
    return {"message": "Hello World"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, log_level="info", reload=True)