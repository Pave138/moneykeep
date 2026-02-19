from fastapi import APIRouter, Depends

from app.api.validators import (
    check_category_exists, check_category_name_duplicate)
from app.core.db import SessionDep
from app.core.user import current_superuser
from app.crud.category import category_crud
from app.schemas.category import (
    ExpenseCategoryCreate, ExpenseCategoryDB, ExpenseCategoryUpdate
)

router = APIRouter()


@router.post(
    '/',
    response_model=ExpenseCategoryDB,
    summary='Создать новую категорию расходов. Только для суперюзеров.',
    description='Создает новую категорию расходов.',
    response_description=('Созданная категория расходов с присвоенным ID '
                          'и другими полями.'),
    dependencies=[Depends(current_superuser)]
)
async def create_expense_category(
    obj_in: ExpenseCategoryCreate,
    session: SessionDep
):
    """Создает новую категорию расходов."""
    await check_category_name_duplicate(obj_in.name, session)
    new_category = await category_crud.create(obj_in, session)
    return new_category


@router.get(
    '/',
    response_model=list[ExpenseCategoryDB],
    summary='Получить все категории расходов.',
    description='Возвращает список всех категорий расходов.',
    response_description='Список всех категорий расходов.'
)
async def get_expense_category(session: SessionDep):
    """Возвращает список всех категорий расходов"""
    all_categories = await category_crud.get_multi(session)
    return all_categories


@router.patch(
    '/{category_id}',
    response_model=ExpenseCategoryDB,
    summary='Обновить категорию расходов. Только для суперюзеров.',
    description='Обновляет информацию о существующей категории расходов.',
    response_description='Обновленная категория расходов.',
    dependencies=[Depends(current_superuser)]
)
async def update_category(
    category_id: int, obj_in: ExpenseCategoryUpdate, session: SessionDep
):
    """Обновляет информацию о существующей категории расходов."""
    category = await check_category_exists(category_id, session)
    if obj_in.name is not None:
        await check_category_name_duplicate(obj_in.name, session)
    category = await category_crud.update(
        db_obj=category, obj_in=obj_in, session=session
    )
    return category


@router.delete(
    '/{category_id}',
    response_model=ExpenseCategoryDB,
    summary='Удалить категорию расходов. Только для суперюзеров.',
    description='Удаляет категорию расходов.',
    response_description='Удаленная категория расходов.',
    dependencies=[Depends(current_superuser)]
)
async def delete_category(category_id, session):
    """Удаляет категорию расходов"""
    category = await check_category_exists(category_id, session)
    category = await category_crud.remove(category, session)
    return category
