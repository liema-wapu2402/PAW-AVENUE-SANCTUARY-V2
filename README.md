# Paw Avenue Sanctuary — Version 2

Laravel + React rebuild of the original static site, backed by PostgreSQL.

```
paw-avenue-v2/
├── backend/    Laravel 12 JSON API (PostgreSQL, Sanctum token auth)
└── frontend/   React 19 + Vite single-page app
```

## Two panels

| Panel | URL | Login |
|-------|-----|-------|
| **Visitor panel** — Home, About, Adopt, Veterinarians, Services, Contact, adoption application + consultation + contact forms | `/` | **None** |
| **Admin panel** — dashboard, adoption applications, consultations, messages, pets, vets, services, testimonials, news, FAQs | `/admin` | **Required** (`/admin/login`) |

## Run it

**1. Database**
```bash
createdb paw_avenue          # PostgreSQL 13+
```

**2. Backend** (PHP 8.2+, Composer)
```bash
cd backend
composer install
cp .env.example .env         # edit DB_* and ADMIN_EMAIL / ADMIN_PASSWORD
php artisan key:generate
php artisan migrate --seed   # tables + dashboard SQL function + admin user + sample content
php artisan storage:link     # makes admin-uploaded photos public
php artisan serve            # http://localhost:8000
```

**3. Frontend** (Node 20+)
```bash
cd frontend
npm install
cp .env.example .env         # VITE_API_URL=http://localhost:8000
npm run dev                  # http://localhost:5173
```

Default admin (from `backend/.env.example`): `admin@pawavenue.test` / `ChangeMe123!` — **change it** before deploying.

## How it fits together

- React talks to Laravel only through `/api/*`. Admin requests carry a Sanctum bearer token stored in `localStorage`; any 401 signs the admin out.
- Only users with `role = admin` can sign in; the public site never needs an account.
- `fn_dashboard_stats()` is a PostgreSQL function created in a migration with `DB::unprepared()`; the dashboard endpoint calls it.
- Approving an adoption application automatically marks that pet as `adopted`.
- CORS origins are set with `FRONTEND_URL` in `backend/.env` (comma-separated for several).
- Seeded photos live in `backend/public/images`; uploads from the admin panel go to `storage/app/public/uploads`.

## API summary

Public: `GET /api/home · /pets · /pets/{id} · /vets · /services · /news`, `POST /api/adoption-applications · /contact · /appointments`
Auth: `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`
Admin (token + admin role): `GET /api/admin/dashboard`, and `GET/POST/PUT/DELETE /api/admin/{pets|vets|services|testimonials|news|faqs|applications|messages|appointments}`

## Production

```bash
cd frontend && npm run build    # outputs frontend/dist — serve it as static files (SPA fallback to index.html)
```
Set `VITE_API_URL` to the public API URL before building, and `APP_ENV=production`, `APP_DEBUG=false`, `FRONTEND_URL=https://your-site` in the backend.
