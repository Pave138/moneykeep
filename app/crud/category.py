from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.base import CRUDBase
from app.models import ExpenseCategory, IncomeCategory


class CRUDCategory(CRUDBase):

    @staticmethod
    async def get_category_id_by_name(
        category_name: str,
        session: AsyncSession
    ) -> Optional[int]:
        """Асинхронно получает идентификатор категории по его имени."""
        db_category_id = await session.execute(
            select(ExpenseCategory.id).where(
                ExpenseCategory.name == category_name
            )
        )
        return db_category_id.scalars().first()


expense_category_crud = CRUDCategory(ExpenseCategory)
income_category_crud = CRUDCategory(IncomeCategory)
