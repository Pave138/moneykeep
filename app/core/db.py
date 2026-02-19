from typing import Annotated, Optional

from fastapi import Depends
from sqlalchemy import Boolean, CheckConstraint, DateTime, Integer
from sqlalchemy.ext.asyncio import (
    create_async_engine, async_sessionmaker, AsyncSession
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

from app.core.config import settings


class Base(DeclarativeBase):
    pass


class GeneralFieldBase(Base):
    __abstract__ = True
    id: Mapped[int] = mapped_column(Integer, primary_key=True)


engine = create_async_engine(settings.database_url)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)


async def get_async_session():
    async with AsyncSessionLocal() as async_session:
        yield async_session


SessionDep = Annotated[AsyncSession, Depends(get_async_session)]
