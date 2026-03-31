# ENCAR Cars Demo

Тестовое задание: парсинг ENCAR + landing page c автомобилями.

## Что внутри

- **backend**: FastAPI + SQLAlchemy + Alembic + Playwright + BeautifulSoup
- **frontend**: Next.js + TypeScript + Tailwind CSS + TanStack Query
- **db**: PostgreSQL
- **scheduler**: ежедневный импорт автомобилей 1 раз в сутки через APScheduler
- **docker-compose**: локальный запуск всего проекта одной командой

## Возможности

- парсинг автомобилей с ENCAR
- сохранение в PostgreSQL
- upsert по `source_id`
- REST API для списка автомобилей и карточки автомобиля
- современный адаптивный landing page
- ручной запуск парсинга
- автоматический ежедневный запуск парсинга

## Как это работает

1. Скрейпер открывает `https://car.encar.com/` через Playwright.
2. Забирает ссылки на карточки автомобилей.
3. Переходит в детальные страницы `https://fem.encar.com/cars/detail/{id}`.
4. Собирает:
   - марку
   - модель
   - год
   - пробег
   - цену
   - фото
5. Данные сохраняются в PostgreSQL.
6. Frontend показывает карточки автомобилей через API.

## Почему так

Для тестового задания этого достаточно, чтобы показать:
- работу с динамическим сайтом
- чистую серверную архитектуру
- хранение данных в БД
- API + frontend
- ежедневное обновление

## Структура проекта

```text
encar-test-task/
├── backend/
├── frontend/
├── infra/
│   └── docker-compose.yml
└── .github/
    └── workflows/
```

## Быстрый старт

### 1. Скопировать env
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

### 2. Запустить проект
```bash
docker compose -f infra/docker-compose.yml up --build
```

### 3. Применить миграции
```bash
docker compose -f infra/docker-compose.yml exec backend alembic upgrade head
```

### 4. Запустить первый импорт
```bash
curl -X POST http://localhost:8000/api/admin/scrape   -H "X-Admin-Token: local-admin-token"
```

### 5. Открыть
- Frontend: http://localhost:3000
- API docs: http://localhost:8000/docs

## Ежедневное обновление

В проекте есть отдельный сервис `scheduler`, который:
- стартует вместе с docker compose
- запускает импорт сразу после старта
- затем повторяет его каждые 24 часа

Это закрывает требование "обновление 1 раз в сутки".

## API

### `GET /api/cars`
Параметры:
- `page`
- `page_size`
- `brand`
- `query`

### `GET /api/cars/{car_id}`
Возвращает одну карточку.

### `GET /api/admin/scrape-status`
Статус последнего запуска импорта.

### `POST /api/admin/scrape`
Ручной запуск импорта.
Требует заголовок:
```text
X-Admin-Token: local-admin-token
```

## Замечания по ENCAR

Сайт может менять HTML-структуру и антибот-логику. Поэтому парсер сделан с:
- Playwright для рендера
- BeautifulSoup для извлечения данных
- несколькими fallback-стратегиями по селекторам и regex

При необходимости можно быстро поправить логику в:
```text
backend/app/services/encar_scraper.py
```

## Demo data

Если ENCAR временно недоступен или нужен быстрый демо-запуск:
```bash
docker compose -f infra/docker-compose.yml exec backend python -m app.seed_demo
```

## Что можно улучшить дальше

- пагинация прямо на стороне ENCAR
- фильтры по бренду / году / цене
- S3 / MinIO для хранения локальных копий фото
- CI/CD деплой
- Nginx reverse proxy
- observability / metrics
- тесты на парсер и API

## Команды для локальной разработки без Docker

### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
playwright install chromium
alembic upgrade head
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```


