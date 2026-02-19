from typing import Optional, List

from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.db import GeneralFieldBase

MAX_LENGTH_NAME = 100
MAX_LENGTH_COLOR = 7
MAX_LENGTH_ICON = 50
DEFAULT_COLOR = '#000000'


class ExpenseCategory(GeneralFieldBase):
    __tablename__ = 'expense_category'

    name: Mapped[int] = mapped_column(
        String(MAX_LENGTH_NAME), nullable=False, unique=True,
        comment='Название категории'
    )
    description: Mapped[Optional[str]] = mapped_column(
        Text, comment='Описание категории'
    )
    color: Mapped[Optional[str]] = mapped_column(
        String(MAX_LENGTH_COLOR), default=DEFAULT_COLOR,
        comment='Цвет категории (HEX)'
    )
    icon: Mapped[Optional[str]] = mapped_column(
        String(MAX_LENGTH_ICON), comment='Иконка категории'
    )
    expenses: Mapped[List['Expense']] = relationship(cascade='delete')

    def __repr__(self) -> str:
        return f'{self.id} {self.name}'
