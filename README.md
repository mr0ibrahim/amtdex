# AMTDEX

Arabic RTL marketing website, blog and staff dashboard using React, TypeScript, Vite and Laravel.

## Development

Use PHP and Composer versions compatible with `composer.json`, Node.js compatible with `package.json`, and a configured database. Copy `.env.example` to `.env`, configure the application/database/domain settings, then run:

```sh
composer install
php artisan key:generate
php artisan migrate
npm ci
```

Run Laravel (`php artisan serve`) and the frontend development server (`npm run dev`) in separate terminals. Create staff accounts through the application's server-side administration workflow; the browser has no offline demo login.

## Checks

```sh
npm run check
npm test
npm run build
```

Run the Laravel test suite in a PHP-enabled environment. Tests should use a separate test database; do not point test configuration at production data.

## Layout

- `resources/js/pages/`: public and dashboard screens.
- `resources/js/routing/`: routing, lifecycle, staff page metadata and navigation permissions.
- `resources/js/lib/queries/`: domain-specific data queries and mutations.
- `app/Http/Controllers/Api/V1/`: authenticated and public APIs.
- `resources/views/app.blade.php`: application shell.
- `tests/`: frontend and Laravel regressions.

Public and administrative content collections are separate. Frontend role checks organize the interface; Laravel middleware enforces access.

See [docs/REFACTOR.md](docs/REFACTOR.md) for the refactor boundaries, removed legacy code, verification and deployment requirements. Deploy the Laravel source and freshly built frontend together.
