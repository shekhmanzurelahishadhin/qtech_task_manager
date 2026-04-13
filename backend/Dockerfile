FROM php:8.2-cli

RUN apt-get update && apt-get install -y \
    git unzip zip curl libpng-dev libonig-dev libxml2-dev

RUN docker-php-ext-install pdo pdo_mysql

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

# 🔥 IMPORTANT: copy ONLY backend contents (because Render uses backend as context)
COPY . .

RUN ls -la

RUN composer install --no-interaction --prefer-dist

EXPOSE 10000

CMD php artisan serve --host=0.0.0.0 --port=10000