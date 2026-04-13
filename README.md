# Task Management Syste

A clean, scalable, production-ready Task Management System built with **Laravel 11** (REST API) and **React 18** (TypeScript + Tailwind CSS).

---
## Live Link

- **Base API URL:**  
  <a href="https://qtech-task-manager-v1.onrender.com/api/v1" target="_blank">https://qtech-task-manager-v1.onrender.com/api/v1</a>

- **Task List API:**  
  <a href="https://qtech-task-manager-v1.onrender.com/api/v1/tasks" target="_blank">https://qtech-task-manager-v1.onrender.com/api/v1/tasks</a>

- **Frontend:**  
  <a href="https://qtechtaskmanagerfrontend.vercel.app/" target="_blank">https://qtechtaskmanagerfrontend.vercel.app/</a>

- **Content-Type:** `application/json`

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup — Backend](#setup--backend-laravel)
- [Setup — Frontend](#setup--frontend-react)
- [API Endpoints](#api-endpoints)
- [Running Tests](#running-tests)
- [Architecture & Decisions](#architecture--decisions)
- [Assumptions](#assumptions)
- [Deployment](#deployment)

---

## Tech Stack

| Layer      | Technology                                    |
|------------|-----------------------------------------------|
| Backend    | PHP 8.2+, Laravel 11, SQLite / MySQL          |
| Frontend   | React 18, TypeScript, Vite, Tailwind CSS      |
| HTTP Client| Axios                                         |
| Testing BE | PHPUnit 11 (Feature + Unit)                   |
| Testing FE | Vitest + React Testing Library                |
| Toasts     | react-hot-toast                               |

---

## Project Structure

```
task-management/
├── backend/                          # Laravel REST API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   └── TaskController.php        # CRUD endpoints
│   │   │   ├── Requests/
│   │   │   │   ├── StoreTaskRequest.php      # Create validation
│   │   │   │   └── UpdateTaskRequest.php     # Update validation
│   │   │   └── Resources/
│   │   │       └── TaskResource.php          # API transformer
│   │   ├── Models/
│   │   │   └── Task.php                      # Eloquent model
│   │   └── Services/
│   │       └── TaskService.php               # Business logic
│   ├── database/
│   │   ├── migrations/
│   │   │   └── ..._create_tasks_table.php
│   │   └── factories/
│   │       └── TaskFactory.php
│   ├── routes/
│   │   └── api.php
│   └── tests/
│       ├── Feature/
│       │   └── TaskApiTest.php               # Full API CRUD tests
│       └── Unit/
│           └── TaskServiceTest.php           # Service logic tests
│
└── frontend/                         # React TypeScript SPA
    └── src/
        ├── components/
        │   ├── EmptyState.tsx
        │   ├── LoadingSkeleton.tsx
        │   ├── StatusBadge.tsx
        │   ├── TaskCard.tsx
        │   └── TaskForm.tsx
        ├── hooks/
        │   └── useTasks.ts                   # All task state & operations
        ├── pages/
        │   └── TasksPage.tsx                 # Main page
        ├── services/
        │   └── taskService.ts               # Axios API layer
        ├── types/
        │   └── index.ts                      # TypeScript interfaces
        ├── utils/
        │   └── index.ts                      # Helpers & constants
        └── __tests__/
            ├── components.test.tsx
            └── utils.test.ts
```

---

## Setup — Backend (Laravel)

### Prerequisites
- PHP 8.2+
- Composer
- SQLite (default, zero-config) **or** MySQL/PostgreSQL

### Steps

```bash
# 1. Enter backend directory
cd task-management/backend

# 2. Install dependencies
composer install

# 3. Copy environment file
cp .env.example .env

# 4. Generate application key
php artisan key:generate

# 5a. SQLite (easiest, default)
touch database/database.sqlite
# Make sure DB_CONNECTION=sqlite in .env

# 5b. MySQL (optional)
#   Edit .env → set DB_CONNECTION=mysql + credentials

# 6. Run migrations
php artisan migrate

# 7. (Optional) Seed with sample data
php artisan db:seed

# 8. Start the development server
php artisan serve
# → API available at http://localhost:8000/api/v1
```

### CORS Configuration

In `config/cors.php`, ensure the `allowed_origins` includes your frontend URL:

```php
'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:5173')],
```

---

## Setup — Frontend (React)

### Prerequisites
- Node.js 18+
- npm / yarn / pnpm

### Steps

```bash
# 1. Enter frontend directory
cd task-management/frontend

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env
# Edit .env → set VITE_API_BASE_URL=http://localhost:8000

# 4. Start the dev server
npm run dev
# → App available at http://localhost:5173

# 5. Build for production
npm run build
```

---

## API Endpoints

Base URL: `http://localhost:8000/api/v1`

All responses use `Content-Type: application/json`.

### `GET /tasks`

List all tasks. Optional query param: `?status=pending|in_progress|completed`

**Response 200:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Build the API",
      "description": "Set up routes and controllers",
      "status": "in_progress",
      "status_label": "In Progress",
      "created_at": "2024-06-15T10:00:00+00:00",
      "updated_at": "2024-06-15T11:00:00+00:00"
    }
  ],
  "stats": {
    "pending": 3,
    "in_progress": 1,
    "completed": 5,
    "total": 9
  },
  "meta": {
    "total": 1,
    "filter": "in_progress"
  }
}
```

---

### `POST /tasks`

Create a new task.

**Request body:**
```json
{
  "title": "Write tests",
  "description": "PHPUnit feature and unit tests",
  "status": "pending"
}
```

| Field         | Type   | Required | Notes                                    |
|---------------|--------|----------|------------------------------------------|
| `title`       | string | ✅       | Max 255 characters                       |
| `description` | string | ❌       | Max 5000 characters, nullable            |
| `status`      | enum   | ❌       | `pending` (default), `in_progress`, `completed` |

**Response 201:**
```json
{
  "message": "Task created successfully.",
  "data": { ...task }
}
```

---

### `GET /tasks/{id}`

Get a single task.

**Response 200:** `{ "data": { ...task } }`  
**Response 404:** `{ "message": "No query results for model [Task]." }`

---

### `PUT /PATCH /tasks/{id}`

Update a task. All fields are optional (PATCH semantics).

**Request body:** (any subset of create fields)
```json
{ "status": "completed" }
```

**Response 200:** `{ "message": "Task updated successfully.", "data": { ...task } }`

---

### `DELETE /tasks/{id}`

Delete a task.

**Response 200:** `{ "message": "Task deleted successfully." }`  
**Response 404:** Task not found.

---

### Validation Error Response (422)

```json
{
  "message": "The title field is required.",
  "errors": {
    "title": ["A task title is required."]
  }
}
```

---

## Running Tests

### Backend

```bash
cd backend

# Run all tests
php artisan test

# Run feature tests only
php artisan test --testsuite=Feature

# Run unit tests only
php artisan test --testsuite=Unit

# With coverage (requires Xdebug)
php artisan test --coverage
```

**Test coverage:**
- `TaskApiTest` — 12 feature tests covering all CRUD endpoints, validation, 404 handling, and status filtering
- `TaskServiceTest` — 8 unit tests covering service methods, status filtering, ordering, and stats

### Frontend

```bash
cd frontend

# Run all tests (watch mode)
npm test

# Run once (CI mode)
npm test -- --run

# With coverage
npm test -- --coverage
```

**Test coverage:**
- `components.test.tsx` — StatusBadge rendering, TaskCard interactions (edit, delete confirmation, status advance)
- `utils.test.ts` — Relative time formatting, date formatting, config shape validation

---

## Architecture & Decisions

### Backend

**Service Layer**  
A `TaskService` class encapsulates all business logic (filtering, stats, CRUD operations) rather than putting it directly in the controller. This keeps controllers thin, makes business logic independently testable, and follows the Single Responsibility Principle.

**API Resources**  
`TaskResource` transforms Eloquent models to JSON, decoupling the database schema from the API contract. Adding `status_label` here means the frontend never needs to compute display strings itself.

**Form Request Validation**  
Dedicated `StoreTaskRequest` and `UpdateTaskRequest` classes isolate validation rules from the controller, keeping each class focused and making rules easy to modify independently.

**Route Model Binding**  
Laravel's implicit route model binding (`Task $task`) handles 404 responses automatically — no manual `findOrFail` boilerplate in controllers.

**SQLite default**  
SQLite is the default DB for zero-config local development. Simply switching `DB_CONNECTION=mysql` in `.env` targets a production MySQL database — no code changes needed.

### Frontend

**Custom Hook (`useTasks`)**  
All server state (tasks, stats, filter, loading, error) lives in a single `useTasks` hook. Pages and components stay dumb — they receive data and callbacks, never call services directly.

**Two-click Delete**  
The delete action requires a confirmation click to prevent accidental deletions. The confirm state auto-resets after 3 seconds if not confirmed, providing a safe UX without a modal.

**Quick Status Advance**  
Each card has a contextual action button (`▶ Start` → `✓ Complete` → `↺ Reopen`) allowing status progression without opening the edit form, optimising for the most common task interaction.

**Stats as filter toggles**  
The `StatsBar` doubles as a filter control — clicking a stat card filters the list to that status. This provides both information density and navigation efficiency.

---

## Assumptions

1. **No authentication** — This system is designed as a single-user or team-internal tool. Auth can be layered on with Laravel Sanctum without architectural changes.
2. **No pagination** — Task lists are fetched in full. For datasets > 500 tasks, cursor-based pagination should be added to `TaskService::getAllTasks()`.
3. **SQLite for development** — Production deployments should use MySQL or PostgreSQL.
4. **Status is an enum** — Only three statuses are supported. Adding new statuses requires a migration to update the enum column.
5. **No soft deletes** — Tasks are permanently deleted. Soft deletes (`SoftDeletes` trait) can be added to the model if a trash/restore feature is needed.
6. **Optimistic UI is not used** — All mutations wait for API confirmation before updating the UI. This prioritises data correctness over perceived speed.

---

## Deployment

### Backend — Railway / Render

```bash
# Set environment variables in dashboard:
APP_ENV=production
APP_KEY=<generated>
APP_DEBUG=false
DB_CONNECTION=mysql
DB_HOST=<host>
DB_DATABASE=<db>
DB_USERNAME=<user>
DB_PASSWORD=<pass>
FRONTEND_URL=https://your-frontend.vercel.app

# Build command:
composer install --no-dev --optimize-autoloader && php artisan migrate --force
```

### Frontend — Vercel / Netlify

```bash
# Set environment variable:
VITE_API_BASE_URL=https://your-backend.railway.app

# Build command:
npm run build

# Publish directory:
dist/
```


