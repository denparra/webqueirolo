# Repository Guidelines

## Quickstart (Que hacer primero)
1. Define env vars en `.env.local` (ver "Environment Variables").
2. `npm install`
3. `npm run dev`
4. Abre `http://localhost:3000`, `http://localhost:3000/studio` y, si configuras auth admin, `http://localhost:3000/admin`
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
- `docs/` contains active governance, technical reference, logbook, IMPs and analysis. Archive in `docs/archive/`.
- `scripts/` contains manual utilities that are not part of the Next.js runtime.
- `tailwind.config.ts`, `postcss.config.js`, and `tsconfig.json` define styling and TypeScript behavior.
- `.next/` is the build output and should not be edited manually.

## Key Routes & Content Flows
Routes:
- `/` home
- `/vehiculos` listado con filtros (cliente)
- `/vehiculos/[slug]` detalle con `notFound()` si no existe
- `/servicios`, `/nosotros`, `/contacto`
- `/admin` admin privado del owner para alta/edicion/eliminacion de vehiculos sobre Sanity
- `/studio` Sanity Studio tecnico (basePath en `sanity.config.ts`)
- `/sitemap.xml` y `/robots.txt` desde `app/sitemap.ts` y `app/robots.ts`
- `/api/health`, `/api/calculate-loan` y `/api/submit-lead` son endpoints HTTP en `app/api/`
- `/privacidad`, `/politica-de-privacidad`, `/terminos`, `/terminos-y-condiciones` y `/eliminacion-de-datos` son paginas legales existentes

Sanity:
- Studio usa `sanity.config.ts` + `sanity/env.ts` (env vars requeridas).
- Schema principal: `sanity/schemaTypes/vehicle.ts`.
- Admin privado escribe en Sanity desde `lib/admin/vehicles.ts` usando `SANITY_API_WRITE_TOKEN`.
- Frontend consulta en `lib/vehicles.ts` via GROQ y mapea a `Vehicle`.
- En desarrollo, si falla la conexion o faltan env vars, se usa `lib/data.ts` como fallback; en produccion el fetch falla con error.
- `app/sitemap.ts` consulta Sanity (`getVehicles`), excluye `sold` y sin slug/imágenes (IMP-20260605-003).

## Build, Test, and Development Commands
- `npm install` installs dependencies from `package.json` and `package-lock.json`.
- `npm run dev` starts the local Next.js dev server with hot reloading.
- `npm run build` creates an optimized production build in `.next/`; agents must not run it automatically after changes unless explicitly requested.
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
- `N8N_LEAD_WEBHOOK_URL` (optional; future lead forwarding from `/api/submit-lead`)

Required for private `/admin` vehicle management:
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD_HASH` (SHA-256 hex of the admin password; never store the plain password)
- `ADMIN_SESSION_SECRET` (long random secret for signed admin cookies)
- `SANITY_API_WRITE_TOKEN` (server-only Sanity token with write access)

Example `.env.local` (placeholders, no quotes):
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=replace_with_sha256_hex
ADMIN_SESSION_SECRET=replace_with_long_random_secret
SANITY_API_WRITE_TOKEN=replace_with_server_only_sanity_token
```

Notes:
- `NEXT_PUBLIC_*` is build-time; changes require a rebuild in deploy.
- Avoid quoted env values; VPS setups with quotes can break Sanity config (see `lib/sanity.ts` cleanEnvVar).
- `/admin` write operations require `SANITY_API_WRITE_TOKEN`; never expose it as `NEXT_PUBLIC_*`.

## Coding Style & Naming Conventions
- Use TypeScript/TSX and follow existing file naming (`PascalCase` for React components, `kebab-case` for route folders).
- Keep indentation at 2 spaces (default Prettier/Next.js style).
- Prefer Tailwind utility classes for styling; centralized styles belong in `tailwind.config.ts`.
- Avoid unused exports; keep helpers colocated in `lib/` or near the component that uses them.
- Update business content via `config.ts` instead of hardcoding in pages.

## AI Agent Working Practices

Estas reglas son agnosticas al modelo (Claude, GPT, Gemini, Copilot u otro). El modelo puede cambiar; el contrato de trabajo del repositorio no.

### Before editing

- Read the relevant source files, configuration and tests before proposing a change.
- Search for all references before renaming, moving or deleting a file.
- Treat `sanity/schemaTypes/vehicle.ts`, `lib/vehicles.ts`, `lib/types.ts`, `config.ts` and `docs/reference/project-reference.md` as sources of truth for their areas.
- State uncertainty explicitly. Do not infer a route, integration, environment variable or business rule that is not present in the repository.

### While editing

- Make the smallest change that satisfies the request; do not refactor unrelated code.
- Preserve public routes, import paths, environment variable names, data contracts and image behavior unless the task explicitly changes them.
- Keep server-only secrets and write tokens out of client components and `NEXT_PUBLIC_*` variables.
- Use `apply_patch` for manual edits and do not modify `.next/`, `node_modules/`, generated files or user changes outside the task.
- Prefer existing helpers and patterns over introducing a parallel abstraction.

### Before reporting completion

- Re-read changed files and inspect `git diff`/`git status`.
- Verify changed references and run focused checks plus `npm run lint`, `npm run test` and `npx tsc --noEmit --pretty false` when applicable.
- Do not run `npm run build` unless the owner explicitly requests deploy/build verification.
- Report what was verified, what was not verified and any remaining risk. Never claim a route or integration was tested if it was only inspected.
- Record relevant decisions, documentation changes, tests and risks in `docs/logbook.md`.

### Scope and collaboration

- Do not commit, amend, push or change Git configuration without explicit owner request.
- Do not revert unrelated worktree changes; inspect and preserve them.
- Ask one concise question and stop if the requested change has an unresolved product or security decision.

## Commit & Pull Request Guidelines
- Follow the repository Git history when it is available; use Conventional Commits (`feat: ...`, `fix: ...`, `docs: ...`, `chore: ...`) for clarity.
- PRs should include a short summary, screenshots for UI changes, and a note on any new dependencies or scripts.

## Security & Configuration Tips
- Store local secrets in `.env.local` (not committed).
- Review any public asset changes under `public/` to avoid leaking sensitive content.
- `docs/reference/configuration.md` documents the real source `config.ts`; vehicle inventory lives in Sanity, not in config.
- `docs/reference/project-reference.md` documents the current architecture, routes, APIs, image storage and documentation map.
- `docs/reference/automotive-platform-specification.md` defines the reusable platform baseline, domain, deployment, security, backups and availability rules.

## Testing Guidelines (Verification)
- Manual verification checklist:
  - `npm run lint`
  - `npm run test`
  - `npx tsc --noEmit --pretty false`
  - `npm run build` only when explicitly requested for deploy verification
  - `npm run start` and open key routes (`/`, `/vehiculos`, one `/vehiculos/[slug]`, `/servicios`, `/admin`, `/studio`)
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
2. `npm run build` only when explicitly requested for deploy verification.
3. `npm run start` and spot-check `/`, `/vehiculos`, one `/vehiculos/[slug]`, `/servicios`, `/admin`, `/studio`.
4. Verify env vars are set and no secrets are committed.
5. Check images load (Sanity CDN in prod) and WhatsApp links use `config.ts`.

## Troubleshooting
- Mock data shows in `/vehiculos`: env vars missing/quoted or Sanity not reachable; see Playbook "Debug deploy VPS".
- Images fail in Next/Image: check `cdn.sanity.io` config and published assets.
- Studio fails to load: missing `NEXT_PUBLIC_SANITY_*` env vars.
- `/admin` login disabled: missing `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, or `ADMIN_SESSION_SECRET`.
- `/admin` can list but cannot save: missing `SANITY_API_WRITE_TOKEN` or token lacks write permission.
- Sanity rejects image as invalid: prefer JPG/PNG/WEBP/GIF; HEIC/HEIF/TIFF/BMP are converted with `sharp` when possible, otherwise convert manually before upload.
- Wrong vehicle cover: edit in `/admin` and move the desired image to first position; public cover uses `images[0]`.
- Duplicate vehicle: delete the duplicate document from `/admin`; this does not delete image assets from Sanity.
- GA4 not visible: set `NEXT_PUBLIC_GA_MEASUREMENT_ID` and rebuild.

## Co-gobierno de reglas

`AGENTS.md` (este archivo) y `CLAUDE.md` (raíz) son **co-base entrelazada**.  
Ninguno manda sobre el otro; ambos deben reflejar las mismas reglas operativas críticas.

- `AGENTS.md`: reglas operativas completas, alcance, restricciones, trazabilidad y DoD.
- `CLAUDE.md`: resumen ejecutable para agentes, comandos principales y practicas compactas de trabajo.

**Regla de consistencia**: toda regla crítica nueva o cambiada debe actualizarse en **ambos** en la misma sesión.  
Si hay diferencia entre ambos:
1. Aplicar la opción más segura/no destructiva.
2. Registrar `DECISION` en `docs/logbook.md`.
3. Proponer alineación inmediata de ambos archivos.

**Fuente de verdad técnica** (prevalece sobre docs narrativas):
- Schema: `sanity/schemaTypes/vehicle.ts`
- Queries: `lib/vehicles.ts`
- Configuración negocio: `config.ts`
- Tipos: `lib/types.ts`
- Panorama tecnico: `docs/reference/project-reference.md`
- Especificacion reusable: `docs/reference/automotive-platform-specification.md`
- Deuda tecnica y decisiones que NO revertir: `docs/reference/deuda-tecnica.md` (**leer antes de proponer mejoras**; su seccion "Anti-deuda" documenta opciones que ya se probaron y se descartaron con motivo)

---

## Trazabilidad obligatoria

Registrar en `docs/logbook.md` todo cambio relevante (no ruido cotidiano):
- Decisiones que cambian dirección técnica o de negocio
- Acciones que modifican código, config o documentación base
- Ejecución de pruebas con resultado
- Riesgos, bloqueos e incidentes
- Cambios de alcance o políticas

**Formato de ID:** `LOG-YYYYMMDD-XXX` (contador diario de 3 dígitos)

**Taxonomía permitida:** `DECISION` | `PLAN` | `ACTION` | `TEST` | `RISK` | `BLOCKER` | `SECURITY` | `INCIDENT`

**Campos obligatorios por entrada:**
- ID, Fecha, Tipo, Contexto, Acuerdo/resultado, Impacto, Siguiente paso, Referencias

---

## Estructura de implementaciones formales

Toda iniciativa formal vive en `docs/implementation/IMP-YYYYMMDD-XXX/`.

```
docs/
  logbook.md              ← bitácora de trazabilidad
  INDEX.md                ← mapa de lectura para onboarding
  implementation/
    README.md             ← guía de iniciativas
    IMP-template.md       ← template reutilizable
    IMP-YYYYMMDD-XXX/
      IMP.md              (obligatorio)
      ROADMAP.md          (recomendado)
      EVIDENCE.md         (recomendado)
      ROLLBACK.md         (recomendado en cambios de riesgo)
```

Reglas:
- No mezclar dos iniciativas distintas en una misma carpeta.
- Toda carpeta creada debe estar referenciada en `docs/logbook.md`.
- Crear la carpeta antes de empezar el trabajo, no al final.

---

## Política de commits

Esquema recomendado:
```
<tipo>(<alcance>): <resumen corto>

<por qué del cambio>

Refs: <LOG-ID>, <IMP-ID>
```

Tipos: `feat` | `fix` | `docs` | `refactor` | `test` | `chore` | `security`

Restricciones (ver Guardrails):
- No commit sin solicitud explícita del owner.
- No `--amend` salvo solicitud explícita.
- No `push --force` a ramas protegidas.

---

## Definition of Done universal

Se considera completada una iniciativa cuando:
- [ ] Existe carpeta `IMP-YYYYMMDD-XXX/` con `IMP.md`
- [ ] Se registró decisión/acción en `docs/logbook.md`
- [ ] Hay evidencia de validación (manual o automatizada)
- [ ] Se documentó impacto, riesgos y rollback
- [ ] Referencias cruzadas log ↔ IMP ↔ artefactos completas

---

## Change log
- LOG-20260825-002: Reconciled active documentation with the current repository and documented model-agnostic AI agent practices, architecture, APIs and image storage.
- LOG-20260615-001: Documented latest `/admin` improvements, image handling, cover ordering, duplicate deletion, and current validation/deploy notes.
- Reordered content into quickstart, how-to, verification, and troubleshooting flow.
- Added env var requirements, build-time notes, and Sanity workflow details.
- Documented key routes and data flow (Sanity + fallback).
- Added playbooks for VPS deploy, dynamic 404s, and pre-deploy validation.
- Added guardrails and clarified config file usage.
- LOG-20260405-001: Added co-governance, traceability policy, implementation structure, and DoD (IMP-20260405-001).
