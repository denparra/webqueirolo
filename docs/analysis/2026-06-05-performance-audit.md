# Auditoría de Performance — queirolo.cl

> **Fecha:** 2026-06-05
> **Alcance:** Análisis de rendimiento de la web pública según el estado actual. **Solo diagnóstico + recomendaciones priorizadas. Sin implementar.**
> **Stack:** Next.js 14.2 (App Router) + React 18 + Sanity CMS + Tailwind
> **Método:** Lectura del `next build`, revisión de código (client/server boundaries, imports), `next.config.js`, dependencias y assets. (No se corrió Lighthouse en este pase — ver "Cómo medir".)

---

## Resumen ejecutivo

La base de performance **ya tiene varias cosas bien hechas** (imágenes optimizadas con `next/image` + Sanity CDN, caché de assets a 1 año, compresión, ISR, mapa lazy, listado ahora SSR). El sitio no está "lento por descuido grave".

Las oportunidades reales están en el **JavaScript del cliente**: hay librerías pesadas que se cargan en **todas** las páginas aunque solo se usen en interacciones puntuales, y componentes que se importan de forma estática cuando podrían diferirse. El mayor lever es **`framer-motion`** (entra por el layout global) y aclarar/limpiar la configuración de **Sentry**.

**Top 3 de mayor impacto/menor riesgo:**
1. Diferir `framer-motion` (animaciones y `CompareBar`/lightbox) → baja el JS de arranque de **todas** las páginas.
2. Resolver la ambigüedad de **Sentry client** (hoy parece no cargar; si se activa con Session Replay sería caro).
3. `optimizePackageImports` para `@heroicons/react` y `framer-motion` en `next.config.js`.

---

## Baseline actual (del `next build`)

| Ruta | Page JS | **First Load JS** |
|------|---------|-------------------|
| `/` (home) | 2.05 kB | **140 kB** |
| `/vehiculos` | 11.3 kB | **126 kB** |
| `/vehiculos/[slug]` | 5.7 kB | **164 kB** ← página pública más pesada |
| `/contacto` | 4.77 kB | **142 kB** |
| `/servicios` | 6.37 kB | **129 kB** |
| `/nosotros` | 444 B | **130 kB** |
| **Shared by all** | — | **88.4 kB** (lo paga toda página) |
| `/studio` (admin) | 1.66 MB | **1.75 MB** (aislado, no afecta al público) |
| Middleware | — | 76.6 kB |

**Lectura:** el "piso" compartido (88.4 kB) es razonable para App Router. El problema es cuánto suma cada página encima — la ficha llega a **164 kB** (~76 kB propios). Bajar el piso compartido beneficia a todo el sitio a la vez.

---

## Hallazgos

### 🔴 Alto impacto

#### 1. `framer-motion` se carga en todas las páginas
- **Evidencia:** `app/layout.tsx` monta `CompareBar` en el layout raíz. `components/vehicles/CompareBar.tsx:9` importa `framer-motion` (`AnimatePresence`, `motion`) y además importa **estáticamente** `CompareModal`. El home (`app/page.tsx`) usa `FadeIn` (`components/animations/FadeIn.tsx`) que también es `framer-motion`.
- **Costo:** `framer-motion` pesa ~40–50 kB gzip. Al estar en el árbol del layout global y del home, se incluye en el JS de arranque aunque el usuario nunca compare autos ni vea una animación.
- **Recomendación:**
  - `CompareBar`: cargarlo con `next/dynamic(() => import(...), { ssr: false })` y/o renderizar el contenedor animado solo cuando `comparisonList.length > 0` desde un wrapper liviano (hoy el componente entero —con framer-motion— se evalúa siempre).
  - `FadeIn`/`SlideUp`: para un simple fade-in al hacer scroll, reemplazar `framer-motion` por una animación CSS + `IntersectionObserver` (o `@tailwindcss/animate`, ya instalado). Elimina la dependencia del camino crítico del home.
  - `CompareModal`: diferirlo con `next/dynamic` (solo se necesita al abrir el modal).

#### 2. Sentry: configuración ambigua (¿carga o no en el cliente?)
- **Evidencia:** existe `sentry.client.config.ts` con **Session Replay** activo (`replaysSessionSampleRate: 0.1`, `replaysOnErrorSampleRate: 1.0`). Pero `next.config.js` **no** está envuelto con `withSentryConfig`, e `instrumentation.ts` solo carga las configs **server/edge**. En el bundle compilado, `grep replayIntegration .next/static` → **0 coincidencias**.
- **Lectura:** lo más probable es que el SDK de Sentry **no se esté inicializando en el browser** (la config client está “colgada”). Eso es bueno para performance, pero significa que **el tracking de errores del lado del cliente no funciona**.
- **Riesgo a futuro:** si alguien “completa” el setup con `withSentryConfig` sin ajustar, se agregaría el SDK + **Session Replay** a cada página (coste alto: el replay añade un chunk grande).
- **Recomendación (elegir una):**
  - **(a) No quieren error-tracking de browser:** eliminar `sentry.client.config.ts` y `@sentry/nextjs` del cliente; dejar Sentry solo server (o quitarlo). Menos peso y menos confusión.
  - **(b) Sí quieren:** completar el setup correctamente pero **sin Session Replay** (o con sampling muy bajo) y con `tracesSampleRate` acotado. Verificar el peso real con bundle analyzer antes/después.
  - En ambos casos: **decidir explícitamente**, hoy está en un limbo.

#### 3. Componentes pesados importados de forma estática en la ficha
- **Evidencia:** `app/vehiculos/[slug]/page.tsx` (164 kB) importa estáticamente `VehicleDetailGallery` → que importa `VehicleGalleryLightbox` (usa `framer-motion`), `LoanCalculator`, y `Tabs` de Radix. El **lightbox** solo aparece al hacer clic, pero su JS (incl. framer-motion) se descarga en la carga inicial.
- **Recomendación:** `next/dynamic` para `VehicleGalleryLightbox` y para `Vehicle360Viewer` (si se usa). La galería principal (imagen + thumbnails) se mantiene; el visor ampliado se carga al abrirlo. Baja el First Load de la página más visitada del catálogo.

### 🟡 Impacto medio

#### 4. `optimizePackageImports` no está configurado
- **Evidencia:** `next.config.js` no usa `experimental.optimizePackageImports`. Hay 25 imports de `@heroicons/react/24/*` en 22 archivos.
- **Recomendación:** agregar `experimental: { optimizePackageImports: ['@heroicons/react', 'framer-motion'] }`. Next hace tree-shaking/barrel-optimization más agresivo y reduce lo que entra al bundle por estos paquetes. Cambio de 1 línea, riesgo bajo.

#### 5. `leaflet` + `react-leaflet` en dependencias
- **Evidencia:** `package.json` incluye `leaflet`, `react-leaflet`, `@types/leaflet`. El mapa se carga lazy (`components/maps/LazyContactMap.tsx` usa `next/dynamic`) — bien. Pero conviene confirmar que **solo** la página `/contacto` lo incluye y que no hay un segundo mecanismo de mapa (el `CLAUDE.md` menciona un iframe de Google Maps, lo que sugiere posible código/depe duplicada).
- **Recomendación:** verificar con bundle analyzer que `leaflet` no aparece fuera de `/contacto`. Si el iframe de Google Maps quedó como alternativa, eliminar `leaflet`/`react-leaflet` (≈150 kB de dependencia) o viceversa. No tener dos soluciones de mapa.

#### 6. La ficha de vehículo es SSG con `generateStaticParams` (42 páginas)
- **Evidencia:** `app/vehiculos/[slug]/page.tsx` prerenderiza las 43 fichas en build. Bien para TTFB. Pero el detalle hace `getVehicleBySlug` en la página **y** en `generateMetadata` → **dos fetches a Sanity por vehículo** en build.
- **Recomendación:** menor — cachear/deduplicar con `React.cache()` para `getVehicleBySlug` (Next deduplica fetch nativo, pero el cliente de Sanity puede no entrar en esa dedupe). Reduce llamadas en build y en revalidación.

### 🟢 Impacto bajo / verificación

#### 7. Imágenes — ya está bien (mantener)
- `next.config.js`: `formats: ['image/webp','image/avif']`, `minimumCacheTTL: 31536000`, `deviceSizes`/`imageSizes` afinados, `remotePatterns` para `cdn.sanity.io`. `applySanityTransform` reduce el payload (`?w=…&q=80&auto=format`). LQIP blur (`placeholder="blur"`), `priority` en las primeras 4 cards, `sizes` correctos. **Buen trabajo, no tocar.**
- Nota menor: en `VehicleDetailGallery` se usa `aspect-video` + `object-contain` (la imagen no llena el contenedor → barras). Es decisión de diseño, no de performance, pero genera espacio “vacío” que afecta CLS/visual. Solo revisar si molesta.

#### 8. Fuente Inter con `next/font` — bien
- `app/layout.tsx`: `Inter` vía `next/font/google` con `display: 'swap'`, `preload: true`, `variable`. Self-hosted por Next (sin request a Google Fonts en runtime). Correcto.

#### 9. Google Analytics — bien
- `components/analytics/GoogleAnalytics.tsx` usa `next/script strategy="afterInteractive"` y solo renderiza si hay `NEXT_PUBLIC_GA_MEASUREMENT_ID`. No bloquea el render. Correcto.

#### 10. Studio aislado — bien
- `/studio` pesa 1.75 MB (Sanity + `@sanity/vision` + `styled-components`), pero es ruta de admin y **no** se carga en las páginas públicas (shared = 88.4 kB lo confirma). Mantener así; no enlazar `/studio` desde el sitio público.

---

## Recomendaciones priorizadas

| # | Acción | Impacto | Esfuerzo | Riesgo |
|---|--------|---------|----------|--------|
| 1 | Diferir/eliminar `framer-motion` del layout global (`CompareBar`, `CompareModal`) y del home (`FadeIn`→CSS) | Alto | Medio | Bajo |
| 2 | Resolver Sentry client (quitar o configurar sin Session Replay) | Alto | Bajo | Bajo |
| 3 | `optimizePackageImports: ['@heroicons/react','framer-motion']` | Medio | Muy bajo | Bajo |
| 4 | `next/dynamic` para `VehicleGalleryLightbox` / `Vehicle360Viewer` en la ficha | Medio | Bajo | Bajo |
| 5 | Confirmar/eliminar duplicación de mapa (`leaflet` vs iframe) | Medio | Bajo | Bajo |
| 6 | `React.cache()` en `getVehicleBySlug` (dedupe page + metadata) | Bajo | Bajo | Bajo |
| 7 | Medir con Lighthouse + `@next/bundle-analyzer` (línea base real) | — | Bajo | — |

**Quick wins (1 sesión, bajo riesgo):** #2, #3, #4, #6.
**Bet de mayor retorno:** #1 (toca el piso compartido de todo el sitio).

---

## Cómo medir (antes/después)

1. **Lighthouse / PageSpeed Insights** sobre `/`, `/vehiculos`, `/vehiculos/[slug]` (mobile + desktop). Foco en **LCP**, **TBT**, **CLS** y peso de JS.
2. **`@next/bundle-analyzer`**: instalar como dev dep, envolver `next.config.js`, correr `ANALYZE=true npm run build` para ver qué paquetes pesan en cada chunk (confirma framer-motion, sentry, leaflet).
3. **WebPageTest** desde Chile (Santiago) para latencia real del VPS/CDN.
4. Repetir post-cambios y comparar el **First Load JS** de la tabla baseline.

> Importante: varias estimaciones de este documento se basan en lectura de código y tamaños del `build`, no en perfiles de runtime. Antes de optimizar agresivamente, tomar la línea base con Lighthouse + bundle-analyzer para priorizar con datos.

---

## Pendientes de confirmar (no bloqueantes)

- ¿Sentry de browser se quiere o no? (define recomendación #2).
- ¿El mapa es Leaflet o iframe de Google? (define recomendación #5).
- ¿Hay CDN delante del VPS para `queirolo.cl`? (afecta TTFB y la utilidad del `Cache-Control` ya configurado).

## Archivos relevantes

| Archivo | Rol en performance |
|---------|--------------------|
| `next.config.js` | imágenes, caché, compresión, headers (falta `optimizePackageImports`) |
| `app/layout.tsx` | monta `CompareBar` (framer-motion) en todas las páginas |
| `components/vehicles/CompareBar.tsx` | framer-motion + `CompareModal` estático, global |
| `components/animations/FadeIn.tsx` / `SlideUp.tsx` | framer-motion en el home |
| `components/vehicles/VehicleDetailGallery.tsx` | importa `VehicleGalleryLightbox` (framer-motion) estático |
| `sentry.client.config.ts` / `instrumentation.ts` / `next.config.js` | Sentry client ambiguo (Session Replay) |
| `components/maps/LazyContactMap.tsx` | mapa lazy (bien) — verificar duplicación con leaflet |
| `lib/vehicles.ts` | `getVehicleBySlug` llamado 2× por ficha (page + metadata) |
