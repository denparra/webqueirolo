# IMP-20260607-001 — SEO polish: OG estática + rutas legales

## Metadatos

| Campo       | Valor |
|-------------|-------|
| **ID**      | IMP-20260607-001 |
| **Fecha**   | 2026-06-07 |
| **Owner**   | Denny |
| **Estado**  | completed (F1+F2; F3 diferida) |
| **Log ref** | LOG-20260607-003 |
| **Continúa**| IMP-20260605-004 (follow-ups) |

## Objetivo

Cerrar dos quick wins SEO detectados en el análisis del 2026-06-07, que habían quedado como follow-up de `IMP-20260605-004`: la imagen Open Graph por defecto (rota) y la inconsistencia de rutas legales.

## Contexto

- **OG por defecto**: `lib/seo.ts` referencia `/og-image.jpg` (preview al compartir el sitio por WhatsApp/redes), pero el archivo **nunca se había creado**. Las fichas de vehículo ya funcionaban (usan la foto real del auto). El intento previo de OG **dinámica** (`@vercel/og`/`next/og`) se descartó por un bug **solo de Windows en dev** (`ERR_INVALID_URL` cargando la fuente por defecto) — ver `IMP-20260605-004` F5. La decisión fue OG **estática**; faltaba el archivo.
- **Rutas legales**: sitemap y footer enlazaban a URLs que hacen 301 en vez de a la final.

## Alcance y resultado por fase

### Fase 1 — OG image estática ✅
- Creado `public/og-image.jpg` (1200×630, 25 KB): fondo `#111827`, logo blanco `LOGOLETRASBLANCASINFONDO.png` centrado, franja roja `#E63946` inferior.
- Generado con `sharp` (script temporal, eliminado tras ejecutar). **Estático, sin `@vercel/og` ni runtime** → imposible que dispare el bug de Windows.
- Sin cambio de código: `lib/seo.ts:66/79/129` ya referenciaban `/og-image.jpg`.
- Reemplazable: si más adelante hay una OG diseñada (1200×630), se sobreescribe el archivo.

### Fase 2 — Limpieza de rutas legales ✅
Apuntar siempre a la URL final (sin pasar por 301):
- `app/sitemap.ts`: `/politica-de-privacidad` → `/privacidad`.
- `components/layout/Footer.tsx`: link de privacidad → `/privacidad`.
- `config.ts`: `urls.terms` `/terminos` → `/terminos-y-condiciones`.
- Las páginas-redirect (`/politica-de-privacidad`, `/terminos`) se conservan como 301 para enlaces externos entrantes; solo se deja de enlazarlas/sitemap-earlas.

### Fase 3 — Diferida (documentada, no implementada)
- OG **dinámica** por vehículo (`next/og`): revisitar con fuente bundleada y verificar en Linux (no en Windows).
- Micro-fixes: dims declaradas del OG por vehículo (1200×630 vs foto real), `noindex` en filtros, `title.template` muerto en `app/layout.tsx`. Bajo impacto.

## Impacto esperado

- **Share**: el home y páginas institucionales muestran tarjeta con logo al compartir (antes: preview rota). Canal primario del negocio (WhatsApp).
- **Crawl**: footer y sitemap dejan de pasar por 301; URLs legales consistentes.

## Riesgos

| Riesgo | Probabilidad | Mitigación |
|--------|-------------|------------|
| Repetir el bug de Windows de `@vercel/og` | eliminado | Fase 1 es una imagen estática; no usa `next/og` ni runtime |
| OG no se refresca en redes ya cacheadas | media | Usar Facebook Sharing Debugger para forzar el re-scrape post-deploy |

## Evidencia de validación

- [x] `og-image.jpg` generado 1200×630, 25 KB; inspección visual OK (logo + franja roja sobre fondo oscuro).
- [x] `npm run lint` → sin errores.
- [ ] Post-deploy: `https://www.queirolo.cl/og-image.jpg` responde 200; tarjeta validada en Facebook Sharing Debugger / WhatsApp.
- [ ] Post-deploy: footer/sitemap legales resuelven 200 directo (sin 301).
- Sin `npm run build` (regla del proyecto).

## Rollback

- `git revert` del commit asociado. La OG vuelve a faltar (estado previo) y las rutas legales vuelven a enlazar el redirect.

## Referencias

- `public/og-image.jpg`, `lib/seo.ts`, `app/sitemap.ts`, `components/layout/Footer.tsx`, `config.ts`
- `docs/analysis/2026-06-05-seo-audit-recomendacion.md`, `IMP-20260605-004` (F5 OG, follow-ups)
