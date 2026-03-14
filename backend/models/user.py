from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)

    todos: Mapped[list["Todo"]] = relationship("Todo", back_populates="owner")
    messages: Mapped[list["Message"]] = relationship("Message", back_populates="author")
    progress: Mapped[list["UserProgress"]] = relationship("UserProgress", back_populates="user")
