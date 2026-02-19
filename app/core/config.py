from typing import Optional

from pydantic_settings import BaseSettings, SettingsConfigDict

TITLE = 'Сервис учета расходов и доходов'
DESCRIPTION = 'Описание'


class Settings(BaseSettings):
    app_title: str = TITLE
    description: str = DESCRIPTION
    database_url: str = 'sqlite+aiosqlite:///./fastapi.db'
    secret: str = 'SECRET'
    first_superuser_email: Optional[str] = None
    first_superuser_password: Optional[str] = None

    model_config = SettingsConfigDict(env_file='.env')


settings = Settings()
