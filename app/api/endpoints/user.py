from fastapi import APIRouter

from app.core.user import fastapi_users
from app.schemas.user import UserRead, UserUpdate

router = APIRouter()

users_router = fastapi_users.get_users_router(UserRead, UserUpdate)
users_router.routes = [
    route for route in users_router.routes if route.name != 'users:delete_user'
]
