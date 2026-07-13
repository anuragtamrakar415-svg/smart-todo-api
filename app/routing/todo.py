from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.database.schema.todo_schema import TodoSchema
from app.database.schema.user_schema import UserSchema
from app.models.todo import CreateTodo, UpdateTodo
from app.dependencies import authenticate_user
from datetime import datetime, timezone

router = APIRouter(prefix="/api/todo")


@router.get("/")
async def get_todos(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[UserSchema, Depends(authenticate_user)]
):
    """Get all todos for current user only"""
    todos = db.query(TodoSchema).filter(
        TodoSchema.user_id == current_user.id,
        TodoSchema.deleted_at.is_(None)
    ).order_by(TodoSchema.created_at.desc()).all()

    return {
        "message": "Your todos",
        "todo": todos,
        "count": len(todos)
    }


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_todo(
    item: CreateTodo,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[UserSchema, Depends(authenticate_user)]
):
    """Create a new todo for current user"""
    todo = TodoSchema(
        content=item.content,
        is_completed=item.is_completed,
        priority=item.priority,
        due_date=item.due_date,
        category=item.category,
        tags=item.tags,
        reminder=item.reminder,
        notes=item.notes,
        user_id=current_user.id
    )

    db.add(todo)
    db.commit()
    db.refresh(todo)

    return {
        "message": "Todo created successfully",
        "todo": todo
    }


@router.get("/{id}")
async def get_todo_by_id(
    id: int,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[UserSchema, Depends(authenticate_user)]
):
    todo = db.query(TodoSchema).filter(
        TodoSchema.id == id,
        TodoSchema.user_id == current_user.id,
        TodoSchema.deleted_at.is_(None)
    ).first()

    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )

    return todo


@router.put("/{id}")
async def update_todo(
    id: int,
    item: UpdateTodo,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[UserSchema, Depends(authenticate_user)]
):
    todo = db.query(TodoSchema).filter(
        TodoSchema.id == id,
        TodoSchema.user_id == current_user.id,
        TodoSchema.deleted_at.is_(None)
    ).first()

    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )

    # ✅ Update ALL editable fields, not just content/is_completed
    update_data = item.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(todo, field, value)

    todo.updated_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(todo)

    return {
        "message": "Todo updated successfully",
        "todo": todo
    }


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_todo(
    id: int,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[UserSchema, Depends(authenticate_user)]
):
    todo = db.query(TodoSchema).filter(
        TodoSchema.id == id,
        TodoSchema.user_id == current_user.id,
        TodoSchema.deleted_at.is_(None)
    ).first()

    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )

    todo.deleted_at = datetime.now(timezone.utc)
    db.commit()

    return None
