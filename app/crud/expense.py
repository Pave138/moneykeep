from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.base import CRUDBase
from app.models import Expense, User


class CRUDExpense(CRUDBase):

    @staticmethod
    async def get_all_expense_by_user(user: User, session: AsyncSession):
        expenses = await session.execute(
            select(Expense).where(
                Expense.user_id == user.id
            )
        )
        return expenses.scalars().all()


expense_crud = CRUDExpense(Expense)
