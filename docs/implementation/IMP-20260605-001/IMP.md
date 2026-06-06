# IMP-20260605-001 — SEO Fase 0 (config baseUrl) + Fase 1 (metadata por vehículo)

## Metadatos

| Campo       | Valor |
|-------------|-------|
| **ID**      | IMP-20260605-001 |
| **Fecha**   | 2026-06-05 |
| **Owner**   | denparra |
| **Estado**  | completed |
| **Log ref** | LOG-20260605-001 |
| **Rama**    | `feat/seo-fase0-1-metadata-vehiculo` |

## Objetivo

Ejecutar las dos primeras fases del plan SEO (`claudedocs/00-Analysis-Planning/2026-06-05-seo-plan-tecnico-implementacion.md`): centralizar la URL canónica del sitio (Fase 0) y dotar a cada ficha de vehículo de metadata propia —`title`, `description`, `canonical` y Open Graph— para eliminar los títulos duplicados en todo el catálogo (Fase 1, el cambio de mayor impacto SEO).

## Alcance

**Incluye:**
- `config.ts` — nueva propiedad `url` (host canónico único).
- `lib/seo.ts`, `app/sitemap.ts`, `app/robots.ts` — consumen `config.url` en vez del literal hardcodeado.
- `app/vehiculos/[slug]/page.tsx` — nueva función `generateMetadata` por vehículo.

**Excluye:**
- Listado a Server Component (Fase 2), JSON-LD (Fase 3), sitemap desde Sanity (Fase 4), OG dinámica `next/og` (Fase 5), FAQ/tildes (Fase 6), patente/filtros (Fase 7), GSC/dominio (Fase 8).
- Cambios visuales en la ficha (el render no se tocó).

## Pasos de implementación

- [x] Fase 0 — agregar `url: 'https://www.queirolo.cl'` a `siteConfig` en `config.ts`.
- [x] Fase 0 — reemplazar literal por `config.url` en `lib/seo.ts:9`, `app/sitemap.ts:5`, `app/robots.ts:4`.
- [x] Fase 1 — importar `Metadata` y agregar `generateMetadata` en `app/vehiculos/[slug]/page.tsx`.
- [x] Title: `{Marca} {Modelo} {Versión} {Año} usado | Queirolo Autos` (sin precio ni km).
- [x] Description: campo `description` de Sanity; fallback autogenerado desde specs.
- [x] `alternates.canonical` absoluto + Open Graph + Twitter card con la foto del auto.

## Impacto esperado

- **SEO:** cada `/vehiculos/[slug]` deja de heredar el `<title>`/`description` genérico del root. Fin de los títulos duplicados en el catálogo (el activo SEO más importante). Canonical explícito por ficha. Al compartir en WhatsApp/Facebook se muestra la foto real del auto (fallback hasta la OG dinámica de la Fase 5).
- **Técnico:** `config.url` queda como única fuente de verdad del host; elimina la duplicación en 3 archivos.
- **UX:** sin cambios visibles. Solo metadata en `<head>`.

## Notas de implementación

- El root layout (`app/layout.tsx:21`) sobrescribe `title` con un string plano, lo que anula el `template` `%s | Queirolo Autos` de `defaultMetadata`. Por eso la ficha define el **título completo** (con sufijo de marca), igual que el resto de páginas del proyecto.
- `status === 'sold'` permanece **indexable** (decisión confirmada #2a): no se setea `noindex`; hereda `index: true` del `defaultMetadata`.
- No se expone patente ni VIN en la metadata (decisión #7).

## Riesgos

| Riesgo | Probabilidad | Mitigación |
|--------|-------------|------------|
| `generateMetadata` falla si `getVehicleBySlug` no resuelve | baja | Guard `if (!vehicle) return { title: 'Vehículo no encontrado' }`. La página ya maneja `notFound()`. |
| Description autogenerada poco natural si faltan specs | baja | Se prioriza el campo `description` de Sanity; el fallback filtra nulos con `.filter(Boolean)`. |
| Cambio de host en `config.url` afecta sitemap/robots/canonical a la vez | baja | Es el comportamiento deseado (fuente única); valor validado = `https://www.queirolo.cl`. |

## Rollback

- Fase 1: eliminar la función `generateMetadata` y el `import type { Metadata }` en `app/vehiculos/[slug]/page.tsx` → vuelve a heredar la metadata del layout.
- Fase 0: revertir `config.url` y los 3 consumidores al literal anterior.
- Alternativa: `git revert` del/los commit(s) de la rama `feat/seo-fase0-1-metadata-vehiculo`.

## Evidencia de validación

- [x] `npx next lint` sobre archivos modificados → `✔ No ESLint warnings or errors`.
- [x] `npx tsc --noEmit` → sin errores en archivos modificados. (Único error preexistente y ajeno: `__tests__/smoke.test.ts` — export `screen` de `@testing-library/react`, no relacionado con esta iniciativa.)
- [x] Verificación en local (`next dev`, datos reales de Sanity `projectId=4124jngl`) sobre 2 fichas (`mercedes-benz-a200-1-6-aut-2017`, `ford-f-150-...-2014`): `<title>`, `<meta name="description">`, `<link rel="canonical">` y OG **distintos por auto** y correctos. Canonical absoluto con host `www`.
- [ ] Pendiente: debugger de WhatsApp/Facebook muestra la foto del auto al compartir (requiere deploy en host público).
- [x] `npm run build` NO ejecutado por convención del proyecto ("Never build after changes").

### Hallazgos durante la verificación (corregidos en esta misma iniciativa)

1. **Doble espacio en el título** — el campo `model` en Sanity trae espacio final (`"A200 "`), generando `A200  1.6`. **Fix:** normalización de whitespace en `titleBase` (`.replace(/\s+/g, ' ').trim()`).
2. **`description` de Sanity con saltos de línea y >160 chars** — el campo es copy de marketing (emojis, viñetas, `\n`), inválido/subóptimo como `<meta description>`. **Fix:** helper `toMetaDescription()` que colapsa whitespace y trunca a ~160 sin cortar palabras. Resultado verificado: 158 chars, una línea.

> **Decisión de fondo pendiente (no bloquea esta fase):** el contenido del campo `description` de Sanity es texto de venta, no un resumen SEO que lidere con marca/modelo/año. Evaluar si la meta description debería **autogenerarse siempre** (keyword-rich) en vez de reutilizar el copy de marketing. Ver `claudedocs/00-Analysis-Planning/2026-06-05-seo-audit-recomendacion.md`.

## Definition of Done

- [x] Carpeta `IMP-20260605-001/` con `IMP.md` existe.
- [x] Decisión/acción registrada en `docs/logbook.md` (LOG-20260605-001).
- [x] Evidencia de validación documentada (lint + type-check).
- [x] Impacto, riesgos y rollback documentados.
- [x] Referencias cruzadas log ↔ IMP ↔ plan técnico completas.

## Referencias

- `claudedocs/00-Analysis-Planning/2026-06-05-seo-audit-recomendacion.md` (diagnóstico + decisiones)
- `claudedocs/00-Analysis-Planning/2026-06-05-seo-plan-tecnico-implementacion.md` (plan por fases)
- `config.ts`, `lib/seo.ts`, `app/sitemap.ts`, `app/robots.ts`, `app/vehiculos/[slug]/page.tsx`
