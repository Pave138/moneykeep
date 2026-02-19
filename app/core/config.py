from pydantic_settings import BaseSettings, SettingsConfigDict

TITLE = ''
DESCRIPTION = ''


class Settings(BaseSettings):
    app_title: str = TITLE
    description: str = DESCRIPTION
    database_url: str = 'sqlite+aiosqlite:///./fastapi.db'
    secret: str = 'SECRET'

    model_config = SettingsConfigDict(env_file='.env')


settings = Settings()
