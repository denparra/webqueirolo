# IMP-20260405-005 — Optimización de carga de imágenes

## Metadatos

| Campo       | Valor |
|-------------|-------|
| **ID**      | IMP-20260405-005 |
| **Fecha**   | 2026-04-05 |
| **Owner**   | denparra |
| **Estado**  | completed ✅ |
| **Log ref** | LOG-20260405-005 |

## Objetivo

Reducir el delay visible al cargar imágenes de vehículos. Causa raíz: Next.js Image Optimizer descargaba imágenes full-res (hasta ~5 MB) de Sanity CDN en cada cold-cache hit para procesarlas server-side.

## Cambios aplicados

### P1 — Sanity CDN image transform (impacto mayor)

**`lib/vehicles.ts`** y **`lib/featured-vehicles.ts`**:

Agregada función helper `applySanityTransform(url, width, quality)` que añade parámetros de transformación a la URL de Sanity CDN:
```
https://cdn.sanity.io/...foto.jpg?w=800&q=80&auto=format&fit=max
```

- `image` (card): `w=800` — suficiente para cards en cualquier resolución
- `images[]` (gallery/lightbox): `w=1200` — calidad adecuada para pantalla completa
- `featured image`: `w=800`

Resultado: Next.js Image Optimizer recibe ~150-300 KB en lugar de ~2-5 MB → cold-cache hit mucho más rápido.

### P2 — LQIP blur placeholder en VehicleCard

**`lib/vehicles.ts`** (ambas queries GROQ):
```groq
"lqip": images[0].asset->metadata.lqip
```

**`lib/types.ts`**: `lqip?: string` agregado a `Vehicle`

**`components/vehicles/VehicleCard.tsx`**:
```tsx
placeholder={vehicle.lqip ? 'blur' : undefined}
blurDataURL={vehicle.lqip}
```

Resultado: en lugar de espacio en blanco, el usuario ve un blur suave mientras carga la imagen real. `FeaturedVehicleCard` ya lo tenía — ahora ambos son consistentes.

### P3 — `sizes` en VehicleDetailGallery

**`components/vehicles/VehicleDetailGallery.tsx`**:
- Main image: `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 66vw"`
- Thumbnails: `sizes="25vw"` (están en grid de 4 columnas)

Eliminados warnings de consola pre-existentes. Next.js ahora genera la variante responsive correcta en lugar de asumir `100vw`.

Adicionalmente: `object-cover` → `object-contain` + `bg-gray-50` en main image y thumbnails, para consistencia con el fix de crop de IMP-003.

### P4 — `priority` en primeras 4 cards de /vehiculos

**`components/vehicles/VehicleCard.tsx`**: prop `priority?: boolean` agregada  
**`app/vehiculos/page.tsx`**: `priority={idx < 4}` para las primeras 4 cards

Resultado: las cards above-the-fold no esperan al lazy loader — se pre-cargan junto con el resto del LCP de la página.

## Validación

| Check | Resultado |
|-------|-----------|
| `npm run lint` | ✅ No warnings/errors |
| TypeScript (types.ts) | ✅ `lqip?: string` compatible con todo |
| URLs transform (placeholder data URI) | ✅ `url.startsWith('data:')` → skip |
| URLs con params existentes | ✅ `url.includes('?')` → skip |
| FeaturedVehicleCard LQIP | ✅ Sin cambios — ya funcionaba correctamente |

## Rollback

```bash
git checkout HEAD -- lib/vehicles.ts lib/featured-vehicles.ts lib/types.ts \
  components/vehicles/VehicleCard.tsx \
  components/vehicles/VehicleDetailGallery.tsx \
  app/vehiculos/page.tsx
```
