#!/bin/sh
set -e
cd /var/www/html

# Render gives the port in $PORT (default 10000). Make Apache listen on it.
PORT="${PORT:-80}"
sed -i -E "s/^Listen [0-9]+$/Listen ${PORT}/" /etc/apache2/ports.conf
sed -i -E "s/<VirtualHost \*:[0-9]+>/<VirtualHost *:${PORT}>/" /etc/apache2/sites-available/000-default.conf

# Public link for admin-uploaded images (only matters when FILESYSTEM_DISK=public)
php artisan storage:link >/dev/null 2>&1 || true

# Migrations use the DIRECT Neon URL when provided (pooled URL is used by the app itself)
DB_URL="${DB_URL_DIRECT:-$DB_URL}" php artisan migrate --force

# Seeds the admin account + sample content. Idempotent. Set RUN_SEED=false after the first deploy.
if [ "$RUN_SEED" = "true" ]; then
    DB_URL="${DB_URL_DIRECT:-$DB_URL}" php artisan db:seed --force
fi

php artisan config:cache
php artisan route:cache

chown -R www-data:www-data storage bootstrap/cache
exec apache2-foreground
