FROM python:3.12-slim

# Отключаем pyc + буферизацию логов
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Рабочая папка
WORKDIR /app

# Копируем зависимости
COPY requirements.txt .

RUN python -m pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Копируем проект
COPY . .

# Запуск
CMD ["sh", "entrypoint.sh"]
