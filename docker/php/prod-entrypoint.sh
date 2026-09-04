#!/bin/sh
set -e
cd /var/www

cp -r /var/www/public_dist/. /var/www/public/
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache /var/www/public 2>/dev/null || true

exec "$@"
