# Auditoria Tecnica (Read-only) - 2026-01-22

Este documento resume hallazgos tras una revision rapida del repo en modo read-only (sin cambios de codigo). El foco es identificar riesgos reales (bugs, inconsistencias) y quick wins para estabilizar el sitio antes de seguir iterando.

## Alcance

- Rutas principales: `app/page.tsx`, `app/vehiculos/page.tsx`, `app/vehiculos/[slug]/page.tsx`.
- Integracion Sanity: `lib/sanity.ts`, `lib/vehicles.ts`, `sanity/env.ts`, `sanity/schemaTypes/vehicle.ts`, `sanity.config.ts`.
- SEO / metadata: `lib/seo.ts`, `app/sitemap.ts`, `app/robots.ts`, `components/shared/SchemaScript.tsx`.
- APIs internas: `app/api/health/route.ts`, `app/api/calculate-loan/route.ts`, `app/api/submit-lead/route.ts`.

## Puntos Fuertes (lo que ya esta bien encaminado)

- Layout y UX base solidos: skip link, estructura clara y componentes reutilizables (`app/layout.tsx`).
- Config central del negocio bien ubicado en `config.ts`.
- Next/Image bien configurado para Sanity y caching de assets (`next.config.js`).
- Manejo de accesibilidad/reduced motion en `app/globals.css`.
- API routes con validacion zod y mensajes de error consistentes (por ejemplo `app/api/calculate-loan/route.ts`).

## Hallazgos Criticos (bugs o inconsistencias que afectan produccion)

1) Numero de WhatsApp hardcodeado en tarjetas

- `components/vehicles/VehicleCard.tsx` construye el link con `"56912345678"` (placeholder) en vez de usar `siteConfig.contact.whatsapp`.
- Impacto: los CTA de WhatsApp desde el listado pueden ir a un numero incorrecto.

2) Inconsistencia de estrategia "fallback a mock" en prod

- `lib/vehicles.ts` hace fallback a `mockVehicles` solo en no-prod; en prod, si falta `projectId`, lanza error.
- `README.md` y `AGENTS.md` declaran que el frontend cae a mock cuando faltan env vars, pero el comportamiento real en prod es fail-fast.
- Impacto: un deploy sin env vars (o mal puestas) puede romper build/render, especialmente porque `app/vehiculos/[slug]/page.tsx` usa `generateStaticParams()`.

3) Sanity apiVersion duplicada y potencialmente divergente

- `lib/sanity.ts` fija `apiVersion = '2024-01-01'`.
- `sanity/env.ts` usa `NEXT_PUBLIC_SANITY_API_VERSION` con default `2026-01-16`.
- Impacto: comportamiento distinto entre Studio y frontend; si hay cambios de API versioning, puede ser dificil de debuggear.

4) Features desde Sanity se muestran como codigos internos

- `sanity/schemaTypes/vehicle.ts` usa values tipo `aire_acondicionado`, `airbag_conductor`, etc.
- `lib/vehicles.ts` concatena esas listas en `vehicle.features` sin mapear a labels.
- `app/vehiculos/[slug]/page.tsx` renderiza `vehicle.features` tal cual.
- Impacto: la ficha en prod puede mostrar texto poco legible (slugs internos) en "Caracteristicas".

## SEO / Contenido Estructurado

- `lib/seo.ts` define helpers utiles (`generateVehicleSchema`, `generateVehicleListSchema`), pero hoy no se usan en paginas (solo se inyecta el schema de negocio local en `app/layout.tsx`).
- `lib/seo.ts` concatena `image: `${siteConfig.url}${vehicle.image}``; cuando `vehicle.image` viene de Sanity (URL absoluta a `cdn.sanity.io`), se puede generar un string invalido tipo `https://www.queirolo.clhttps://cdn.sanity.io/...`.
- `app/sitemap.ts` usa `mockVehicles` siempre; si el inventario real vive en Sanity, el sitemap puede quedar desalineado.

## UX / Datos (calidad y consistencia)

- Rango de anios hardcodeado a 2024 en filtros (`app/vehiculos/page.tsx`, `components/vehicles/VehicleFilters.tsx`). Esto envejece cada ano y afecta experiencia.
- Normalizacion de strings en filtros es parcial: se hace `replace('á','a')` / `replace('é','e')` en `app/vehiculos/page.tsx` (no cubre todas las tildes/variantes y solo reemplaza la primera ocurrencia). Ya existe un enfoque robusto en `lib/utils.ts` (`normalize('NFD')` + remove diacritics) que se puede reutilizar.

## Seguridad / Operacion

- Rate limiting en `app/api/submit-lead/route.ts` es in-memory; en multi-instancia (Vercel/VPS con pm2/containers) no es consistente.
- `setInterval` a nivel de modulo en API route puede ser problematica en runtimes serverless/edge; conviene evitar timers globales si se planea ese tipo de deploy.
- Headers de seguridad presentes en `next.config.js` (bien), pero faltan controles tipicos como HSTS y CSP; agregarlos requiere cuidado para no romper third-party scripts (GA/Sanity).

## DX / Mantenimiento

- `styled-components` esta en `package.json` pero no aparece usado en el codigo (solo en lockfile). Si no se usa, es peso extra y superficie de mantenimiento.
- Docs desalineadas: `README.md` indica "No hay framework de tests", pero existe Jest (`jest.config.js`, `__tests__/smoke.test.ts`, script `npm run test`).

## Recomendaciones Priorizadas

### Quick wins (1-2h)

- Reemplazar el WhatsApp hardcodeado por `siteConfig.contact.whatsapp` en `components/vehicles/VehicleCard.tsx`.
- Unificar `apiVersion` de Sanity (una sola fuente: idealmente `sanity/env.ts` o un wrapper compartido).
- Alinear docs con realidad: actualizar `README.md`/`AGENTS.md` sobre fallback en prod y existencia de tests.
- Hacer dinamico el anio maximo en filtros (ej: `new Date().getFullYear()`), y extraer constantes compartidas para defaults.

### Mejoras medianas (medio dia - 1 dia)

- Mapear codigos de features a labels humanos. Opciones:
  - Mantener codigos en Sanity y mapear en frontend con un diccionario.
  - O almacenar labels directamente en Sanity (implica migracion/cambio de esquema).
- Inyectar JSON-LD especifico por pagina:
  - Lista: usar `generateVehicleListSchema` en `app/vehiculos/page.tsx`.
  - Detalle: usar `generateVehicleSchema` (y/o `generateBreadcrumbSchema`) en `app/vehiculos/[slug]/page.tsx`.
- Corregir URLs en schema (manejar `vehicle.image` absoluta vs relativa).

### Cambios estrategicos (1-3 dias)

- Revisar estrategia de data fetching del listado: hoy es client-side (`app/vehiculos/page.tsx` es `use client`). Si se busca SEO y performance, mover fetch al servidor y dejar filtros como client component.
- Sitemap con inventario real: usar `getVehicles()` cuando Sanity este configurado, con fallback a `mockVehicles` solo si se decide que el sitio debe seguir respondiendo aun con Sanity caido.
- Rate limiting persistente (Upstash/Redis u otro) si los formularios pasan a produccion con trafico real.

## Checklist de Verificacion (manual)

- `npm run lint`
- `npm run test`
- `npm run build` (con env vars de Sanity presentes si `generateStaticParams` depende de ellas)
- Navegar: `/`, `/vehiculos`, un `/vehiculos/[slug]`, `/contacto`, `/studio`

## Registro de ejecucion (implementado)

Fecha: 2026-01-22

Objetivo: implementar los 4 quick wins (cambios minimos, seguros y faciles de revisar) sin romper funcionalidad ni afectar performance.

### Implementado

1) VehicleCard: WhatsApp desde `siteConfig`

- Cambiado `components/vehicles/VehicleCard.tsx` para usar `siteConfig.contact.whatsapp` (se elimino el placeholder hardcodeado).
- Se mantuvo el uso de `getWhatsAppUrl(...)` para construir el href final.
- Se robustecio `lib/utils.ts:getWhatsAppUrl` para soportar `E.164`, `wa.me/*` o URL completa (en caso de que el config cambie de formato), sin romper el caso actual.

2) Unificar `apiVersion` de Sanity (single source of truth)

- Se creo `sanity/env-utils.ts` como fuente unica: `apiVersion` + `cleanEnvVar`.
- Se refactorizo `sanity/env.ts` para re-exportar `apiVersion` desde `sanity/env-utils.ts`.
- Se refactorizo `lib/sanity.ts` para consumir `apiVersion` y `cleanEnvVar` desde `sanity/env-utils.ts` y eliminar duplicacion.

Fuente unica final de `apiVersion`: `sanity/env-utils.ts`.
Valor efectivo: `NEXT_PUBLIC_SANITY_API_VERSION` si existe; si no, default `'2024-01-01'` (se mantuvo el comportamiento del frontend previo, que estaba fijo a 2024-01-01).

3) Docs alineadas con la realidad

- Actualizado `README.md` y `AGENTS.md`:
  - Tests: existe `npm run test` (Jest smoke).
  - Fallback a mock: en desarrollo hay fallback a `mockVehicles`; en produccion el codigo hace fail-fast si faltan env vars o falla el fetch.
  - Referencia del default apiVersion: ahora se documenta desde `sanity/env-utils.ts`.

4) Filtros: anio maximo dinamico + constantes compartidas

- Se creo `lib/constants/vehicleFilters.ts` con defaults/rangos/steps compartidos.
- Se actualizo `app/vehiculos/page.tsx` y `components/vehicles/VehicleFilters.tsx` para usar esas constantes.
- Se reemplazo el maximo hardcodeado (`2024`) por `new Date().getFullYear()` (via constante), manteniendo defaults previos salvo el maxYear dinamico.

### Verificacion ejecutada

- `npm run lint`
- `npm run test`
- `npm run build`

Resultado: OK (sin errores de ESLint, sin fallos de tests, build exitoso).

### Pendiente (no implementado en este cambio)

- Mapear codigos de features (Sanity) a labels humanos en frontend (o migrar schema para guardar labels).
- Inyectar JSON-LD por pagina (listado y detalle) usando `lib/seo.ts`, y corregir concatenacion de URLs de imagen cuando `vehicle.image` es absoluta.
- Sitemap alineado con inventario real (usar `getVehicles()` cuando Sanity este configurado, y definir politica de fallback).
- Revisar normalizacion robusta de strings en filtros (usar util existente con diacritics) y evitar reemplazos parciales.
- Rate limiting persistente para `submit-lead` si hay multi-instancia/serverless.
- Headers adicionales (HSTS/CSP) con evaluacion cuidadosa para no romper GA/Sanity.
