from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.base import CRUDBase
from app.models import Income, User


class CRUDIncome(CRUDBase):

    @staticmethod
    async def get_all_income_by_user(user: User, session: AsyncSession):
        income = await session.execute(
            select(Income).where(
                Income.user_id == user.id
            )
        )
        return income.scalars().all()


income_crud = CRUDIncome(Income)
