# Dashboard domain

By default the dashboard and the login page live on the same host as the public site. `/dashboard` and `/login` are not linked from the public header, mobile menu, or footer. They stay out of the sitemap, and their responses send `noindex`.

## Same host

Leave `DASHBOARD_DOMAIN` empty:

```env
DASHBOARD_DOMAIN=
```

Open `https://example.com/login`. A `*.localhost` value, such as `admin.localhost`, is also ignored when `APP_ENV=production`, so a local default cannot hide the dashboard on the live site.

## Separate host, later

Set a real hostname to turn isolation back on. The public host then answers `/dashboard`, `/login`, and the admin APIs with **404** (not a redirect).

```env
DASHBOARD_DOMAIN=admin.example.com
DASHBOARD_SESSION_COOKIE=amtdex_dashboard_session
SESSION_DOMAIN=null
SANCTUM_STATEFUL_DOMAINS=example.com,admin.example.com
```

`DASHBOARD_DOMAIN` is the host only, without a scheme or port. The dashboard session cookie is separate and is limited to that host.

### DNS and Hostinger

1. In hPanel → DNS, add an **A** record for `admin` pointing at the same server as the public site. Do not redirect `admin` to the apex.
2. Attach `admin.example.com` to the same website and install SSL for it.
3. Set `DASHBOARD_DOMAIN=admin.example.com`, add that host to `SANCTUM_STATEFUL_DOMAINS`, and keep `SESSION_DOMAIN` empty.
4. Rebuild `php artisan route:cache` after changing the domain.
5. The dashboard host sends `X-Robots-Tag: noindex, nofollow`. Do not submit it in Search Console.

## Local check

With `DASHBOARD_DOMAIN` empty, `http://127.0.0.1:8000/login` opens the dashboard login. To try isolation locally, set `DASHBOARD_DOMAIN=admin.localhost`, add `127.0.0.1 admin.localhost` to your hosts file, and open `http://admin.localhost:8000/login`.
