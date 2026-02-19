from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTable
from sqlalchemy import Integer
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import GeneralFieldBase


class User(SQLAlchemyBaseUserTable[int], GeneralFieldBase):
    id: Mapped[int] = mapped_column(Integer, primary_key=True)