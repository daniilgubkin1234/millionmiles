# ENCAR Cars Demo

Тестовое задание: парсинг ENCAR + landing page c автомобилями.

## Важное допущение по тестовому

В рамках тестового задания основной фокус был сделан на **рабочем каталоге, парсинге, API и базовом UX лендинга**.

Поэтому ссылки на внешние соцсети, а также второстепенные разделы вроде:

- `/find-car`
- `/sell-car`
- `/insurance`
- `/lease-a-car`
- `/import-and-export`
- `/logistic`
- `/registration`
- `/detailing`
- `/philosophy`
- `/career`
- `/dealer`
- `/contacts`

не являются частью обязательного функционала тестового задания и в текущей реализации рассматриваются как **элементы визуального повторения структуры референса**, а не как полноценные продуктовые страницы.

Иными словами: **реализован именно тот объём, который нужен для демонстрации навыков по fullstack-разработке, интеграции данных и сборке работающего пользовательского сценария**.

## Что внутри

- **backend**: FastAPI + SQLAlchemy + Alembic + Playwright + BeautifulSoup
- **frontend**: Next.js + TypeScript + Tailwind CSS + TanStack Query
- **db**: PostgreSQL
- **scheduler**: ежедневный импорт автомобилей 1 раз в сутки через APScheduler
- **docker-compose**: локальный запуск всего проекта одной командой

## Основной пользовательский сценарий

1. Пользователь открывает landing page.
2. Видит hero-блок и фильтр быстрого подбора автомобиля.
3. Переходит в каталог с уже применёнными параметрами поиска.
4. Получает список автомобилей, загруженных парсером.
5. Может уточнять фильтры по:
   - марке;
   - модели;
   - году;
   - цене.
6. Может перейти к карточке автомобиля на источнике ENCAR.
   
## Стек

### Frontend
- Next.js 15
- TypeScript
- Tailwind CSS
- TanStack Query

### Backend
- FastAPI
- SQLAlchemy
- Alembic
- Playwright
- BeautifulSoup
- APScheduler

### Infrastructure
- PostgreSQL
- Docker
- Docker Compose

## Архитектура

Проект разделён на 3 логические части:

- `frontend` — пользовательский интерфейс и каталог;
- `backend` — API, бизнес-логика, парсер и планировщик;
- `infra` — orchestration через Docker Compose.
## Реализованный функционал

### Backend
- парсинг списка автомобилей и детальных карточек;
- сохранение данных в PostgreSQL;
- upsert по `source_id`;
- REST API для списка автомобилей;
- REST API для одной карточки;
- REST API для набора фильтров;
- защищённый ручной запуск парсинга через admin token;
- endpoint для проверки статуса последнего запуска;
- ежедневный автозапуск парсинга.

### Frontend
- адаптивный landing page;
- hero section;
- быстрый фильтр на главной;
- отдельная страница каталога;
- карточки автомобилей;
- фильтрация по параметрам;
- отображение количества найденных автомобилей;
- адаптация под мобильные и desktop-экраны.

## Структура проекта

```text
.
├── backend/
│   ├── app/
│   ├── alembic/
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   └── Dockerfile
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


