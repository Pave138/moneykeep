from typing import Union
from http import HTTPStatus

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.category import expense_category_crud, income_category_crud
from app.crud.expense import expense_crud
from app.crud.income import income_crud
from app.models import ExpenseCategory, IncomeCategory, Expense, Income, User


async def check_expense_category_exists(
        category_id: int, session: AsyncSession
) -> ExpenseCategory:
    category = await expense_category_crud.get(category_id, session)
    if not category:
        HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail=f'Категория с идентификатором {category_id} не найдена!'
        )
    return category


async def check_expense_category_name_duplicate(
        category_name: str, session: AsyncSession
) -> None:
    """Проверяет, существует ли уже категория с указанным именем."""
    category_id = await expense_category_crud.get_category_id_by_name(
        category_name, session
    )
    if category_id is not None:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail='Категория с таким именем уже существует!'
        )


async def check_income_category_exists(
        category_id: int, session: AsyncSession
) -> IncomeCategory:
    category = await income_category_crud.get(category_id, session)
    if not category:
        HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail=f'Категория с идентификатором {category_id} не найдена!'
        )
    return category


async def check_income_category_name_duplicate(
        category_name: str, session: AsyncSession
) -> None:
    """Проверяет, существует ли уже категория с указанным именем."""
    category_id = await income_category_crud.get_category_id_by_name(
        category_name, session
    )
    if category_id is not None:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail='Категория с таким именем уже существует!'
        )


async def check_expense_exists(
        expense_id: int, session: AsyncSession
) -> Expense:
    """Проверяет, существует ли расход по ID."""
    expense = await expense_crud.get(expense_id, session)
    if not expense:
        HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail=f'Расход с идентификатором {expense_id} не найден!'
        )
    return expense


async def check_user_own_expense(
        expense: Expense, user: User, session: AsyncSession
) -> Expense:
    """pass"""
    if not expense.user_id == user.id:
        HTTPException(
            status_code=HTTPStatus.FORBIDDEN,
            detail='Удалять чужие расходы запрещено!'
        )
    return expense


async def check_income_exists(income_id: int, session: AsyncSession) -> Income:
    """Проверяет, существует ли доход по ID."""
    income = await income_crud.get(income_id, session)
    if not income:
        HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail=f'Доход с идентификатором {income_id} не найден!'
        )
    return income


async def check_user_own_income(
        income: Income, user: User, session: AsyncSession
) -> Income:
    """pass"""
    if not income.user_id == user.id:
        HTTPException(
            status_code=HTTPStatus.FORBIDDEN,
            detail='Удалять чужие доходы запрещено!'
        )
    return income
