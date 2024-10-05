from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from pydantic import BaseModel

app = FastAPI()

# CORS configuration (Allow requests from your frontend)
origins = ["http://localhost:8000"] # Replace with your frontend URL if different
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup
DATABASE_URL = "sqlite:///./todos.db"  # Use SQLite
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Todo(Base):
    __tablename__ = "todos"
    id = Column(Integer, primary_key=True, index=True)
    text = Column(String)
    completed = Column(Boolean, default=False)

Base.metadata.create_all(bind=engine)

class TodoModel(BaseModel):
    text: str
    completed: bool = False

class TodoUpdateModel(BaseModel):
    text: str | None = None
    completed: bool | None = None

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/todos/", response_model=TodoModel)
def create_todo(todo: TodoModel, db: SessionLocal = Depends(get_db)):
    db_todo = Todo(text=todo.text, completed=todo.completed)
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

@app.get("/todos/")
def read_todos(db: SessionLocal = Depends(get_db)):
    todos = db.query(Todo).all()
    return todos

@app.get("/todos/{todo_id}", response_model=TodoModel)
def read_todo(todo_id: int, db: SessionLocal = Depends(get_db)):
    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo

@app.put("/todos/{todo_id}", response_model=TodoModel)
def update_todo(todo_id: int, todo: TodoUpdateModel, db: SessionLocal = Depends(get_db)):
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    if todo.text:
        db_todo.text = todo.text
    if todo.completed is not None:
        db_todo.completed = todo.completed
    db.commit()
    db.refresh(db_todo)
    return db_todo

@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int, db: SessionLocal = Depends(get_db)):
    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    db.delete(todo)
    db.commit()
    return {"message": "Todo deleted"}
