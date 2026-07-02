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

_Populate as you build — short repo map plus pointers to the source-of-truth file for DB schema, API contracts, theme files, etc._

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

_Describe the high-level user-facing capabilities of this app once they exist._

## User preferences

- **User:** Wilma Yurus — she built CatalogKit under **Sapphire Consulting Services**, a subsidiary of Trey Holdings Limited, Port Moresby, PNG. The grant application is submitted under Trey Holdings Limited as the legal entity. Wilma is the developer and project lead.
- Address her by first name: Wilma.
- The app runs on Render (catalogkit.onrender.com / www.catalogkit.org) using Flask + Supabase. GitHub repo: wilmayurus/catalogkit. She pushes code via the Shell tab (`git push origin main`) — git push from bash times out.

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
