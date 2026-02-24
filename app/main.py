from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routers import main_router
from app.core.config import settings
from app.core.init_db import create_first_superuser

origins = [
    'http://localhost:8088',
    'http://localhost:5173',          # dev (Vite)
    'http://localhost:3000',          # dev (CRA)
    'https://moneykeep.ppavel.pro',      # production
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_first_superuser()
    yield


app = FastAPI(
    title=settings.app_title,
    description=settings.description,
    lifespan=lifespan,
    openapi_prefix='/api'
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)
app.include_router(main_router, prefix='/api')
