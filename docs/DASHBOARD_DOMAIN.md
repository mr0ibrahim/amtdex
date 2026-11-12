# Dashboard domain

The public site and the dashboard are the same Laravel app on two hosts. Visitors never see a link to the dashboard. On the public host, `/dashboard`, `/login`, and the admin APIs answer **404**. They are not redirected.

## Environment

```env
DASHBOARD_DOMAIN=admin.example.com
DASHBOARD_SESSION_COOKIE=amtdex_dashboard_session
SESSION_DOMAIN=null
SANCTUM_STATEFUL_DOMAINS=example.com,admin.example.com
```

`DASHBOARD_DOMAIN` is the host only, without a scheme or port. Locally the default is `admin.localhost`. Add it to your hosts file:

```
127.0.0.1 admin.localhost
```

Then open `http://admin.localhost:8000/login`. The public site stays on `http://127.0.0.1:8000` (or whatever `APP_URL` is).

The dashboard session cookie name is separate from the public site cookie, and its domain is the dashboard host only. A login on the dashboard is not sent to the public host.

## DNS and Hostinger

1. In hPanel → DNS, add an **A** record for `admin` pointing at the same server as the public site. Do not turn on a redirect from `admin` to the apex.
2. Attach `admin.example.com` to the same website so both hosts reach this app. Install SSL for the subdomain.
3. Set `DASHBOARD_DOMAIN=admin.example.com` in the site’s environment variables, include that host in `SANCTUM_STATEFUL_DOMAINS`, and keep `SESSION_DOMAIN` empty.
4. If you cache routes (`php artisan route:cache`), rebuild the cache after changing `DASHBOARD_DOMAIN`.
5. The dashboard host sends `X-Robots-Tag: noindex, nofollow` and a robots meta tag. Do not submit the admin host in Search Console.

## What stays on the public host

Marketing pages, the public CMS payload, contact and quote forms, and the public blog APIs. A page hidden in **الموقع** is omitted from navigation and returns HTTP 404 for its HTML route and its public API.
