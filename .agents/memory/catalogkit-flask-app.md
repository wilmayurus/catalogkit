---
name: CatalogKit is a Flask app, not the pnpm monorepo product
description: Where the real CatalogKit product lives and how it differs from the workspace's default pnpm/artifacts scaffolding.
---

CatalogKit's actual product code lives in `flask-app/` (Flask + SQLAlchemy + Jinja templates, deployed on Render with Supabase Postgres). It runs via the `Start application` workflow (`pip install -r flask-app/requirements.txt -q && python main.py`).

The `pnpm-workspace` / `artifacts/*` scaffolding present in this repl (api-server, demo-video, mockup-sandbox) is unrelated infra left over from the default template — it is not part of the shipped product and should not be assumed to contain CatalogKit's routes or models.

**Why:** the top-level `replit.md` template text originally described a pnpm/Express/Drizzle stack that doesn't match reality; easy to be misled into looking in the wrong place.

**How to apply:**
- All CatalogKit models/routes/logic: read `flask-app/main.py` directly.
- Templates: `flask-app/templates/*.html` (vendor pages extend `base.html`, admin pages extend `admin_base.html`).
- DB tables are created via `db.create_all()` at startup — no manual SQL migration step needed for new models.
- The `screenshot` tool's `app_preview` mode only works for registered artifacts (api-server, demo-video, mockup-sandbox) — it does NOT work for `flask-app` since it isn't registered as an artifact. To verify flask-app UI/behavior, use `curl localhost:80/<path>` (shared proxy) or a Flask `test_client()` script with a forged session (`sess['user_id'] = <id>`) instead of the screenshot tool.
- Wilma pushes to GitHub manually via the Shell tab (`git push origin main`); do not attempt `git push` from bash tool calls, it times out in this environment.
