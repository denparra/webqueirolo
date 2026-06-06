# Auditoría SEO y Recomendación — queirolo.cl

> **Fecha:** 2026-06-05
> **Alcance:** Análisis + recomendación priorizada. Decisiones cerradas. Sin implementar aún.
> **Stack:** Next.js (App Router) + Sanity CMS
> **Estado:** ✅ Decisiones confirmadas — listo para pasar a implementación (ver sección "Decisiones confirmadas")

---

## Resumen ejecutivo

La **base técnica de SEO está bien armada**: `metadataBase`, Open Graph por defecto, `robots.ts`, `sitemap.ts`, schema `AutoDealer` en el layout, headers de seguridad y `next/image` optimizado.

**El problema no es falta de infraestructura: es que lo más valioso está escrito y desconectado.** Las funciones de datos estructurados ya existen pero nunca se cablearon, la ficha de vehículo no genera metadata propia, y el listado se renderiza 100% en el cliente.

---

## Hallazgos

### 🔴 Críticos

#### 1. Código muerto en `lib/seo.ts` — el hallazgo más grave
Existen escritas pero **nunca usadas**:
- `generateVehicleSchema()` — `lib/seo.ts:133` (JSON-LD `Car` + `Offer`)
- `generateVehicleListSchema()` — `lib/seo.ts:187` (`ItemList`)
- `generateBreadcrumbSchema()` — `lib/seo.ts:207` (`BreadcrumbList`)
- `generateFAQSchema()` — `lib/seo.ts:221` (`FAQPage`)

Solo `generateLocalBusinessSchema()` (`AutoDealer`) se usa, en `app/layout.tsx:43`.
La búsqueda de `schema.org` en `app/` no encuentra ningún otro uso. Infraestructura hecha, sin conectar.

#### 2. La ficha de vehículo NO tiene `generateMetadata`
`app/vehiculos/[slug]/page.tsx:29` — cada vehículo **hereda el mismo `<title>` y description genéricos** del root layout.
Un RAV4 2020 y un Versa 2018 tienen título y meta description idénticos. Para Google, todo el catálogo —el activo SEO más importante— son títulos duplicados. **Daño número uno.**

#### 3. El listado de vehículos se renderiza 100% en el cliente
`app/vehiculos/page.tsx:1` es `'use client'` y trae los autos con `fetch` dentro de un `useEffect`.
El HTML inicial que ve Googlebot es solo `Cargando vehículos...`. Los autos, sus precios y **los enlaces internos a cada ficha** no están en el HTML inicial; aparecen recién cuando corre el JS.
Google renderiza JS en una segunda pasada, con retraso y de forma poco confiable → el catálogo se descubre mal y la autoridad no fluye hacia las fichas. Problema de arquitectura.

#### 4. El sitemap usa datos mock, no el inventario real
`app/sitemap.ts:2` importa `mockVehicles` de `lib/data` (mock estático), pero los vehículos reales vienen de Sanity vía `getVehicles()` (`lib/vehicles.ts:90`).
Resultado: se le declaran a Google URLs falsas/viejas y se le **oculta el inventario real**. Bug de crawleo.

### 🟡 Importantes

- **Sin OG image por vehículo** — el OG genérico está en `lib/seo.ts:66`. Compartir cualquier auto por WhatsApp/Facebook muestra `og-image.jpg`. El share es un canal primario para una concesionaria.
- **Sin JSON-LD `Car`+`Offer`, `ItemList` ni `BreadcrumbList` renderizados** — sin rich results (precio/disponibilidad en Google). Las funciones existen (ver hallazgo #1).
- **FAQ schema sin usar en Servicios** — `app/servicios/page.tsx` tiene FAQs ideales (financiamiento, consignación, parte de pago, con pasos y requisitos), pero `generateFAQSchema` (`lib/seo.ts:221`) no se usa. Rich result desperdiciado.
- **Tildes rotas en metadata del home** — `app/page.tsx:18-19`: "Vehiculos", "Mas de 60 anos", "Visitanos". Se ve descuidado en el SERP. Además el `title` duplica casi exacto el `defaultMetadata.title.default` del layout.
- **Canonical no explícito** en las fichas de detalle.
- **`generateVehicleSchema` con firma desalineada** — espera `specs.engine`, que el mapper de `lib/vehicles.ts` no provee. Ajustar al cablearla.
- **`baseUrl` hardcodeado** (`https://www.queirolo.cl`) duplicado en `seo.ts`, `sitemap.ts` y `robots.ts`. Debería estar en `config`.
- **Search Console sin verificar** — `lib/seo.ts:92` comentado. Sin esto no se puede medir el impacto.

#### Hallazgo adicional (detectado al confirmar decisiones) — 🔴 Crítico

- **Contenido duplicado por host: `queirolo.cl` y `www.queirolo.cl` sirven los dos.**
  Si ambos hosts responden `200` sin redirección, Google ve dos sitios idénticos y reparte la autoridad entre ambos, diluyendo todo el SEO. Hay que elegir un host canónico y forzar `301` del otro.
  **Decisión:** canónico = `www.queirolo.cl` (todo el código ya lo asume). Acción: redirect `queirolo.cl → www.queirolo.cl` a nivel de hosting/DNS (no en Next).
- **`Offer.availability` hardcodeado en `InStock`** — `lib/seo.ts:177`. Debe ser dinámico según `status`: `available`/`reserved` → `InStock`; `sold` → `SoldOut`.

---

## Recomendación priorizada

Ordenado por impacto/esfuerzo.

### 🔴 P0 — Fundación (alto impacto, riesgo bajo)

| # | Qué | Evidencia | Por qué |
|---|-----|-----------|---------|
| 1 | `generateMetadata` por vehículo en la ficha | `app/vehiculos/[slug]/page.tsx:29` | Título, description, canonical y OG propios por auto. Mata los títulos duplicados. El de mayor impacto. |
| 2 | Convertir el listado a Server Component (o `generateMetadata` + render server del grid) | `app/vehiculos/page.tsx:1` | Que autos y enlaces estén en el HTML inicial. |
| 3 | Cablear el JSON-LD ya existente: `Car`+`Offer` en ficha, `ItemList` en listado, `BreadcrumbList` en ambos | `lib/seo.ts:133,187,207` | Rich results. Infra ya hecha, solo conectar. |
| 4 | Sitemap desde Sanity, no desde mocks | `app/sitemap.ts:2` | Declarar el inventario real, dejar de exponer URLs falsas. |

### 🟡 P1 — Amplificación

| # | Qué | Evidencia | Por qué |
|---|-----|-----------|---------|
| 5 | OG image dinámica por vehículo (foto real del auto) | `lib/seo.ts:66` | El share por WhatsApp es el canal. |
| 6 | FAQ schema en Servicios | `app/servicios/page.tsx`, `lib/seo.ts:221` | Rich result de FAQ; el contenido ya está. |
| 7 | Arreglar tildes rotas en metadata del home | `app/page.tsx:18-19` | Limpieza del SERP; evitar título duplicado. |

### 🟢 P2 — Medición y pulido

| # | Qué | Evidencia |
|---|-----|-----------|
| 8 | Verificar Google Search Console | `lib/seo.ts:92` |
| 9 | Centralizar `baseUrl` en `config` | `seo.ts`, `sitemap.ts`, `robots.ts` |

---

## Decisiones confirmadas (2026-06-05)

| # | Tema | Decisión |
|---|------|----------|
| 1 | **Estados en Sanity** | Campo `status` (`sanity/schemaTypes/vehicle.ts:31`) con 3 valores: `available` (Disponible, default), `reserved` (Reservado), `sold` (Vendido). |
| 2 | **Autos vendidos** | **Opción (a):** la URL queda viva con badge "Vendido" + bloque de vehículos similares. Conserva autoridad SEO y capta tráfico residual. → Página **indexable** (sin `noindex`); `Offer.availability` = `SoldOut`; se quita del sitemap (o prioridad 0.3) pero la página sigue viva. |
| 3 | **URLs con filtros** (`?brand=…`) | `noindex` + canonical al `/vehiculos` limpio. Evita catálogo duplicado por combinaciones de filtros. |
| 4 | **Plantilla `<title>` ficha** | `{Marca} {Modelo} {Versión} {Año} usado \| Queirolo Autos`. **Sin precio ni km en el título** (cambian → títulos obsoletos). El precio va en description + schema. |
| 5 | **Meta description ficha** | Usar campo `description` de Sanity; si está vacío, autogenerar desde specs (marca, modelo, año, km, transmisión, combustible). |
| 6 | **Estrategia keyword** | Ambos: long-tail por modelo en fichas + local (Las Condes/Santiago) en home, listado y servicios. |
| 7 | **VIN / patente** | **NUNCA** publicar patente ni mostrar VIN. El schema `Car` se construye **sin** `vehicleIdentificationNumber` ni `plate`. |
| 8 | **Merchant Center / Vehicle Ads** | Solo SEO orgánico por ahora. Sin feed de vehículos. |
| 9 | **Google Search Console** | El cliente aún no lo tiene. Se deja el mecanismo de verificación listo (vía env var) y se guía el alta más adelante. No bloquea. |
| 10 | **Dominio canónico** | Ambos hosts sirven hoy → **riesgo de contenido duplicado** (ver hallazgo crítico adicional). Canónico = `www.queirolo.cl`; redirect `301` de `queirolo.cl → www` a nivel hosting/DNS. |
| 11 | **OG image por vehículo** | Dinámica con `next/og` (`ImageResponse`): tarjeta con foto + precio + datos clave. |

### Implicancias en el sitemap (P0 #4)
- Incluir `available` + `reserved` con prioridad normal.
- `sold`: la página queda indexable (decisión #2a) pero **se excluye del sitemap** o se baja a prioridad 0.3 — sacarla del sitemap no la desindexa, solo le dice a Google que no es prioridad de re-crawl.
- Filtrar vehículos sin `slug` o sin imágenes.

## Próximo paso (pendiente de confirmar)

**Punto de arranque** — ¿ejecutar el P0 completo de una, o generar primero el plan técnico detallado por punto (archivo + cambio exacto) antes de tocar código?
**Recomendación:** P0 entero — mayor retorno, menor riesgo.

---

## Archivos relevantes

| Archivo | Rol |
|---------|-----|
| `lib/seo.ts` | Helpers de metadata y JSON-LD (varios sin usar) |
| `app/layout.tsx` | Metadata global + `AutoDealer` schema |
| `app/vehiculos/[slug]/page.tsx` | Ficha de vehículo (sin `generateMetadata`) |
| `app/vehiculos/page.tsx` | Listado (`'use client'`, render client-side) |
| `app/vehiculos/layout.tsx` | Metadata del listado |
| `app/sitemap.ts` | Sitemap (usa mocks) |
| `app/robots.ts` | robots.txt |
| `lib/vehicles.ts` | Fetch de Sanity (`getVehicles`, `getVehicleBySlug`) |
| `app/servicios/page.tsx` | Servicios (candidato a FAQ schema) |
| `app/page.tsx` | Home (tildes rotas en metadata) |
| `components/shared/SchemaScript.tsx` | Render de JSON-LD |
