# 04 - Plan de Implementacion Sin Regresiones

## Principios de Seguridad

1. **Aditivo, no destructivo**: Solo agregar archivos nuevos y modificar `app/page.tsx`
2. **Componentes existentes intocados**: VehicleCard, VehicleFilters, Gallery, Compare, Navbar, Footer
3. **Schema Sanity intocado**: `isFeatured` ya existe, no se necesitan cambios
4. **Rutas intactas**: Ninguna ruta nueva, ninguna ruta modificada
5. **Types existentes preservados**: Nuevo tipo `FeaturedVehicle` separado de `Vehicle`
6. **Feature branch**: Todo el trabajo en branch `feature/home-redesign`
7. **Rollback facil**: Si algo falla, revertir `app/page.tsx` al estado anterior

---

## Fases de Implementacion

### Fase 0: Preparacion (Pre-codigo)

**Objetivo**: Branch + imagen hero + validar campo `isFeatured` en Sanity

| Paso | Accion | Riesgo |
|------|--------|--------|
| 0.1 | `git checkout -b feature/home-redesign` | Ninguno |
| 0.2 | Verificar que hay vehiculos con `isFeatured: true` en Sanity (>= 6) | Ninguno |
| 0.3 | Si no hay 6+ featured, la query usa fallback por recientes | Ninguno |
| 0.4 | Obtener/crear imagen hero y colocar en `public/images/hero/` | Ninguno |

**Validacion Fase 0**:
- [ ] Branch creado
- [ ] Al menos 6 vehiculos con `isFeatured` o la query de fallback funciona
- [ ] Imagen hero disponible

---

### Fase 1: Data Layer (lib/featured-vehicles.ts)

**Objetivo**: Query GROQ aislada para vehiculos destacados con LQIP

**Archivos nuevos**:
- `lib/featured-vehicles.ts`

**Contenido**:

```ts
// lib/featured-vehicles.ts
import { client, projectId } from './sanity'
import { estimateMonthlyPayment } from './calculations'

export interface FeaturedVehicle {
  id: string
  slug: string
  brand: string
  model: string
  version?: string
  year: number
  price: number
  monthlyPayment: number
  km: number
  transmission: string
  category?: string
  image: string
  lqip?: string
  isNew: boolean
}

const FEATURED_QUERY = `
  *[_type == "vehicle" && status == "available"]
  | order(isFeatured desc, _createdAt desc) [0...6] {
    _id,
    "slug": slug.current,
    price,
    year,
    mileage,
    transmission,
    brand,
    model,
    version,
    category,
    "image": images[0].asset->url,
    "lqip": images[0].asset->metadata.lqip,
    status
  }
`

export async function getFeaturedVehicles(): Promise<FeaturedVehicle[]> {
  if (!projectId) {
    console.warn('[getFeaturedVehicles] No Sanity projectId, returning empty')
    return []
  }

  try {
    const results = await client.fetch(FEATURED_QUERY, {}, { next: { revalidate: 60 } })
    return results.map(mapToFeaturedVehicle)
  } catch (error) {
    console.error('Error fetching featured vehicles:', error)
    return []
  }
}

function mapToFeaturedVehicle(raw: any): FeaturedVehicle {
  return {
    id: raw._id,
    slug: raw.slug || '',
    brand: raw.brand || 'N/A',
    model: raw.model || 'N/A',
    version: raw.version,
    year: raw.year || 0,
    price: raw.price || 0,
    monthlyPayment: estimateMonthlyPayment(raw.price || 0),
    km: raw.mileage || 0,
    transmission: raw.transmission || 'N/A',
    category: raw.category,
    image: raw.image || '',
    lqip: raw.lqip,
    isNew: raw.mileage < 100 && raw.year >= new Date().getFullYear(),
  }
}
```

**Validacion Fase 1**:
- [ ] `getFeaturedVehicles()` retorna array de 6 vehiculos
- [ ] Cada vehiculo tiene `image` y `lqip`
- [ ] No modifica ningun archivo existente
- [ ] Build exitoso (`next build`)

---

### Fase 2: Componentes Home (components/home/)

**Objetivo**: Crear componentes presentacionales aislados

**Archivos nuevos**:
- `components/home/HeroSection.tsx`
- `components/home/FeaturedVehiclesSection.tsx`
- `components/home/FeaturedVehicleCard.tsx`
- `components/home/StatsBar.tsx`
- `components/home/CategoriesSection.tsx`

**Orden de creacion**:

#### 2.1 StatsBar.tsx
- Componente puro, sin data fetching
- Props: array de stats
- Render: flex row con dividers

#### 2.2 HeroSection.tsx
- Server component (no 'use client')
- Imagen con `priority`, `placeholder="blur"`
- Gradient overlay
- Titulo + subtitulo + 2 CTAs (Links)
- StatsBar integrado al fondo

#### 2.3 FeaturedVehicleCard.tsx
- Client component (para hover effects)
- Props: `FeaturedVehicle` + `priority`
- Image con `fill`, `sizes`, `placeholder="blur"`, `blurDataURL={lqip}`
- Badge, titulo, specs, precio, CTA link
- Hover: scale imagen + shadow card

#### 2.4 FeaturedVehiclesSection.tsx
- Server component
- Llama a `getFeaturedVehicles()`
- Renderiza grid de `FeaturedVehicleCard`
- Si no hay vehiculos, no renderiza la seccion (graceful degradation)
- Link "Ver todo el inventario" al final

#### 2.5 CategoriesSection.tsx
- Componente puro
- Array de categorias hardcoded (del schema)
- Links a `/vehiculos` (sin filtro de categoria por ahora)

**Validacion Fase 2**:
- [ ] Cada componente se renderiza sin errores en aislamiento
- [ ] FeaturedVehicleCard muestra blur placeholder
- [ ] No se importa nada de `components/vehicles/`
- [ ] Build exitoso

---

### Fase 3: Reescribir app/page.tsx

**Objetivo**: Ensamblar el HOME con las nuevas secciones

**Archivo modificado**:
- `app/page.tsx` (UNICO archivo existente modificado)

**Estructura nueva**:

```tsx
// app/page.tsx
import { HeroSection } from '@/components/home/HeroSection'
import { FeaturedVehiclesSection } from '@/components/home/FeaturedVehiclesSection'
import { CategoriesSection } from '@/components/home/CategoriesSection'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import siteConfig from '@/config'
import { Metadata } from 'next'

// Features section (rediseñada pero inline)
// CTA section (mejorada pero inline)

export const metadata: Metadata = { ... }

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <HeroSection />
      <FeaturedVehiclesSection />
      {/* Features Section - rediseñada */}
      <section>...</section>
      <CategoriesSection />
      {/* CTA Section - mejorada */}
      <section>...</section>
    </div>
  )
}
```

**Validacion Fase 3**:
- [ ] HOME renderiza todas las secciones
- [ ] Autos Destacados muestra 6 vehiculos con imagenes
- [ ] Sin delay visible en imagenes (blur placeholder funciona)
- [ ] Hero tiene imagen de fondo
- [ ] CTAs funcionan (links correctos)
- [ ] Responsive: mobile 1 col, tablet 2 col, desktop 3 col
- [ ] Build exitoso

---

### Fase 4: Validacion de No-Regresion

**Objetivo**: Verificar que NADA existente se rompio

| Test | Comando/Accion | Esperado |
|------|----------------|----------|
| Build | `npm run build` | Sin errores |
| Lint | `npm run lint` | Sin errores nuevos |
| Home | Navegar a `/` | Nuevo HOME funcional |
| Vehiculos | Navegar a `/vehiculos` | Listado + filtros intactos |
| Detalle | Click en un vehiculo | Detalle + galeria intactos |
| Favoritos | Click corazon en listado | Store funciona |
| Comparar | Click comparar | CompareBar funciona |
| Servicios | Navegar a `/servicios` | Pagina intacta |
| Nosotros | Navegar a `/nosotros` | Pagina intacta |
| Contacto | Navegar a `/contacto` | Formulario + mapa intactos |
| WhatsApp | Click FAB WhatsApp | Abre wa.me |
| Mobile nav | Abrir hamburger menu | MobileNav funciona |
| Links home | Click "Ver Vehiculos" en hero | Navega a /vehiculos |
| Links featured | Click card featured | Navega a /vehiculos/[slug] |

**Validacion Fase 4**:
- [ ] Todos los tests pasan
- [ ] `npm run build` sin errores
- [ ] Navegacion completa sin errores en consola

---

### Fase 5: Merge

| Paso | Accion |
|------|--------|
| 5.1 | Commit final con mensaje descriptivo |
| 5.2 | PR `feature/home-redesign` → `main` |
| 5.3 | Review visual en preview deploy (si aplica) |
| 5.4 | Merge |

---

## Resumen de Archivos

### Nuevos (6 archivos)
```
lib/featured-vehicles.ts
components/home/HeroSection.tsx
components/home/FeaturedVehiclesSection.tsx
components/home/FeaturedVehicleCard.tsx
components/home/StatsBar.tsx
components/home/CategoriesSection.tsx
```

### Modificados (1 archivo)
```
app/page.tsx
```

### No Tocados (confirmacion explicita)
```
components/vehicles/*          ← INTACTO
components/layout/*            ← INTACTO
components/shared/*            ← INTACTO
components/animations/*        ← INTACTO (se reusan sin modificar)
components/ui/*                ← INTACTO (se reusan sin modificar)
lib/vehicles.ts                ← INTACTO
lib/types.ts                   ← INTACTO
lib/sanity.ts                  ← INTACTO
sanity/schemaTypes/*           ← INTACTO
app/vehiculos/*                ← INTACTO
app/contacto/*                 ← INTACTO
app/nosotros/*                 ← INTACTO
app/servicios/*                ← INTACTO
app/layout.tsx                 ← INTACTO
next.config.js                 ← INTACTO
tailwind.config.ts             ← INTACTO
config.ts                      ← INTACTO
```

---

## Riesgos y Mitigaciones

| Riesgo | Probabilidad | Mitigacion |
|--------|-------------|------------|
| Menos de 6 vehiculos featured en Sanity | Media | Query con fallback: `order(isFeatured desc, _createdAt desc)` |
| LQIP no disponible para imagenes existentes | Baja | Sanity genera metadata.lqip automaticamente para todas las imagenes |
| Imagen hero no disponible | Media | Usar gradient puro como fallback (similar al actual) |
| Error en fetch de featured vehicles | Baja | Graceful degradation: seccion no se renderiza |
| CLS por carga de imagenes | Baja | `aspect-video` + `fill` + `placeholder="blur"` elimina CLS |
| Hydration mismatch | Baja | Server components para secciones estaticas, client solo para interaccion |

---

## Cronograma Sugerido

| Fase | Duracion Estimada | Dependencias |
|------|------------------|-------------|
| Fase 0: Preparacion | - | Ninguna |
| Fase 1: Data Layer | - | Fase 0 |
| Fase 2: Componentes | - | Fase 1 |
| Fase 3: Ensamblaje HOME | - | Fase 2 |
| Fase 4: Validacion | - | Fase 3 |
| Fase 5: Merge | - | Fase 4 |
