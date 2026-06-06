# Plan técnico de implementación SEO — queirolo.cl

> **Fecha:** 2026-06-05
> **Tipo:** Guía de implementación por fases (cada fase es desplegable de forma independiente)
> **Base:** `2026-06-05-seo-audit-recomendacion.md` (diagnóstico + decisiones confirmadas)
> **Stack:** Next.js App Router + Sanity CMS

## Cómo usar esta guía

- Cada **fase es autónoma**: se puede implementar, revisar y desplegar sola. No hace falta hacerlas todas juntas.
- El **orden recomendado** está por impacto/dependencia, pero las marcadas como _independientes_ se pueden tomar en cualquier momento.
- Cada fase trae: **Objetivo · Archivos · Cambios · Validación · Riesgo/rollback · Dependencias**.
- Los snippets son **de referencia** (muestran el cómo), no copy-paste literal: hay que adaptarlos al estilo del archivo destino.

### Mapa de fases

| Fase | Qué | Prioridad | Independiente | Riesgo |
|------|-----|-----------|---------------|--------|
| 0 | Centralizar `baseUrl` en config | P2 (habilitador) | ✅ | Muy bajo · **✅ HECHA (IMP-20260605-001)** |
| 1 | `generateMetadata` por vehículo + canonical | 🔴 P0 | ✅ | Bajo · **✅ HECHA (IMP-20260605-001)** |
| 2 | Listado a Server Component (render server del grid) | 🔴 P0 | ✅ | **Medio** · **✅ HECHA (IMP-20260605-002)** |
| 3 | Cablear JSON-LD (`Car`+`Offer`, `ItemList`, `Breadcrumb`) | 🔴 P0 | Tras F1 ideal | Bajo · **✅ HECHA (IMP-20260605-002)** |
| 4 | Sitemap desde Sanity + filtro por `status` | 🔴 P0 | ✅ | Bajo · **✅ HECHA (IMP-20260605-003)** |
| 5 | OG image dinámica por vehículo (`next/og`) | 🟡 P1 | Tras F1 | Bajo · **⚠️ REVERTIDA a OG estática (bug @vercel/og en Windows) — IMP-20260605-004** |
| 6 | FAQ schema en Servicios + tildes del home | 🟡 P1 | ✅ | Muy bajo · **✅ HECHA (IMP-20260605-004)** |
| 7 | Privacidad (`plate` fuera del payload) + filtros `noindex` | 🟡 P1 | ✅ | Bajo · **✅ HECHA (canonical estático en vez de noindex) — IMP-20260605-004** |
| 8 | Medición (GSC env var) + redirect de dominio | 🟢 P2 | ✅ | Infra · **✅ HECHA (redirect vía middleware) — IMP-20260605-004** |

---

## Convenciones transversales

- **Host canónico:** `https://www.queirolo.cl`. Toda URL absoluta lo usa.
- **Estados (`status`):** `available` · `reserved` · `sold` (de `sanity/schemaTypes/vehicle.ts:31`).
- **Patente / VIN:** NUNCA en HTML, metadata ni JSON-LD.
- **Título de ficha:** `{Marca} {Modelo} {Versión} {Año} usado | Queirolo Autos` (sin precio ni km).

---

## FASE 0 — Centralizar `baseUrl` en config

**Objetivo:** una sola fuente de verdad para la URL del sitio. Hoy `https://www.queirolo.cl` está hardcodeado en 3 archivos.

**Archivos:**
- `config.ts` (agregar)
- `lib/seo.ts:9`, `app/sitemap.ts:5`, `app/robots.ts:4` (consumir)

**Cambios:**
1. En `config.ts`, dentro de `siteConfig`, agregar:
   ```ts
   url: 'https://www.queirolo.cl',
   ```
2. Reemplazar el literal por `siteConfig.url` (o `config.url`) en `lib/seo.ts`, `app/sitemap.ts` y `app/robots.ts`.

**Validación:** `npm run build` (o type-check). El sitemap y robots deben seguir apuntando al mismo host. No cambia output.

**Riesgo/rollback:** mínimo. Si algo falla, revertir el import.

**Dependencias:** ninguna. Hacerla primero simplifica las demás, pero no es bloqueante.

---

## FASE 1 — `generateMetadata` por vehículo  🔴 El de mayor impacto

**Objetivo:** que cada ficha tenga `<title>`, `description`, `canonical` y Open Graph propios. Mata los títulos duplicados de todo el catálogo.

**Archivos:**
- `app/vehiculos/[slug]/page.tsx` (agregar `generateMetadata`)
- `lib/seo.ts` (helper opcional para autogenerar description)

**Cambios:**
1. En `app/vehiculos/[slug]/page.tsx`, agregar (junto a `generateStaticParams`):
   ```ts
   import type { Metadata } from 'next'
   import config from '@/config'

   export async function generateMetadata(
     { params }: { params: { slug: string } }
   ): Promise<Metadata> {
     const vehicle = await getVehicleBySlug(params.slug)
     if (!vehicle) return { title: 'Vehículo no encontrado' }

     const titleBase = [vehicle.brand, vehicle.model, vehicle.version, vehicle.year]
       .filter(Boolean).join(' ')
     const title = `${titleBase} usado`
     const description = vehicle.description?.trim()
       || `${titleBase} con ${formatKilometers(vehicle.km)}` +
          `${vehicle.transmission ? `, ${vehicle.transmission}` : ''}` +
          `${vehicle.fuelType ? `, ${vehicle.fuelType}` : ''}. ` +
          `Disponible en Queirolo Autos, Las Condes. ${formatCurrency(vehicle.price)}.`
     const url = `${config.url}/vehiculos/${vehicle.slug}`
     const ogImage = vehicle.images?.[0]

     return {
       title,                       // el template "%s | Queirolo Autos" del layout lo cierra
       description,
       alternates: { canonical: url },
       robots: vehicle.status === 'sold'
         ? { index: true, follow: true }   // sigue indexable (decisión #2a)
         : undefined,
       openGraph: {
         type: 'website',
         url,
         title,
         description,
         images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: titleBase }] : undefined,
       },
       twitter: { card: 'summary_large_image', title, description, images: ogImage ? [ogImage] : undefined },
     }
   }
   ```
2. Nota: el `title` NO incluye `| Queirolo Autos` porque el `template` de `defaultMetadata.title` (`lib/seo.ts:36`) ya lo agrega. Verificar que el layout siga aplicando el template.
3. La OG por imagen real es el _fallback_ hasta la Fase 5 (OG dinámica).

**Validación:**
- Abrir 2-3 fichas → `<title>` y `<meta name="description">` distintos por auto (View Source, no DevTools).
- `<link rel="canonical">` presente y absoluto.
- Compartir en WhatsApp muestra la foto del auto.

**Riesgo/rollback:** bajo. `generateMetadata` es aditivo; si falla, quitar la función y vuelve al heredado.

**Dependencias:** usa `formatCurrency`/`formatKilometers` (ya importados en la página). F0 opcional para `config.url`.

---

## FASE 2 — Listado a Server Component  🔴 Arquitectura

**Objetivo:** que los autos y sus enlaces internos estén en el HTML inicial. Hoy `app/vehiculos/page.tsx` es `'use client'` y trae datos en `useEffect` → Googlebot ve "Cargando vehículos…".

**Estrategia (preserva el filtrado actual):** dividir en
- **Server Component** (`page.tsx`): hace `await getVehicles()` y renderiza el grid completo con los datos ya resueltos.
- **Client Component** (filtros): recibe `initialVehicles` por props y filtra en cliente sobre datos ya cargados.

Al renderizar un Client Component desde un Server Component con props, el HTML inicial **ya incluye** el grid → SEO resuelto sin perder la UX de filtros.

**Archivos:**
- `app/vehiculos/page.tsx` (pasa a Server Component)
- nuevo `components/vehicles/VehicleListingClient.tsx` (mueve la lógica `'use client'` actual)
- `app/vehiculos/layout.tsx` (ya aporta metadata del listado, se mantiene)

**Cambios:**
1. Crear `VehicleListingClient.tsx` con el contenido actual de `VehicleListingContent` (filtros + grid), pero:
   - quitar el `useEffect` que hace `getVehicles()`,
   - recibir `initialVehicles: Vehicle[]` por props e inicializar el estado con eso.
2. `page.tsx` queda:
   ```tsx
   import { getVehicles } from '@/lib/vehicles'
   import { VehicleListingClient } from '@/components/vehicles/VehicleListingClient'

   export default async function VehiculosPage() {
     const vehicles = await getVehicles()
     return (
       <div className="min-h-screen bg-gray-50 py-8">
         <div className="container mx-auto px-4">
           <div className="mb-8">
             <h1 className="mb-2 text-3xl font-bold ...">Nuestros Vehículos</h1>
             <p className="text-lg text-gray-600">Explora nuestro stock actual…</p>
           </div>
           <VehicleListingClient initialVehicles={vehicles} />
         </div>
       </div>
     )
   }
   ```
3. Mantener el `<Suspense>` para `useSearchParams` dentro del client component (sigue siendo necesario).
4. Considerar `revalidate` (ya hay `next: { revalidate: 60 }` en el fetch de Sanity) para que el stock se refresque.

**Validación:**
- View Source de `/vehiculos` → el HTML contiene las cards y los `<a href="/vehiculos/...">` SIN ejecutar JS.
- Los filtros siguen funcionando (marca, precio, año, km, transmisión, combustible).
- La URL sigue reflejando filtros vía query params.

**Riesgo/rollback:** **medio** — toca la página de listado y su interacción. Mitigación: hacerlo en branch propia, probar filtros manualmente. Rollback = volver al `page.tsx` `'use client'` anterior.

**Dependencias:** ninguna técnica. Conviene después de F1 para no mezclar cambios de la misma área.

---

## FASE 3 — Cablear JSON-LD (datos estructurados)  🔴

**Objetivo:** renderizar el structured data que ya existe en `lib/seo.ts` pero nunca se usa. Habilita rich results (precio/disponibilidad).

**Archivos:**
- `lib/seo.ts` (ajustar `generateVehicleSchema`)
- `app/vehiculos/[slug]/page.tsx` (render `Car` + `Breadcrumb`)
- `app/vehiculos/page.tsx` (render `ItemList` — server, tras F2)

**Cambios:**
1. **Ajustar `generateVehicleSchema` (`lib/seo.ts:133`):**
   - `Offer.availability` dinámico por `status`: `available`/`reserved` → `https://schema.org/InStock`; `sold` → `https://schema.org/SoldOut`.
   - **No** incluir `vehicleIdentificationNumber` ni `plate` (decisión #7).
   - Alinear firma con el tipo `Vehicle` real: `image` viene de `vehicle.images[0]` (ya absoluta de Sanity CDN), `engine` está en `vehicle.specs.engine` (puede faltar → omitir si vacío).
2. **En la ficha** (`[slug]/page.tsx`), dentro del render:
   ```tsx
   import { SchemaScript } from '@/components/shared/SchemaScript'
   import { generateVehicleSchema, generateBreadcrumbSchema } from '@/lib/seo'
   ...
   <SchemaScript schema={generateVehicleSchema(vehicle)} />
   <SchemaScript schema={generateBreadcrumbSchema([
     { name: 'Vehículos', url: `${config.url}/vehiculos` },
     { name: `${vehicle.brand} ${vehicle.model}`, url: `${config.url}/vehiculos/${vehicle.slug}` },
   ])} />
   ```
3. **En el listado** (server, tras F2): `<SchemaScript schema={generateVehicleListSchema(vehicles)} />`. Ajustar `generateVehicleListSchema` (`lib/seo.ts:187`) para recibir la lista real por parámetro en vez de `mockVehicles`.

**Validación:** [Rich Results Test](https://search.google.com/test/rich-results) sobre una ficha → detecta `Vehicle`/`Car` + `Offer` + `BreadcrumbList` sin errores. Un auto `sold` debe mostrar `SoldOut`.

**Riesgo/rollback:** bajo. JSON-LD es invisible al usuario; si valida mal, quitar el `<SchemaScript>`.

**Dependencias:** `ItemList` requiere F2 (listado server). El `Car`/`Breadcrumb` de ficha es independiente.

---

## FASE 4 — Sitemap desde Sanity  🔴

**Objetivo:** que el sitemap liste el inventario real, no `mockVehicles`.

**Archivos:** `app/sitemap.ts`

**Cambios:**
1. Reemplazar `import { mockVehicles } from '@/lib/data'` por `import { getVehicles } from '@/lib/vehicles'`.
2. Hacer la función `async` y `const vehicles = await getVehicles()`.
3. **Filtrar:**
   - excluir `status === 'sold'` (la página queda viva e indexable, pero fuera del sitemap — decisión #2a),
   - excluir vehículos sin `slug` o sin imágenes.
4. `priority`: `available`/`reserved` → 0.8 (como hoy).
5. Las rutas estáticas legales: alinear con las que existen (`/privacidad`, `/terminos`, etc.) y revisar que coincidan con `app/` real.

**Validación:** abrir `/sitemap.xml` en dev → aparecen los slugs reales de Sanity, no los mock; ningún `sold`.

**Riesgo/rollback:** bajo. Rollback = volver a mocks.

**Dependencias:** ninguna. F0 opcional para `config.url`.

---

## FASE 5 — OG image dinámica por vehículo (`next/og`)  🟡

**Objetivo:** tarjeta de compartir con foto + precio + datos, en vez de la imagen genérica.

**Archivos:**
- nuevo `app/vehiculos/[slug]/opengraph-image.tsx` (convención de Next App Router)
- `app/vehiculos/[slug]/page.tsx` (la `generateMetadata` de F1 toma esta OG automáticamente si se usa la convención de archivo; si no, referenciar la ruta)

**Cambios:**
1. Crear `opengraph-image.tsx` con `ImageResponse` de `next/og`: fondo, foto del auto (`vehicle.images[0]`), `{Marca} {Modelo} {Año}`, precio formateado y "Queirolo Autos · Las Condes".
2. `size = { width: 1200, height: 630 }`, `contentType = 'image/png'`.
3. Quitar el `images` manual de la OG en `generateMetadata` (F1) si se adopta la convención de archivo (Next la inyecta sola).

**Validación:** `/vehiculos/<slug>/opengraph-image` devuelve PNG; el debugger de Facebook/WhatsApp muestra la tarjeta nueva.

**Riesgo/rollback:** bajo. Borrar el archivo vuelve al fallback de F1 (foto directa).

**Dependencias:** F1.

---

## FASE 6 — FAQ schema en Servicios + tildes del home  🟡

**Objetivo:** rich result de FAQ (gratis, el contenido ya está) y limpiar la metadata del home.

**Archivos:**
- `app/servicios/page.tsx` (FAQ schema)
- `app/page.tsx:17-20` (tildes)

**Cambios:**
1. **Servicios:** definir un array de FAQs con el contenido ya presente (pasos de financiamiento, requisitos de consignación, proceso de parte de pago) y renderizar `<SchemaScript schema={generateFAQSchema(faqs)} />` (`lib/seo.ts:221`). Idealmente mostrar también esas FAQs como contenido visible (acordeón) para coherencia.
2. **Home:** reemplazar el `metadata` hardcodeado con tildes rotas por los valores de `config.seo` (que ya están correctos): 
   ```ts
   export const metadata: Metadata = {
     title: config.seo.title,
     description: config.seo.description,
   }
   ```
   Esto además elimina el título casi-duplicado respecto al `default` del layout (revisar que no quede idéntico; si lo es, diferenciarlo levemente).

**Validación:** Rich Results Test sobre `/servicios` → `FAQPage` ok. View Source del home → tildes correctas.

**Riesgo/rollback:** muy bajo.

**Dependencias:** ninguna.

---

## FASE 7 — Privacidad (`plate`) + filtros `noindex`  🟡

**Objetivo:** (a) que la patente nunca llegue al cliente; (b) evitar catálogo duplicado por URLs con filtros.

**Archivos:**
- `lib/vehicles.ts` (GROQ + mapper)
- `lib/types.ts` (tipo)
- `app/vehiculos/page.tsx` o `layout.tsx` (robots para filtros)

**Cambios:**
1. **Patente:** quitar `plate` de las dos proyecciones GROQ (`getVehicles` y `getVehicleBySlug`, `lib/vehicles.ts:101,151`) y del mapper (`lib/vehicles.ts:86`). Quitar `plate?: string` de `Vehicle` (`lib/types.ts:29`). Verificar que nada lo consuma (grep `\.plate`).
   - _Nota:_ hoy `plate` viaja en el JSON al browser aunque no se muestre. Esto lo elimina de raíz.
2. **Filtros `noindex`:** las URLs tipo `/vehiculos?brand=toyota&priceMin=…` no deben indexarse. Como el filtrado es client-side, agregar en `app/vehiculos/layout.tsx` (o vía `generateMetadata` que lea `searchParams`):
   - canonical fijo a `${config.url}/vehiculos`,
   - cuando haya query params, `robots: { index: false, follow: true }`.
   - Si se mantiene en layout estático, basta el canonical a la URL limpia (Google consolida); el `noindex` condicional requiere leer `searchParams` en un `generateMetadata` de la page.

**Validación:** ningún request a Sanity expone `plate` (Network tab); `/vehiculos?brand=...` tiene canonical a `/vehiculos` limpio.

**Riesgo/rollback:** bajo. Confirmar que ningún componente usa `vehicle.plate` antes de borrarlo.

**Dependencias:** el `noindex` condicional encaja mejor tras F2 (page server).

---

## FASE 8 — Medición + dominio  🟢

**Objetivo:** dejar lista la verificación de Search Console y resolver el contenido duplicado de dominio.

**Archivos / acciones:**
1. **GSC (cuando el cliente lo tenga):** en `lib/seo.ts:92`, poblar `verification.google` desde una env var:
   ```ts
   verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION },
   ```
   Documentar la env var. Sin valor, no rompe.
2. **Dominio (infra, NO código Next):** `queirolo.cl` y `www.queirolo.cl` sirven ambos → contenido duplicado. Configurar en el hosting/DNS un **301 de `queirolo.cl` → `www.queirolo.cl`**. Esto es lo más alto-impacto de toda la lista y vive fuera del repo. Anotar como tarea de infraestructura.

**Validación:** `curl -I https://queirolo.cl` devuelve `301` a `https://www.queirolo.cl`. GSC verifica el sitio.

**Riesgo/rollback:** el redirect es de infra; coordinar con quien administre el DNS/hosting.

**Dependencias:** ninguna en código.

---

## Secuencia recomendada (si se hace por partes)

1. **F1 + F3 (ficha)** — máximo impacto, mismo archivo, juntas tienen sentido.
2. **F4 (sitemap)** — rápido, alto valor de crawleo.
3. **F2 (listado server) + F3 (ItemList)** — arquitectura; la de más cuidado.
4. **F7 (patente + filtros)** — privacidad + limpieza.
5. **F5 (OG dinámica)** + **F6 (FAQ + tildes)** — pulido visible.
6. **F0** en cualquier momento (mejor temprano); **F8** cuando haya acceso a GSC/DNS.

> **Build:** por convención del proyecto, no se buildea tras los cambios salvo pedido explícito. Validar con type-check / dev server.
