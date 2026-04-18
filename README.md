# FILM!

## Установка

### PostgreSQL

Убедитесь, что PostgreSQL запущен и доступен.

### Бэкенд

Перейдите в папку backend:

`cd backend`

Установите зависимости:

`npm ci`

Создайте `.env` на основе `.env.example` и укажите:

- `DATABASE_DRIVER=postgres`
- `DATABASE_URL` (например `postgres://localhost:5432/afisha_project`)
- `DATABASE_USERNAME`
- `DATABASE_PASSWORD`

Заполните БД тестовыми данными из SQL-файлов в `backend/test`:

- `prac.init.sql`
- `prac.films.sql`
- `prac.shedules.sql`

Запустите бэкенд:

`npm run start:dev`

API будет доступен по адресу:

`http://localhost:3000/api/afisha`

### Фронтенд

Перейдите в папку frontend:

`cd ../frontend`

Установите зависимости и запустите dev-сервер:

`npm ci && npm run dev`

Приложение будет доступно на:

`http://localhost:5173`

## Docker

Скопируйте пример Docker-переменных в `.env`:

`cp .env.docker.example .env`

Запустите сборку и контейнеры:

`docker compose up -d --build`

После запуска будут доступны:

- приложение через nginx: `http://localhost`
- pgAdmin: `http://localhost:8080`

Для входа в pgAdmin используйте значения `PGADMIN_DEFAULT_EMAIL` и `PGADMIN_DEFAULT_PASSWORD` из `.env`.

Чтобы backend подключился к базе в compose-сети, используются контейнерные настройки:

- `DATABASE_DRIVER=postgres`
- `DATABASE_URL=postgres://postgres:5432/<db_name>`
- `DATABASE_USERNAME`/`DATABASE_PASSWORD` из переменных `POSTGRES_USER`/`POSTGRES_PASSWORD`

### Импорт тестовых данных

После старта контейнеров можно загрузить SQL из `backend/test` в PostgreSQL (например через pgAdmin):

- `prac.init.sql`
- `prac.films.sql`
- `prac.shedules.sql`




