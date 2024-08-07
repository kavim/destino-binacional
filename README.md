<p align="center"><a href="https://destinobinacional.com" target="_blank"><img src="https://raw.githubusercontent.com/kavim/destino-binacional/dc1321af8503d9e0ee1fba361e05ca2d70498a72/public/images/logotipo-color.svg" width="400" alt="Destino Binacional Logo"></a></p>

## About
There is so much to explore!
**Rivera and Santana do Livramento** are twin cities united by just one street, with extraordinary natural, heritage, and cultural wealth and a privileged geographical location. Our wealth is present in the squares, museums, captivating landscapes, hills framing the border location that allow it to be appreciated from various angles, and a varied gastronomic offer, hotels, and casinos.

This system was created to promote and share the rich cultural, natural, and historical heritage of Rivera and Santana do Livramento. By providing comprehensive information and resources, we aim to enhance tourism, support local businesses, and foster a deeper appreciation for the unique charm and beauty of these twin cities. Whether you are planning a visit or simply curious about our region, this platform serves as your gateway to discovering all that Rivera and Santana do Livramento have to offer.

## Getting Started
This is a Laravel project, so you need to have PHP and Composer installed on your machine (or just use Docker). You can find more information about Laravel installation [here](https://laravel.com/docs/11.x/installation).

### Installation
1. Clone the repository
```bash
git clone git@github.com:kavim/destino-binacional.git
```

2. Install dependencies
```bash
composer install
```

3. Create a `.env` file
```bash
cp .env.example .env
```

4. Generate an application key
```bash
php artisan key:generate
```

5. Create a database and set the connection in the `.env` file
```bash
DB_CONNECTION=mysql
DB_HOST=
DB_PORT=
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=
```

6. Run the migrations
```bash
php artisan migrate
```

7. Run the seeders
```bash
php artisan db:seed
```

8. Serve the application
```bash
php artisan serve
```

9. Tracker it is by default disabled, to enable it you need to set the `TRACKER_ENABLED` variable to `true` in the `.env` file.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
