git clone https://github.com/your-username/your-repository.git
cd your-repository
composer install
npm install
cp .env.example .env
php artisan key:generate

#set-up database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password

php artisan migrate
php artisan db:seed
php artisan serve


