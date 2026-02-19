from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.models.category import (
    MAX_LENGTH_NAME, MAX_LENGTH_COLOR, MAX_LENGTH_ICON)

PATTERN_COLOR = '^#[0-9A-Fa-f]{6}$'
CATEGORY_DESCRIPTIONS: dict[str, str] = {
    'Продукты и хозтовары': 'Ежедневные покупки продуктов и товаров для дома',
    'Здоровье и красота': 'Инвестиции в здоровье и внешний вид',
    'Образование': 'Развитие навыков и получение новых знаний',
    'Развлечения': 'Отдых и развлекательные мероприятия',
    'Туризм и путешествия': 'Расходы на отдых и познание мира',
    'Квартплата': 'Обязательные платежи за жилье',
    'Интернет и связь': 'Связь с миром и доступ к информации',
    'Аренда жилья': 'Основные расходы на проживание',
    'Непредвиденное, ремонт': 'Траты на решение внезапных проблем',
    'Одежда, товары': 'Покупка необходимых вещей и обновление гардероба',
    'Цифровые покупки': 'Инвестиции в цифровой контент и сервисы',
    'Автомобиль': 'Содержание и эксплуатация транспортного средства',
    'Кредиты': 'Финансовые обязательства перед банками',
    'Крупные траты': 'Значительные инвестиции в качество жизни',
    'Чрезмерное потребление': 'Траты, которые можно было избежать'
}


class ExpenseCategoryBase(BaseModel):
    """Базовая схема с общими полями"""
    name: str = Field(
        max_length=MAX_LENGTH_NAME, examples=list(CATEGORY_DESCRIPTIONS.keys())
    )
    description: Optional[str] = Field(
        default=None, examples=list(CATEGORY_DESCRIPTIONS.values())
    )
    color: Optional[str] = Field(
        None, max_length=MAX_LENGTH_COLOR, pattern=PATTERN_COLOR
    )
    icon: Optional[str] = Field(None, max_length=MAX_LENGTH_ICON)

    model_config = ConfigDict(extra='forbid')


class ExpenseCategoryCreate(ExpenseCategoryBase):
    pass


class ExpenseCategoryUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=MAX_LENGTH_NAME)
    description: Optional[str] = None
    color: Optional[str] = Field(None, pattern=PATTERN_COLOR)
    icon: Optional[str] = Field(None, max_length=MAX_LENGTH_ICON)

    model_config = ConfigDict(extra='forbid')


class ExpenseCategoryDB(ExpenseCategoryBase):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)
