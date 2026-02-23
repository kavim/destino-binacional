#!/bin/bash
set -e
cd /var/www

if [ ! -f .env ]; then
  cp .env.example .env
fi

if [ ! -f vendor/autoload.php ]; then
  composer install --no-interaction --prefer-dist
fi

if ! grep -q '^APP_KEY=.\+' .env 2>/dev/null; then
  php artisan key:generate --no-interaction
fi

exec "$@"
