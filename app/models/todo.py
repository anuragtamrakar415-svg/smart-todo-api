from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class CreateTodo(BaseModel):
    content: str = Field(..., min_length=1, max_length=500, description="Todo content")
    is_completed: bool = Field(default=False, description="Completion status")
    priority: Optional[str] = Field(default="medium", description="Priority: low, medium, high")
    due_date: Optional[datetime] = Field(None, description="Due date for the task")
    category: Optional[str] = Field(default="personal", description="Category: personal, work, study, health")
    tags: Optional[list[str]] = Field(default_factory=list, description="Tags for organization")
    reminder: Optional[datetime] = Field(None, description="Reminder time")
    notes: Optional[str] = Field(None, max_length=1000, description="Additional notes")


class UpdateTodo(BaseModel):
    content: Optional[str] = Field(None, min_length=1, max_length=500)
    is_completed: Optional[bool] = None
    priority: Optional[str] = Field(None, description="priority: low, medium, high")
    due_date: Optional[datetime] = None
    category: Optional[str] = None
    tags: Optional[list[str]] = None
    reminder: Optional[datetime] = None
    notes: Optional[str] = Field(None, max_length=1000)


class TodoResponse(BaseModel):
    id: int
    content: str
    is_completed: bool
    priority: str
    due_date: Optional[datetime]
    category: str
    tags: list[str]
    reminder: Optional[datetime]
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime
    user_id: int

    class Config:
        from_attributes = True
