# IMP-20260405-003 — Implementación de mejoras de diseño (Magic MCP)

## Metadatos

| Campo       | Valor |
|-------------|-------|
| **ID**      | IMP-20260405-003 |
| **Fecha**   | 2026-04-05 |
| **Owner**   | denparra |
| **Estado**  | in-progress |
| **Log ref** | LOG-20260405-003 |
| **Basado en** | IMP-20260405-002 (análisis) |
| **Tag respaldo** | `v1-pre-redesign` |

## Objetivo

Aplicar las mejoras de diseño identificadas en IMP-20260405-002:
- P1: Corregir crop de imágenes de autos en cards
- P2: Rediseño visual de VehicleCard con Magic MCP
- P3/P4: Mejoras de hero y espaciado en home

## Cambios aplicados

| # | Archivo | Cambio | Estado |
|---|---------|--------|--------|
| P1a | `components/vehicles/VehicleCard.tsx` | `aspect-video` → `aspect-[4/3]` + `object-contain` + `bg-gray-50` | ✅ |
| P1b | `components/home/FeaturedVehicleCard.tsx` | Mismo cambio | ✅ |
| P2 | `components/vehicles/VehicleCard.tsx` | Rediseño: border fino + shadow-sm, spec row limpia (sin año duplicado), CTA "Ver Vehículo", padding compacto, badge estilo mejorado | ✅ |
| P2b | `components/home/FeaturedVehicleCard.tsx` | Consistencia visual con VehicleCard: border fino, badge con shadow, specs sin duplicados, separador en precio | ✅ |
| P3 | `components/home/HeroSection.tsx` | Pendiente próxima iteración | ⏸️ |
| P4 | `components/home/FeaturedVehiclesSection.tsx` | `py-16 lg:py-24` → `py-10 lg:py-16`, subtítulo más compacto | ✅ |

## Validación

| Check | Resultado |
|-------|-----------|
| `npm run lint` | ✅ No warnings/errors |
| `/vehiculos` desktop 1440px | ✅ Autos completamente visibles |
| `/vehiculos` mobile 390px | ✅ Cards responsive |
| Home "Autos Destacados" | ✅ Cards sin crop |
| `/vehiculos/[slug]` detalle | ✅ Sin cambios, funciona igual |
| Error de consola | ⚠️ Solo warning LCP priority (pre-existente, no causado por cambios) |

**Estado**: completed ✅

## Screenshots de evidencia

| Archivo | Descripción |
|---------|-------------|
| `BEFORE-vehiculos-cards-desktop-top.png` | Cards ANTES — crop visible en Nissan Kicks, Jeep GCh |
| `AFTER-vehiculos-cards-final.png` | Cards DESPUÉS — autos completos sin crop |
| `BEFORE-home-cards-destacados.png` | Home destacados ANTES — crop en fila superior |
| `AFTER-home-destacados-final.png` | Home destacados DESPUÉS — autos completos |

Todos los screenshots en `docs/implementation/IMP-20260405-002/screenshots/`

## Rollback

`git checkout v1-pre-redesign -- components/` restaura todos los componentes al estado pre-rediseño.
