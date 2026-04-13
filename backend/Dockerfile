FROM php:8.2-cli

RUN apt-get update && apt-get install -y \
    git unzip zip curl libpng-dev libonig-dev libxml2-dev

RUN docker-php-ext-install pdo pdo_mysql

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy backend (Render root = backend)
COPY . .

# 🔥 Fix Laravel required folders
RUN mkdir -p bootstrap/cache \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    && chmod -R 777 bootstrap/cache storage

# Install dependencies
RUN composer install --no-interaction --prefer-dist

# Clear caches (important for production)
RUN php artisan optimize:clear

EXPOSE 10000

# 🚀 Run migration + start server
CMD php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=10000