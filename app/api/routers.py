from fastapi import APIRouter

from app.api.endpoints import (
    category_router, expense_router, income_router)
from app.api.endpoints.user import users_router
from app.core.user import auth_backend, fastapi_users
from app.schemas.user import UserCreate, UserRead

AUTH_TAG = 'auth'

main_router = APIRouter()
main_router.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix='/auth/jwt',
    tags=[AUTH_TAG]
)
main_router.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix='/auth',
    tags=[AUTH_TAG]
)
main_router.include_router(
    users_router,
    prefix='/users',
    tags=['users']
)
main_router.include_router(
    category_router, prefix='/category', tags=['Категории']
)
main_router.include_router(
    expense_router, prefix='/expense', tags=['Расходы']
)
main_router.include_router(
    income_router, prefix='/income', tags=['Доходы']
)
