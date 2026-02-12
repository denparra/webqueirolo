# 00 - Overview y Objetivos del Rediseno HOME

## Stack Tecnologico Detectado

| Capa | Tecnologia | Version |
|------|-----------|---------|
| Framework | Next.js (App Router) | ^14.1.0 |
| UI | React | ^18.2.0 |
| Styling | Tailwind CSS + CVA | ^3.4.0 |
| CMS | Sanity (next-sanity) | ^4.22.0 |
| Animaciones | Framer Motion | ^11.18.2 |
| State | Zustand | ^5.0.10 |
| Imagenes | next/image + @sanity/image-url + sharp | - |
| UI Primitives | Radix UI (Dialog, Select, Slider, Tabs, Slot) | - |
| Monitoring | Sentry (@sentry/nextjs) | ^10.34.0 |
| Maps | Leaflet + react-leaflet | - |
| Analytics | Google Analytics (custom component) | - |

## Estructura de Paginas (App Router)

```
app/
  page.tsx            ← HOME (objetivo del rediseno)
  layout.tsx          ← Layout global (Navbar + Footer + WhatsApp + CompareBar)
  globals.css         ← Variables CSS + gradients + utilities
  vehiculos/
    page.tsx          ← Listado con filtros (client component)
    [slug]/           ← Detalle de vehiculo
  contacto/           ← Formulario + mapa
  nosotros/           ← Historia de la empresa
  servicios/          ← Financiamiento, consignacion, parte de pago
  privacidad/         ← Politica de privacidad
  terminos/           ← Terminos y condiciones
  studio/             ← Sanity Studio embebido
  api/                ← API routes
```

## Componentes Clave

```
components/
  vehicles/
    VehicleCard.tsx           ← Card principal (Image, badge, quick actions, specs, price, CTA)
    VehicleDetailGallery.tsx  ← Galeria con lightbox
    VehicleGalleryLightbox.tsx ← Modal fullscreen con zoom
    VehicleFilters.tsx        ← Sidebar de filtros
    CompareBar.tsx            ← Barra comparador
    CompareModal.tsx          ← Modal comparador
  layout/
    Navbar.tsx                ← Header sticky con top bar + nav + WhatsApp CTA
    Footer.tsx                ← Footer 4-col
    MobileNav.tsx             ← Menu mobile
  animations/
    FadeIn.tsx                ← Wrapper framer-motion (opacity)
    SlideUp.tsx               ← Wrapper framer-motion (slide)
  shared/
    WhatsAppButton.tsx        ← FAB flotante
    Vehicle360Viewer.tsx      ← Placeholder 360
    SchemaScript.tsx          ← JSON-LD structured data
  ui/
    button.tsx, card.tsx, dialog.tsx, input.tsx, select.tsx, slider.tsx, tabs.tsx
  home/                       ← VACIO (no hay componentes home aun)
```

## Fuente de Datos

- **CMS**: Sanity con `images[].asset->url` (URLs directas de CDN: `cdn.sanity.io`)
- **Imagenes remotas**: Configuradas en `next.config.js` con `remotePatterns`
- **Formatos**: webp + avif habilitados
- **Cache**: `minimumCacheTTL: 31536000` (1 ano)
- **Revalidacion**: `{ next: { revalidate: 60 } }` en fetch
- **Fallback**: Mock data cuando no hay Sanity projectId

## Schema Sanity - Vehicle

- Campo `isFeatured` (boolean) → YA EXISTE en schema, se usa en queries GROQ
- Campo `status`: available | reserved | sold
- Campo `images`: array de image con hotspot
- No se usa `urlFor()` con transformaciones en el frontend → se usa URL cruda del asset

## Objetivos del Rediseno

### Objetivo Principal
Modernizar el HOME de Queirolo Autos con un look premium automotriz, mejorar la experiencia de carga de imagenes, e incorporar una seccion "Autos Destacados" con minimo 6 vehiculos.

### Objetivos Especificos

1. **Performance**: Eliminar delay visible en carga de imagenes
2. **UI/UX**: Jerarquia visual clara, interactividad moderna, responsive impecable
3. **Autos Destacados**: Seccion con cards ricas (precio, ano, kms, badge, CTA)
4. **Seguridad funcional**: Cero regresiones en navegacion, listados, detalle, filtros
5. **Tendencias**: Alinear con estetica de sitios automotrices premium (hero visual, cards con hover effects, scroll animations)

### Restricciones

- NO modificar: VehicleCard, VehicleFilters, VehicleDetailGallery, CompareBar, CompareModal
- NO modificar: rutas existentes ni su comportamiento
- NO modificar: Sanity schema (ya tiene `isFeatured`)
- PUEDE modificar: `app/page.tsx` (home), crear componentes en `components/home/`
- PUEDE agregar: nuevas queries GROQ para featured vehicles
- PUEDE agregar: componentes de animacion y UI auxiliares
