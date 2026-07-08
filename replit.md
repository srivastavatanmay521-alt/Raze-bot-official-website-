# RazeBot Website

Official website for RazeBot — a feature-rich Discord bot. Dark navy aesthetic with purple/blue gradient accents.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/razebot-site run dev` — run the frontend (port 18405)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, framer-motion, wouter, TanStack Query
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/razebot-site/src/pages/` — Home.tsx, Tos.tsx, Admin.tsx, not-found.tsx
- `artifacts/razebot-site/src/App.tsx` — router (/, /tos, /admin)
- `artifacts/api-server/src/routes/` — stats, commands, announcements, admin routes
- `lib/db/src/schema/` — announcements, stats_override tables
- `lib/api-spec/openapi.yaml` — API contract source of truth

## Pages

- `/` — Landing page with hero, features, commands, live stats, announcements
- `/tos` — Terms of Service (razebot.site/tos)
- `/admin` — Password-protected live-updating admin panel (auto-refreshes every 5s)

## Admin Access

- Default password: `razebot-admin-2025` (set `ADMIN_PASSWORD` env secret in production)
- Default token: `razebot-secret-token-xyz` (set `ADMIN_TOKEN` env secret in production)
- Token is stored in `localStorage` under key `razebot_admin_token`

## Architecture decisions

- Admin auth uses a simple Bearer token approach — token returned on login, stored client-side
- Stats can be overridden via the admin panel (stored in `stats_override` table)
- Admin stats page auto-refreshes via React Query `refetchInterval: 5000`
- Commands list is static (hardcoded in the route); update `artifacts/api-server/src/routes/commands.ts` to change them

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- After any `lib/*` schema or type change, run `pnpm run typecheck:libs` before checking artifact packages
- After OpenAPI spec changes, run `pnpm --filter @workspace/api-spec run codegen` before touching the frontend
- Do not use `pnpm run dev` at workspace root — use individual artifact filters
