from typing import Optional, List

from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.db import GeneralFieldBase

MAX_LENGTH_NAME = 100


class BaseCategory(GeneralFieldBase):
    __abstract__ = True

    name: Mapped[int] = mapped_column(
        String(MAX_LENGTH_NAME), nullable=False, unique=True,
        comment='Название категории'
    )

    def __repr__(self) -> str:
        return f'{self.id} {self.name}'


class ExpenseCategory(BaseCategory):
    __tablename__ = 'expense_category'

    expenses: Mapped[List['Expense']] = relationship(cascade='delete')


class IncomeCategory(BaseCategory):
    __tablename__ = 'income_category'

    income: Mapped[List['Income']] = relationship(cascade='delete')
