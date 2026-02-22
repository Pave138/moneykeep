from datetime import datetime as dt
from typing import Optional

from sqlalchemy import DateTime, String, Integer, ForeignKey, Numeric
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import GeneralFieldBase
from app.models.expense import MAX_LENGTH_DESCRIPTION


class Income(GeneralFieldBase):
    __tablename__ = 'income'

    amount: Mapped[float] = mapped_column(
        Numeric(10, 2), nullable=False, comment='Сумма дохода'
    )
    description: Mapped[Optional[str]] = mapped_column(
        String(MAX_LENGTH_DESCRIPTION), comment='Описание дохода'
    )
    category_id: Mapped[int] = mapped_column(
        Integer, ForeignKey('income_category.id'), comment='ID категории'
    )
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey('user.id'), nullable=False
    )
    date: Mapped[dt] = mapped_column(
        DateTime, default=dt.now, nullable=False,
        comment='Дата создания записи'
    )
    created_at: Mapped[dt] = mapped_column(
        DateTime, default=dt.now, nullable=False,
        comment='Дата создания записи'
    )

    def __repr__(self) -> str:
        return f'{self.id}, amount={self.amount}, date={self.date}'
