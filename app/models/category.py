from typing import Optional, List

from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.db import GeneralFieldBase


class ExpenseCategory(GeneralFieldBase):
    __tablename__ = 'expense_category'

    name: Mapped[int] = mapped_column(
        String(100), nullable=False, unique=True, comment='Название категории'
    )
    description: Mapped[Optional[str]] = mapped_column(
        Text, comment='Описание категории'
    )
    color: Mapped[Optional[str]] = mapped_column(
        String(7), default='#000000', comment='Цвет категории (HEX)'
    )
    icon: Mapped[Optional[str]] = mapped_column(
        String(50), comment='Иконка категории'
    )
    expenses: Mapped[List['Expense']] = relationship(cascade='delete')

    def __repr__(self) -> str:
        return f'{self.id} {self.name}'
