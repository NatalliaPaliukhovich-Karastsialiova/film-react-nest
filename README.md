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




