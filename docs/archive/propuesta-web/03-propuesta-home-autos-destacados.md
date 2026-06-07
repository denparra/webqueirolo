# 03 - Propuesta de Rediseno: HOME + Autos Destacados

## Nueva Estructura del HOME

### Orden de Secciones (Top → Bottom)

```
1. HERO VISUAL         ← Imagen de auto/showroom + overlay + headline + CTA
2. AUTOS DESTACADOS    ← Grid 6+ vehiculos con isFeatured + CTA "Ver todos"
3. POR QUE ELEGIRNOS   ← Features actuales rediseñadas con iconos + stats
4. CATEGORIAS          ← Chips/cards por categoria (SUV, Sedan, Camioneta...)
5. CTA FINAL           ← WhatsApp + Contacto (mantiene seccion actual mejorada)
```

---

## Seccion 1: HERO VISUAL

### Diseno

```
┌──────────────────────────────────────────────────────┐
│  [Imagen de fondo: auto premium o showroom]          │
│  [Gradient overlay: negro→transparente desde abajo]  │
│                                                       │
│           Queirolo Autos                              │
│     Tu proximo auto con la confianza de siempre       │
│                                                       │
│     [🔴 Ver Vehiculos]  [⚪ Conocer Nuestra Historia] │
│                                                       │
│  ──── Stats bar ────────────────────────────────────  │
│  │ 60+ anos │ 500+ autos │ Las Condes │ Financiamos │ │
│  ────────────────────────────────────────────────────  │
└──────────────────────────────────────────────────────┘
```

### Especificaciones

| Propiedad | Valor |
|-----------|-------|
| Background | Imagen estatica (showroom/auto hero) desde `/public/images/hero/` |
| Overlay | `bg-gradient-to-t from-black/70 via-black/30 to-transparent` |
| Altura | `min-h-[70vh] lg:min-h-[80vh]` |
| Titulo | `text-4xl lg:text-6xl font-bold text-white` |
| Subtitulo | `text-lg lg:text-xl text-gray-200` |
| CTAs | 2 botones (mantiene los actuales) |
| Stats bar | Franja inferior con 4 stats animados (counters opcionales) |
| Image | `<Image>` con `priority`, `placeholder="blur"`, `fill`, `object-cover` |

### Imagen Hero

**Opcion A (Recomendada)**: Imagen estatica local en `/public/images/hero/hero-home.webp`
- Ventaja: Control total, no depende de Sanity, se puede optimizar en build
- Se puede generar `blurDataURL` en build time con `plaiceholder` o hardcodear un blur base64

**Opcion B**: Imagen del auto destacado principal desde Sanity
- Ventaja: Dinamica, cambia con el inventario
- Desventaja: Depende de la carga de Sanity, mayor complejidad

### Stats Bar

```tsx
const stats = [
  { value: '60+', label: 'Anos de experiencia' },
  { value: '500+', label: 'Autos vendidos' },
  { value: 'Las Condes', label: 'Santiago, Chile' },
  { value: '100%', label: 'Financiamiento' },
]
```

Estilo: `bg-white/10 backdrop-blur` o `bg-white` segun contraste.

---

## Seccion 2: AUTOS DESTACADOS

### Diseno

```
┌──────────────────────────────────────────────────────┐
│                                                       │
│     ★ Autos Destacados                               │
│     Seleccionados especialmente para ti               │
│                                                       │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                │
│  │ [Image] │ │ [Image] │ │ [Image] │                │
│  │ Badge   │ │ Badge   │ │ Badge   │                │
│  │ Brand   │ │ Brand   │ │ Brand   │                │
│  │ Model   │ │ Model   │ │ Model   │                │
│  │ Yr|Km|T │ │ Yr|Km|T │ │ Yr|Km|T │                │
│  │ $Price  │ │ $Price  │ │ $Price  │                │
│  │ [CTA]   │ │ [CTA]   │ │ [CTA]   │                │
│  └─────────┘ └─────────┘ └─────────┘                │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                │
│  │  ...    │ │  ...    │ │  ...    │                │
│  └─────────┘ └─────────┘ └─────────┘                │
│                                                       │
│              [Ver todo el inventario →]                │
│                                                       │
└──────────────────────────────────────────────────────┘
```

### Fuente de Datos

**Query GROQ para featured vehicles**:

```groq
*[_type == "vehicle" && isFeatured == true && status == "available"] | order(_createdAt desc) [0...6] {
  _id,
  name,
  "slug": slug.current,
  price,
  year,
  mileage,
  transmission,
  fuel,
  brand,
  model,
  version,
  category,
  "image": images[0].asset->url,
  "lqip": images[0].asset->metadata.lqip,
  status
}
```

**Fallback**: Si hay menos de 6 `isFeatured`, completar con los mas recientes:

```groq
*[_type == "vehicle" && status == "available"] | order(isFeatured desc, _createdAt desc) [0...6] {
  ...
}
```

### Componente: `FeaturedVehicleCard`

**Ubicacion**: `components/home/FeaturedVehicleCard.tsx`

**Diferencias con `VehicleCard` existente** (no lo modifica):
- Mas compacto (diseñado para el home, no para listado)
- Incluye `placeholder="blur"` con `blurDataURL` de LQIP
- Sin quick actions (favoritos/comparar) para simplificar
- Badge de categoria o "RECIEN LLEGADO"
- Hover: scale sutil en imagen + shadow

**Props**:
```tsx
interface FeaturedVehicleCardProps {
  vehicle: {
    id: string
    slug: string
    brand: string
    model: string
    version?: string
    year: number
    price: number
    km: number
    transmission: string
    image: string
    lqip?: string
    category?: string
    isNew: boolean
  }
  priority?: boolean  // para las primeras 3 cards
}
```

**Contenido de la card**:
1. **Imagen** (aspect-video, fill, object-cover, blur placeholder)
2. **Badge** (esquina superior izquierda): "RECIEN LLEGADO" o categoria
3. **Brand + Model** (titulo)
4. **Version + Year** (subtitulo)
5. **Specs row**: Ano | Km | Transmision (iconos pequenos)
6. **Precio** (text-2xl font-bold text-primary-600)
7. **CTA**: "Ver detalle" → Link a `/vehiculos/${slug}`

### Comportamiento Hover

```css
/* Card */
hover:shadow-xl hover:border-primary-500 transition-all duration-300

/* Imagen */
group-hover:scale-105 transition-transform duration-300

/* CTA button (opcional) */
group-hover:bg-primary-500 group-hover:text-white
```

### Grid Layout

```
Mobile (< 640px):   1 columna, scroll vertical
Tablet (640-1024):  2 columnas
Desktop (1024+):    3 columnas
```

```tsx
<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
```

### Animaciones

Cada card entra con `FadeIn` + stagger delay:
```tsx
{vehicles.map((vehicle, idx) => (
  <FadeIn delay={idx * 0.1} key={vehicle.id}>
    <FeaturedVehicleCard vehicle={vehicle} priority={idx < 3} />
  </FadeIn>
))}
```

---

## Seccion 3: POR QUE ELEGIRNOS (Rediseno)

### Cambios sobre la seccion actual

| Actual | Propuesto |
|--------|-----------|
| 4 cards iguales con icono | 4 cards con icono + numero/stat destacado |
| Solo texto descriptivo | Titulo + stat + descripcion corta |
| Sin visual hierarchy | Numero grande + icono colorido |

### Ejemplo de card mejorada

```
┌────────────────────┐
│  🛡️                │
│  60+ anos           │
│  Revision Tecnica   │
│  Completa           │
│  Inspeccion previa  │
│  garantizada.       │
└────────────────────┘
```

---

## Seccion 4: CATEGORIAS (Nueva)

### Diseno

```
┌──────────────────────────────────────────────────────┐
│     Explora por Categoria                            │
│                                                       │
│  [SUV]  [Sedan]  [Camioneta]  [Hatchback]  [Coupe]  │
│                                                       │
└──────────────────────────────────────────────────────┘
```

### Implementacion

Chips/pills que linkan a `/vehiculos?category=suv`:

```tsx
const categories = ['SUV', 'Sedan', 'Camioneta', 'Hatchback', 'Coupe', 'Comercial']

<div className="flex flex-wrap justify-center gap-3">
  {categories.map(cat => (
    <Link
      key={cat}
      href={`/vehiculos?category=${cat.toLowerCase()}`}
      className="rounded-full border-2 border-gray-200 px-6 py-2 text-sm font-medium
                 hover:border-primary-500 hover:bg-primary-50 hover:text-primary-600
                 transition-all"
    >
      {cat}
    </Link>
  ))}
</div>
```

**Nota**: Esto requiere que el filtro de categorias funcione en `/vehiculos`. Si no existe, se puede omitir esta seccion en v1 o linkear sin filtro.

---

## Seccion 5: CTA FINAL (Mejora)

Mantiene la estructura actual pero con mejoras:
- Agregar icono de WhatsApp al boton
- Agregar micro-copy de confianza ("Respuesta en minutos")
- Opcional: agregar horarios inline

---

## Archivos Nuevos a Crear

```
components/home/
  HeroSection.tsx              ← Hero con imagen + overlay + stats
  FeaturedVehiclesSection.tsx   ← Seccion completa con query + grid
  FeaturedVehicleCard.tsx       ← Card individual featured
  StatsBar.tsx                  ← Barra de estadisticas
  CategoriesSection.tsx         ← Chips de categorias

lib/
  featured-vehicles.ts          ← Query GROQ + mapper para featured vehicles

public/images/hero/
  hero-home.webp               ← Imagen hero (a proporcionar o generar)
```

## Archivos a Modificar

```
app/page.tsx                   ← Reescribir HOME con las nuevas secciones
```

**NO se modifican**:
- `components/vehicles/VehicleCard.tsx`
- `components/vehicles/VehicleFilters.tsx`
- `components/vehicles/VehicleDetailGallery.tsx`
- `components/layout/Navbar.tsx`
- `components/layout/Footer.tsx`
- `lib/vehicles.ts`
- `lib/types.ts`
- `sanity/schemaTypes/vehicle.ts`
- Ninguna ruta existente
