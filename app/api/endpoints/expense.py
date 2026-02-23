from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.validators import check_expense_exists, check_user_own_expense
from app.core.db import SessionDep
from app.core.user import CurrentUserDep
from app.crud.expense import expense_crud
from app.schemas.expense import ExpenseDB, ExpenseCreate, ExpenseUpdate

router = APIRouter()


@router.post(
    '', response_model=ExpenseDB,
    summary='Создает новый расход.',
    description='Создание нового расхода.',
    response_description='Созданный расход с присвоенным ID и другими полями'
)
async def create_expense(
    obj_in: ExpenseCreate, session: SessionDep, user: CurrentUserDep
):
    new_expense = await expense_crud.create(obj_in, session, user=user)
    return new_expense


@router.get(
    '', response_model=list[ExpenseDB]
)
async def get_expense_by_user(user: CurrentUserDep, session: SessionDep):
    expenses = await expense_crud.get_all_expense_by_user(user, session)
    return expenses


@router.patch(
    '/{expense_id}', response_model=ExpenseDB
)
async def update_expense(
    expense_id: int, obj_in: ExpenseUpdate, user: CurrentUserDep,
    session: SessionDep
):
    expense = await check_expense_exists(expense_id, session)
    expense = await expense_crud.update(
        db_obj=expense,
        obj_in=obj_in,
        user=user,
        session=session
    )
    return expense


@router.delete('/{expense_id}', response_model=ExpenseDB)
async def delete_expense(
    expense_id: int, user: CurrentUserDep, session: SessionDep
):
    expense = await check_expense_exists(expense_id, session)
    expense = await check_user_own_expense(expense, user, session)
    expense = await expense_crud.remove(expense, session)
    return expense
