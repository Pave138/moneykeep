from datetime import datetime as dt
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.models.income import MAX_LENGTH_DESCRIPTION
from app.schemas.expense import MIN_LENGTH_AMOUNT


class IncomeBase(BaseModel):
    amount: float = Field(gt=MIN_LENGTH_AMOUNT, description='Сумма дохода')
    description: Optional[str] = Field(None, max_length=MAX_LENGTH_DESCRIPTION)
    category_id: int
    date: dt = Field(default_factory=dt.now)

    model_config = ConfigDict(extra='forbid')


class IncomeCreate(IncomeBase):
    pass


class IncomeUpdate(BaseModel):
    amount: Optional[float] = Field(gt=MIN_LENGTH_AMOUNT)
    description: Optional[str] = Field(max_length=MAX_LENGTH_DESCRIPTION)
    category_id: Optional[int]
    date: Optional[dt]

    model_config = ConfigDict(extra='forbid')


class IncomeDB(IncomeBase):
    id: int
    created_at: dt

    model_config = ConfigDict(from_attributes=True)
