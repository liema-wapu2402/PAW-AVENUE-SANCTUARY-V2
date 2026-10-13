# Paw Avenue Sanctuary — Backend (Laravel 12 API + PostgreSQL)

JSON API only. Authentication uses Laravel Sanctum bearer tokens (admin panel).

## Setup
```bash
composer install
cp .env.example .env          # set DB_* for your PostgreSQL server
php artisan key:generate
php artisan migrate --seed    # creates tables, dashboard function, admin + sample content
php artisan storage:link      # serves admin-uploaded images
php artisan serve             # http://localhost:8000
```
Create the database first: `createdb paw_avenue` (or via pgAdmin).

Admin login comes from `.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`) — change before deploying.
