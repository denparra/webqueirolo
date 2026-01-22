# Repository Guidelines

## Quickstart (Que hacer primero)
1. Define env vars en `.env.local` (ver "Environment Variables").
2. `npm install`
3. `npm run dev`
4. Abre `http://localhost:3000` y `http://localhost:3000/studio`
5. Revisa rutas clave: `/vehiculos`, `/vehiculos/[slug]`, `/servicios`, `/nosotros`, `/contacto`.

Nota: En desarrollo (NODE_ENV != `production`), si faltan env vars de Sanity el frontend usa `mockVehicles` (`lib/data.ts`). En produccion, el codigo hace fail-fast (lanza error) si falta `NEXT_PUBLIC_SANITY_PROJECT_ID`.

## Guardrails
- Cambios minimos y enfocados; evita refactors masivos.
- No inventar features, rutas o integraciones fuera del codigo.
- No tocar archivos generados (`.next/`) ni modificar fuera del objetivo del ticket.
- Mantener secretos fuera del repo; usar placeholders para env vars.
- Si cambias `NEXT_PUBLIC_*` en deploy, rebuild obligatorio (build-time).

## Project Structure & Module Organization
- `app/` contains the Next.js App Router pages, layouts, and route-level UI.
- `components/` holds reusable UI components shared across pages.
- `lib/` is for helper functions, data utilities, and shared logic.
- `sanity/` contains Sanity Studio config, schema, structure, and env helpers.
- `store/` holds Zustand state (favorites, compare).
- `public/` stores static assets served at the site root (images, icons, manifest).
- `config.ts` centralizes business data (contact, SEO, brand assets).
- `claudedocs/` contains internal plans and phase logs.
- `tailwind.config.ts`, `postcss.config.js`, and `tsconfig.json` define styling and TypeScript behavior.
- `.next/` is the build output and should not be edited manually.

## Key Routes & Content Flows
Routes:
- `/` home
- `/vehiculos` listado con filtros (cliente)
- `/vehiculos/[slug]` detalle con `notFound()` si no existe
- `/servicios`, `/nosotros`, `/contacto`
- `/studio` Sanity Studio (basePath en `sanity.config.ts`)
- `/sitemap.xml` y `/robots.txt` desde `app/sitemap.ts` y `app/robots.ts`

Sanity:
- Studio usa `sanity.config.ts` + `sanity/env.ts` (env vars requeridas).
- Schema principal: `sanity/schemaTypes/vehicle.ts`.
- Frontend consulta en `lib/vehicles.ts` via GROQ y mapea a `Vehicle`.
- En desarrollo, si falla la conexion o faltan env vars, se usa `lib/data.ts` como fallback; en produccion el fetch falla con error.
- `app/sitemap.ts` usa `mockVehicles` para URLs de vehiculos (no Sanity).

## Build, Test, and Development Commands
- `npm install` installs dependencies from `package.json` and `package-lock.json`.
- `npm run dev` starts the local Next.js dev server with hot reloading.
- `npm run build` creates an optimized production build in `.next/`.
- `npm run start` serves the production build locally.
- `npm run lint` runs the Next.js ESLint rules.
- `npm run test` runs Jest (smoke tests).

## Environment Variables
Required for Studio and real data:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`

Optional:
- `NEXT_PUBLIC_SANITY_API_VERSION` (default in `sanity/env-utils.ts`)
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` (enables GA4)

Example `.env.local` (placeholders, no quotes):
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Notes:
- `NEXT_PUBLIC_*` is build-time; changes require a rebuild in deploy.
- Avoid quoted env values; VPS setups with quotes can break Sanity config (see `lib/sanity.ts` cleanEnvVar).

## Coding Style & Naming Conventions
- Use TypeScript/TSX and follow existing file naming (`PascalCase` for React components, `kebab-case` for route folders).
- Keep indentation at 2 spaces (default Prettier/Next.js style).
- Prefer Tailwind utility classes for styling; centralized styles belong in `tailwind.config.ts`.
- Avoid unused exports; keep helpers colocated in `lib/` or near the component that uses them.
- Update business content via `config.ts` instead of hardcoding in pages.

## Commit & Pull Request Guidelines
- No Git history is present in this folder, so no commit message convention is enforced.
- Recommended: use Conventional Commits (`feat: ...`, `fix: ...`, `chore: ...`) for clarity.
- PRs should include a short summary, screenshots for UI changes, and a note on any new dependencies or scripts.

## Security & Configuration Tips
- Store local secrets in `.env.local` (not committed).
- Review any public asset changes under `public/` to avoid leaking sensitive content.
- `CONFIG_README.md` references `config.js`, but the real file is `config.ts`.

## Testing Guidelines (Verification)
- Manual verification checklist:
  - `npm run lint`
  - `npm run test`
  - `npm run build`
  - `npm run start` and open key routes (`/`, `/vehiculos`, one `/vehiculos/[slug]`, `/servicios`, `/studio`)
  - Confirm Sanity data loads (or mock fallback is expected).
  - Confirm images resolve from `cdn.sanity.io` in production.

## Playbooks
### Debug deploy VPS (npm ci ERESOLVE, peer deps, Next/Image)
1. Run `npm ci` on a clean workspace; if ERESOLVE, retry with `npm ci --legacy-peer-deps` (or `npm install --legacy-peer-deps`).
2. Verify `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` are set without quotes, then rebuild the container.
3. Check server logs for `[Sanity] Sanity configured:` from `lib/sanity.ts`.
4. Confirm `next.config.js` allows `cdn.sanity.io` and images are requested from that domain.
5. If errors mention `/images/vehicles/*`, ensure published Sanity images exist or provide local assets.

### Debug 404 en `/vehiculos/[slug]`
1. Confirm the slug exists and the vehicle is published in Sanity (not draft).
2. Ensure env vars are set; en desarrollo si faltan, la app cae a `mockVehicles` en `lib/data.ts` (en produccion falla con error).
3. Verify `getVehicleBySlug` can fetch the slug (it reads `slug.current`).
4. Rebuild to refresh static params if new vehicles were added and 404 persists.
5. Check for case/encoding mismatches in the URL slug.

### Validacion rapida antes de push/deploy
1. `npm run lint`
2. `npm run build`
3. `npm run start` and spot-check `/`, `/vehiculos`, one `/vehiculos/[slug]`, `/servicios`, `/studio`.
4. Verify env vars are set and no secrets are committed.
5. Check images load (Sanity CDN in prod) and WhatsApp links use `config.ts`.

## Troubleshooting
- Mock data shows in `/vehiculos`: env vars missing/quoted or Sanity not reachable; see Playbook "Debug deploy VPS".
- Images fail in Next/Image: check `cdn.sanity.io` config and published assets.
- Studio fails to load: missing `NEXT_PUBLIC_SANITY_*` env vars.
- GA4 not visible: set `NEXT_PUBLIC_GA_MEASUREMENT_ID` and rebuild.

## Change log
- Reordered content into quickstart, how-to, verification, and troubleshooting flow.
- Added env var requirements, build-time notes, and Sanity workflow details.
- Documented key routes and data flow (Sanity + fallback).
- Added playbooks for VPS deploy, dynamic 404s, and pre-deploy validation.
- Added guardrails and clarified config file usage.
