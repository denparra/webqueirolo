# IMP-20260405-004 — Fix valores N/A en detalle de vehículo

## Metadatos

| Campo       | Valor |
|-------------|-------|
| **ID**      | IMP-20260405-004 |
| **Fecha**   | 2026-04-05 |
| **Owner**   | denparra |
| **Estado**  | completed ✅ |
| **Log ref** | LOG-20260405-004 |

## Objetivo

Eliminar los valores hardcodeados `N/A` en la página de detalle `/vehiculos/[slug]`.  
Mostrar solo los campos que tienen datos reales en Sanity; ocultar condicionalmente los que no están ingresados.

## Causa raíz identificada

Tres causas distintas combinadas:

| Causa | Campos afectados | Solución |
|-------|-----------------|---------|
| Campos no existían en el tipo/schema (`engine`, `power`, `torque`) pero se renderizaban con fallback `'N/A'` | Motor, Potencia, Torque en tab Specs | Remover filas — no hay datos reales |
| Campos existentes en Sanity pero con fallback `'N/A'` en mapper | `transmission`, `fuelType`, `color` | Cambiar fallback a `''` / `undefined`, renderizar condicionalmente |
| Campo `bodyType` existía en schema pero no se fetcheaba en GROQ | Carrocería | Agregar `bodyType` a ambas queries |

Contexto de datos: solo 3 de 38 vehículos tienen `transmission`/`fuel`/`color` ingresados en Sanity Studio. El resto son `null`.

## Cambios aplicados

### `lib/types.ts`

```typescript
// ANTES
export interface VehicleSpecs {
  engine: string      // requerido
  power: string       // requerido
  torque: string      // requerido
  color: string       // requerido
  ...
}

// DESPUÉS
export interface VehicleSpecs {
  engine?: string     // opcional
  power?: string      // opcional
  torque?: string     // opcional
  color?: string      // opcional
  bodyType?: string   // NUEVO
  ...
}
// Vehicle: bodyType?: string (NUEVO a nivel raíz)
```

### `lib/constants/featureLabels.ts` (NUEVO)

Mapa de 40+ claves Sanity → etiquetas legibles en español.  
`getFeatureLabel(value: string): string` — fallback al propio value si no está mapeado.

Ejemplo: `'aire_acondicionado'` → `'Aire Acondicionado'`

### `lib/vehicles.ts`

- Mapper `mapSanityVehicle`:
  - `transmission: sanityVehicle.transmission || ''` (era `|| 'N/A'`)
  - `fuelType: sanityVehicle.fuel || ''` (era `|| 'N/A'`)
  - `color: sanityVehicle.color || undefined` (era `|| 'N/A'`)
  - Removidos: `engine: 'N/A'`, `power: 'N/A'`, `torque: 'N/A'`
  - Agregado: `bodyType: sanityVehicle.bodyType || undefined`
  - Features: `.map(getFeatureLabel)` aplicado para labels legibles
- Queries GROQ: `bodyType` agregado a `getVehicles` y `getVehicleBySlug`

### `app/vehiculos/[slug]/page.tsx`

- Quick specs bar: `grid grid-cols-4` → `flex flex-wrap gap-6`, renderizado condicional para `transmission` y `fuelType`
- Tab Especificaciones:
  - Removidas filas Motor, Potencia, Torque (hardcodeadas N/A)
  - Agregadas condicionalmente: Transmisión, Combustible, Puertas (`> 0`), Color, Carrocería, Categoría, Motor (solo si `specs.engine` existe)
  - Agregado import `TagIcon`

## Validación

| Check | Resultado |
|-------|-----------|
| `npm run lint` | ✅ No warnings/errors |
| Nissan Kicks (sin datos opcionales) | ✅ Solo Año + Km en quick bar; solo Año/Km/Tracción/Asientos/Puertas en tab |
| Vehículo con transmisión ingresada | ✅ Muestra campo Transmisión |
| Tab Características | ✅ Keys `aire_acondicionado` → `Aire Acondicionado` via featureLabels |
| Motor/Potencia/Torque N/A | ✅ Eliminados — no aparecen |

## Nota para el owner

Los campos Transmisión, Combustible, Color, Categoría y Carrocería aparecerán en el detalle **solo para los vehículos que los tengan ingresados** en Sanity Studio. Para los 35 vehículos que actualmente no tienen estos datos, es recomendable ir a Sanity Studio y completar los campos correspondientes.

## Rollback

`git checkout v1-pre-redesign -- lib/ app/vehiculos/` restaura el estado pre-cambios.
