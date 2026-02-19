from datetime import datetime as dt
from typing import Optional

from sqlalchemy import DateTime, String, Integer, ForeignKey, Numeric
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import GeneralFieldBase

MAX_LENGTH_DESCRIPTION = 500


class Expense(GeneralFieldBase):
    __tablename__ = 'expense'
    amount: Mapped[float] = mapped_column(
        Numeric(10, 2), nullable=False, comment='Сумма расхода'
    )
    description: Mapped[Optional[str]] = mapped_column(
        String(MAX_LENGTH_DESCRIPTION), comment='Описание расхода'
    )
    category_id: Mapped[int] = mapped_column(
        Integer, ForeignKey('expense_category.id'), comment='ID категории'
    )
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey('user.id'), nullable=False
    )
    date: Mapped[dt] = mapped_column(
        DateTime, default=dt.now, comment='Дата совершения расхода'
    )
    created_at: Mapped[dt] = mapped_column(
        DateTime, default=dt.now, nullable=False,
        comment='Дата создания записи'
    )
    is_paid: Mapped[bool] = mapped_column(
        default=True, comment='Оплачен ли расход'
    )

    def __repr__(self) -> str:
        return f'{self.id}, amount={self.amount}, date={self.date}'
