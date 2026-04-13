FROM php:8.2-cli

RUN apt-get update && apt-get install -y \
    git unzip zip curl libpng-dev libonig-dev libxml2-dev

RUN docker-php-ext-install pdo pdo_mysql

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy full project
COPY . .

# Debug (optional but useful)
RUN ls -la backend

# Go into Laravel project
WORKDIR /app/backend

# Install dependencies in correct folder
RUN composer install --no-interaction --prefer-dist

EXPOSE 10000

CMD php artisan serve --host=0.0.0.0 --port=10000