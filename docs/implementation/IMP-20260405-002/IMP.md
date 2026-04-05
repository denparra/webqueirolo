# IMP-20260405-002 — Rediseño de diseño con Magic: análisis y plan

## Metadatos

| Campo       | Valor |
|-------------|-------|
| **ID**      | IMP-20260405-002 |
| **Fecha**   | 2026-04-05 |
| **Owner**   | denparra |
| **Estado**  | planning |
| **Log ref** | LOG-20260405-002 |
| **Tag git** | `v1-pre-redesign` (respaldo antes de aplicar cambios) |

## Objetivo

Mejorar el diseño visual del sitio usando Magic MCP.  
Prioridad 1: visibilidad de autos en los cards (las imágenes recortan el vehículo).  
Prioridad 2: mejoras generales de UX/UI identificadas en análisis Playwright.

**Restricción**: no romper ninguna página funcional. Solo cambios de presentación.

---

## Análisis técnico — Causa raíz del recorte de autos

### Archivos afectados

| Archivo | Línea | Clase problemática |
|---------|-------|-------------------|
| `components/vehicles/VehicleCard.tsx` | 65 | `aspect-video` |
| `components/home/FeaturedVehicleCard.tsx` | 32 | `aspect-video` |

### Diagnóstico

Ambos componentes usan:
```tsx
<div className="relative aspect-video overflow-hidden">
  <Image ... className="object-cover ..." />
</div>
```

**`aspect-video` = ratio 16:9** → container muy horizontal.  
Las fotos de los autos (tomadas en el showroom de Queirolo) tienen una proporción aproximada de **4:3** o **3:2**.

Con `object-cover` + contenedor 16:9:
- La imagen se escala para llenar el ancho
- El exceso de alto se **recorta** (top + bottom por igual con `object-position: center`)
- Resultado: los techos de los autos y parte inferior quedan cortados

### Evidencia visual

Capturas en `docs/implementation/IMP-20260405-002/screenshots/`:

| Screenshot | Descripción | Issue visible |
|-----------|-------------|---------------|
| `home-cards-destacados.png` | Sección destacados en home (desktop 1440px) | Nissan Kicks: capó/techo cortado arriba. Segunda fila: corte visible |
| `vehiculos-cards-desktop-top.png` | Primera fila /vehiculos (1440px) | Jeep GCh y Changan: lado derecho ligeramente cortado |
| `vehiculos-mobile.png` | /vehiculos mobile (390px) | Card ocupa todo el ancho — menos corte, auto más visible |
| `vehiculos-desktop.png` | Grid completo /vehiculos | Grilla de 3 cols — pattern consistente |
| `home-full.png` | Home completo mobile | Aspecto general |
| `detalle-vehicle-desktop.png` | Página detalle Nissan Kicks | Imagen principal sin crop, buena experiencia |

---

## Opciones de solución — Imagen de vehículo

### Opción A — Cambiar ratio del contenedor (recomendada)
```tsx
// Actual:
<div className="relative aspect-video overflow-hidden">
// Propuesta:
<div className="relative aspect-[4/3] overflow-hidden">
```
**Pros**: mínimo cambio, mantiene `object-cover`, menos crop.  
**Contras**: cards un poco más altos — no ideal para densidad en grid.

### Opción B — `object-contain` + fondo gris claro (mejor para el auto)
```tsx
<div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
  <Image ... className="object-contain ..." />
</div>
```
**Pros**: auto siempre visible completo. Matches con expectativa de cliente.  
**Contras**: puede mostrar fondo de color si imagen tiene bordes blancos.

### Opción C — `object-cover` + `object-position: center 70%`
```tsx
<Image ... className="object-cover object-[center_70%] ..." />
```
**Pros**: prioriza la parte central-baja del auto (donde está el cuerpo).  
**Contras**: no garantiza que el techo siempre aparezca.

### Opción D — Ratio personalizado para autos (mejor UX)
```tsx
<div className="relative aspect-[3/2] overflow-hidden bg-gray-100">
  <Image ... className="object-contain p-2 ..." />
</div>
```
**Pros**: ratio estándar para fotos de autos (3:2 = 66%), padding sutil, auto siempre completo.  
**Contras**: cards un poco más grandes.

**Recomendación**: **Opción B** o **D** para el catálogo. **Opción A** como mínimo riesgo.

---

## Otros hallazgos de diseño (análisis completo)

### 1. Hero Section (`components/home/HeroSection.tsx`)
- ✅ Texto limpio, degradado negro funciona bien
- ✅ CTAs claros ("Ver Vehículos" + "Conocer Nuestra Historia")
- ⚠️ Imagen showroom de fondo — si cambia en el futuro, verificar contraste texto
- 💡 **Mejora posible**: hero con imagen de auto en lugar de showroom (más impactante para un compraventa)

### 2. Stats Bar (Home)
- ✅ 4 stats: 60+, 500+, Las Condes, 100% — bien posicionados
- ✅ Visible en ambos desktop y mobile

### 3. Sección "Autos Destacados" (Home)
- ✅ Grilla de 3 columnas en desktop, fluida en mobile
- ⚠️ **Gap visual grande** después del grid (espacio en blanco excesivo antes del footer en la vista full-page mobile)
- 💡 **Mejora posible**: sección CTA o servicios más cercana al grid de destacados

### 4. Grid `/vehiculos` (Desktop 1440px)
- ✅ Sidebar de filtros a la izquierda, grid de 3 cols a la derecha — bien
- ⚠️ Con sidebar visible, las tarjetas quedan más angostas — el `aspect-video` 16:9 es más agresivo aquí
- 💡 **Mejora posible**: `xl:grid-cols-3` en el grid cuando sidebar activo → mantener 2 cols para más espacio a la imagen

### 5. Card de Vehículo (`VehicleCard.tsx`)
- ✅ Estructura clara: imagen → título → specs → precio → CTA
- ✅ Hover con scale en imagen funciona bien
- ✅ Botones favoritos/comparar on-hover discretos
- ⚠️ Texto CTA "Conocer este Vehículo" — largo para el espacio disponible en mobile
- 💡 **Mejora posible**: "Ver Vehículo" o "Ver Detalles" para cards compactos

### 6. Página de Detalle (`/vehiculos/[slug]`)
- ✅ Imagen principal grande, buena visibilidad (sin crop)
- ✅ Thumbnails en fila inferior
- ✅ Panel lateral con CTAs y calculadora
- ✅ Sin issues visuales evidentes

### 7. Header/Nav
- ✅ Logo visible, nav limpio
- ✅ CTA "Consultar por WhatsApp" verde destacado
- ✅ Responsive: hamburger en mobile

### 8. Mobile general
- ✅ Estructura bien adaptada
- ✅ Cards en columna única se ven bien
- ⚠️ Filtros en modal/drawer — buen patrón pero el botón podría ser sticky

---

## Plan de mejoras (orden de prioridad)

### P1 — Crítico: Visibilidad de autos en cards
**Archivos**: `VehicleCard.tsx:65`, `FeaturedVehicleCard.tsx:32`  
**Cambio**: `aspect-video` → `aspect-[4/3]` + `object-contain` + `bg-gray-50`  
**Riesgo**: bajo — solo CSS/layout, sin lógica  
**Magic**: no necesario, cambio de clase Tailwind

### P2 — Alto: Mejora visual de cards con Magic
**Objetivo**: diseño más premium para los cards de vehículo  
**Magic prompt sugerido**: _"Rediseña este VehicleCard de Next.js/Tailwind para un concesionario de autos. Imagen más prominente (ratio 4:3, contain), badge de precio más visual, especificaciones en iconos compactos, CTA más directo."_  
**Archivos**: `VehicleCard.tsx`, `FeaturedVehicleCard.tsx`

### P3 — Medio: Hero con auto destacado
**Objetivo**: mostrar un auto real en el hero en lugar del showroom  
**Magic prompt sugerido**: _"Hero section para concesionario de autos con imagen de auto a la derecha, texto headline a la izquierda, stats en la parte inferior, dark theme."_

### P4 — Bajo: Ajuste de espaciado sección destacados
**Archivos**: `components/home/FeaturedVehiclesSection.tsx`  
**Cambio**: reducir padding inferior o agregar sección next (servicios/CTA)

---

## Alcance de esta iniciativa

**Solo documentación y respaldo en esta fase.**

Para aplicar cambios:
1. Confirmar opción elegida para P1 con el owner
2. Abrir sub-iniciativa `IMP-20260405-003` para la implementación
3. Aplicar cambios uno por uno con validación en cada paso
4. Playwright test después de cada cambio

**NO aplicar nada sin confirmación explícita del owner.**

---

## Rollback

Tag git: `v1-pre-redesign` → `git checkout v1-pre-redesign` restaura estado completo.

---

## Evidence

Screenshots en `docs/implementation/IMP-20260405-002/screenshots/`:
- `home-full.png` — home completo mobile
- `home-desktop.png` — home viewport desktop
- `home-cards-destacados.png` — cards destacados desktop (crop visible)
- `vehiculos-full.png` — listado completo mobile
- `vehiculos-desktop.png` — listado completo desktop
- `vehiculos-cards-desktop-top.png` — primera fila de cards desktop (crop visible)
- `vehiculos-mobile.png` — listado mobile viewport
- `detalle-vehicle-desktop.png` — detalle vehículo desktop

---

## Definition of Done (para cuando se implemente)

- [ ] Imagen de autos visible completa en cards (sin crop significativo)
- [ ] `npm run lint` ✅
- [ ] `npm run build` ✅
- [ ] Playwright: screenshot antes/después documentados
- [ ] Rutas `/`, `/vehiculos`, `/vehiculos/[slug]` verificadas
- [ ] Logbook actualizado con LOG de implementación
