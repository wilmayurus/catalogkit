# CatalogKit

Free web app for PNG market vendors and SMEs to create digital product catalogs (flipbook viewer + PDF download) and share them on WhatsApp.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- The live product is the Flask app in `flask-app/` (not the pnpm workspace artifacts) — `flask-app/main.py` holds all models, routes, and helpers; `flask-app/templates/` holds Jinja templates; `flask-app/static/css/style.css` holds styles.
- Admin-only pages extend `admin_base.html` (sidebar nav); vendor-facing pages extend `base.html` (top nav + footer).
- DB tables are created via `db.create_all()` at startup — no manual migration files.

## Architecture decisions

- Admin tooling (audit log, bulk announcements, support inbox, Excel export) lives entirely in `flask-app/main.py` + matching templates — see `AdminAuditLog`, `SupportTicket`, `SupportMessage` models and `log_admin_action()` / `build_xlsx_response()` helpers.
- Bulk announcement emails are sent synchronously in a loop — fine at current PNG vendor scale; would need a background job if the user base grows into the thousands.
- Accessibility: a persistent "Aa" toggle (top nav) switches a `.a11y-mode` class on `<html>`, stored in `localStorage` (`catalogkit-a11y-mode`), giving larger text/line-height, bigger buttons/inputs, and reduced motion — targeted at vendors with dyslexia/learning disabilities.

## Product

- Vendors sign up, build a digital flipbook + PDF catalog of their products, and share it via WhatsApp link.
- Vendor-facing help: `/support` (ticket-based help desk) and `/contact` (WhatsApp + FAQ).
- Admin tools: `/admin/audit-log` (accountability trail of admin actions), `/admin/announcements` (bulk email by plan audience), `/admin/support` (reply to vendor tickets), `/admin/export/users.xlsx` and `/admin/export/finance.xlsx` (Excel exports, also linked from Reports).

## User preferences

- **User:** Wilma Yurus — she built CatalogKit under **Sapphire Consulting Services**, a subsidiary of Trey Holdings Limited, Port Moresby, PNG. The grant application is submitted under Trey Holdings Limited as the legal entity. Wilma is the developer and project lead.
- Address her by first name: Wilma.
- The app runs on Render (catalogkit.onrender.com / www.catalogkit.org) using Flask + Supabase. GitHub repo: wilmayurus/catalogkit. She pushes code via the Shell tab (`git push origin main`) — git push from bash times out.

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
