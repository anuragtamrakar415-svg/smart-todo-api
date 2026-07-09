from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, JSON
from app.database.db import Base
from datetime import datetime, timezone


class TodoSchema(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(String(500), nullable=False)
    is_completed = Column(Boolean, default=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # ✅ These were used in CreateTodo/UpdateTodo/TodoResponse and in the
    # routes (create_todo, update_todo) but were missing from the table.
    priority = Column(String(20), default="medium")
    due_date = Column(DateTime, nullable=True)
    category = Column(String(50), default="personal")
    tags = Column(JSON, default=list)
    reminder = Column(DateTime, nullable=True)
    notes = Column(String(1000), nullable=True)

    # ✅ Routes filter on TodoSchema.deleted_at (soft delete) — column
    # did not exist before, which would crash every query.
    deleted_at = Column(DateTime, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
