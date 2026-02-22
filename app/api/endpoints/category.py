from fastapi import APIRouter, Depends

from app.api.validators import (
    check_expense_category_exists, check_expense_category_name_duplicate,
    check_income_category_exists, check_income_category_name_duplicate)
from app.core.db import SessionDep
from app.core.user import current_superuser
from app.crud.category import expense_category_crud, income_category_crud
from app.schemas.category import (
    CategoryCreate, CategoryDB, CategoryUpdate
)

router = APIRouter()


@router.post(
    '/expense',
    response_model=CategoryDB,
    summary='Создать новую категорию расходов. Только для суперюзеров.',
    description='Создает новую категорию расходов.',
    response_description=('Созданная категория расходов с присвоенным ID '
                          'и другими полями.'),
    dependencies=[Depends(current_superuser)]
)
async def create_expense_category(
    obj_in: CategoryCreate,
    session: SessionDep
):
    """Создает новую категорию расходов."""
    await check_expense_category_name_duplicate(obj_in.name, session)
    new_category = await expense_category_crud.create(obj_in, session)
    return new_category


@router.get(
    '/expense',
    response_model=list[CategoryDB],
    summary='Получить все категории расходов.',
    description='Возвращает список всех категорий расходов.',
    response_description='Список всех категорий расходов.'
)
async def get_expense_category(session: SessionDep):
    """Возвращает список всех категорий расходов"""
    all_categories = await expense_category_crud.get_multi(session)
    return all_categories


@router.patch(
    '/expense/{category_id}',
    response_model=CategoryDB,
    summary='Обновить категорию расходов. Только для суперюзеров.',
    description='Обновляет информацию о существующей категории расходов.',
    response_description='Обновленная категория расходов.',
    dependencies=[Depends(current_superuser)]
)
async def update_expense_category(
    category_id: int, obj_in: CategoryUpdate, session: SessionDep
):
    """Обновляет информацию о существующей категории расходов."""
    category = await check_expense_category_exists(category_id, session)
    if obj_in.name is not None:
        await check_expense_category_name_duplicate(obj_in.name, session)
    category = await expense_category_crud.update(
        db_obj=category, obj_in=obj_in, session=session
    )
    return category


@router.delete(
    '/expense/{category_id}',
    response_model=CategoryDB,
    summary='Удалить категорию расходов. Только для суперюзеров.',
    description='Удаляет категорию расходов.',
    response_description='Удаленная категория расходов.',
    dependencies=[Depends(current_superuser)]
)
async def delete_expense_category(category_id: int, session: SessionDep):
    """Удаляет категорию расходов"""
    category = await check_expense_category_exists(category_id, session)
    category = await expense_category_crud.remove(category, session)
    return category


@router.post(
    '/income',
    response_model=CategoryDB,
    summary='Создать новую категорию доходов. Только для суперюзеров.',
    description='Создает новую категорию доходов.',
    response_description=('Созданная категория доходов с присвоенным ID '
                          'и другими полями.'),
    dependencies=[Depends(current_superuser)]
)
async def create_income_category(
    obj_in: CategoryCreate,
    session: SessionDep
):
    """Создает новую категорию доходов."""
    await check_income_category_name_duplicate(obj_in.name, session)
    new_category = await income_category_crud.create(obj_in, session)
    return new_category


@router.get(
    '/income',
    response_model=list[CategoryDB],
    summary='Получить все категории доходов.',
    description='Возвращает список всех категорий доходов.',
    response_description='Список всех категорий доходов.'
)
async def get_income_category(session: SessionDep):
    """Возвращает список всех категорий доходов"""
    all_categories = await income_category_crud.get_multi(session)
    return all_categories


@router.patch(
    '/income/{category_id}',
    response_model=CategoryDB,
    summary='Обновить категорию доходов. Только для суперюзеров.',
    description='Обновляет информацию о существующей категории доходов.',
    response_description='Обновленная категория доходов.',
    dependencies=[Depends(current_superuser)]
)
async def update_income_category(
    category_id: int, obj_in: CategoryUpdate, session: SessionDep
):
    """Обновляет информацию о существующей категории доходов."""
    category = await check_income_category_exists(category_id, session)
    if obj_in.name is not None:
        await check_income_category_name_duplicate(obj_in.name, session)
    category = await income_category_crud.update(
        db_obj=category, obj_in=obj_in, session=session
    )
    return category


@router.delete(
    '/income/{category_id}',
    response_model=CategoryDB,
    summary='Удалить категорию доходов. Только для суперюзеров.',
    description='Удаляет категорию доходов.',
    response_description='Удаленная категория доходов.',
    dependencies=[Depends(current_superuser)]
)
async def delete_income_category(category_id:int, session:SessionDep):
    """Удаляет категорию доходов"""
    category = await check_income_category_exists(category_id, session)
    category = await income_category_crud.remove(category, session)
    return category
