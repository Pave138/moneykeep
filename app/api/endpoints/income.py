from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.validators import check_income_exists, check_user_own_income
from app.core.db import SessionDep
from app.core.user import CurrentUserDep
from app.crud.income import income_crud
from app.schemas.income import IncomeDB, IncomeCreate, IncomeUpdate

router = APIRouter()


@router.post(
    '/', response_model=IncomeDB,
    summary='Создает новый доход.',
    description='Создание нового дохода.',
    response_description='Созданный доход с присвоенным ID и другими полями'
)
async def create_income(
    obj_in: IncomeCreate, session: SessionDep, user: CurrentUserDep
):
    new_income = await income_crud.create(obj_in, session, user=user)
    return new_income


@router.get(
    '/', response_model=list[IncomeDB]
)
async def get_income_by_user(user: CurrentUserDep, session: SessionDep):
    income = await income_crud.get_all_income_by_user(user, session)
    return income


@router.patch(
    '/{income_id}', response_model=IncomeDB
)
async def update_income(
    income_id: int, obj_in: IncomeUpdate, user: CurrentUserDep,
    session: SessionDep
):
    income = await check_income_exists(income_id, session)
    income = await income_crud.update(
        db_obj=income,
        obj_in=obj_in,
        user=user,
        session=session
    )
    return income


@router.delete('/{income_id}', response_model=IncomeDB)
async def delete_income(
    income_id: int, user: CurrentUserDep, session: SessionDep
):
    income = await check_income_exists(income_id, session)
    income = await check_user_own_income(income, user, session)
    income = await income_crud.remove(income, session)
    return income
