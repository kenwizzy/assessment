# Todo App - Laravel + React + Docker

A Todo application with drag-and-drop, built with Laravel 13 and React 19.

## How to Run with Docker

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/todo-app.git
cd todo-app

# 2. inside backend directory, copy .env.example to .env
first cd backend, then cp .env.example .env

# 3. inside frontend directory, copy .env.example to .env
first cd frontend, then cp .env.example .env


# 4. Start the application
docker-compose up --build

# 5. Run migrations (in another terminal)
docker-compose exec backend php artisan migrate

#6 Access
Visit http://localhost:5173/ to access the application