from datetime import datetime as dt
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.models.expense import MAX_LENGTH_DESCRIPTION

MIN_LENGTH_AMOUNT = 0


class ExpenseBase(BaseModel):
    amount: float = Field(gt=MIN_LENGTH_AMOUNT, description="Сумма расхода")
    description: Optional[str] = Field(None, max_length=MAX_LENGTH_DESCRIPTION)
    category_id: Optional[int] = None
    date: dt = Field(default_factory=dt.now)
    is_paid: bool = True

    model_config = ConfigDict(extra='forbid')


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseUpdate(BaseModel):
    amount: Optional[float] = Field(gt=MIN_LENGTH_AMOUNT)
    description: Optional[str] = Field(max_length=MAX_LENGTH_DESCRIPTION)
    category_id: Optional[int]
    date: Optional[dt]
    is_paid: bool

    model_config = ConfigDict(extra='forbid')


class ExpenseDB(ExpenseBase):
    id: int
    created_at: dt

    model_config = ConfigDict(from_attributes=True)
