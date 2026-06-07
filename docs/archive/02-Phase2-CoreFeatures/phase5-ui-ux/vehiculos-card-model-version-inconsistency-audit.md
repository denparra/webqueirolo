# Auditoría: Modelo y Versión No Visibles en VehicleCard

**Fecha de análisis**: 2026-01-22
**Tipo**: READ-ONLY Analysis → IMPLEMENTADO
**Scope**: /vehiculos (listado) - cards de vehículos
**Estado**: ✅ FIX APLICADO (2026-01-22)

---

## 1. Resumen Ejecutivo

Los campos **Modelo** y **Versión** existen correctamente en el schema de Sanity (`sanity/schemaTypes/vehicle.ts`), se incluyen en la query GROQ (`lib/vehicles.ts:98-99`), y se mapean adecuadamente al tipo `Vehicle` (`lib/types.ts:6,20`). **El problema radica exclusivamente en el componente `VehicleCard.tsx`**, que solo renderiza `brand` y `model` pero omite completamente el campo `version`. Adicionalmente, la página de detalle (`/vehiculos/[slug]`) tampoco muestra el campo `version`. El flujo de datos es correcto; la UI simplemente no lo presenta.

---

## 2. Root Cause Identificado

### Causa Principal: **Omisión en la capa de presentación (UI)**

| Archivo | Línea | Evidencia |
|---------|-------|-----------|
| `components/vehicles/VehicleCard.tsx` | 108-115 | Solo renderiza `{vehicle.brand}` y `{vehicle.model}`, nunca `{vehicle.version}` |
| `app/vehiculos/[slug]/page.tsx` | 62-66 | Solo muestra `{vehicle.brand}`, `{vehicle.model}`, `{vehicle.year}` |

### Flujo de Datos Verificado (OK)

```
Sanity Schema ✅ → GROQ Query ✅ → Mapper ✅ → Vehicle Type ✅ → UI ❌
       ↓               ↓              ↓              ↓           ↓
   model: string    model,        model: '...'   model: string   ⚠️ version
   version: string  version       version: '...' version?: str   NO RENDERIZADO
```

---

## 3. Matriz de Causas Posibles

| Hipótesis | Archivo/Ruta | Verificación | Resultado |
|-----------|--------------|--------------|-----------|
| **Query GROQ omite campos** | `lib/vehicles.ts:88-112` | Revisar query | ✅ INCLUYE `model` (L98) y `version` (L99) |
| **Mapper descarta campos** | `lib/vehicles.ts:32-75` | Revisar mapSanityVehicle | ✅ MAPEA `model` (L39) y `version` (L71) |
| **Tipo Vehicle no incluye** | `lib/types.ts:2-28` | Revisar interface | ✅ INCLUYE `model` (L6) y `version?` (L20) |
| **Mock fallback no tiene version** | `lib/data.ts:5-209` | Revisar mockVehicles | ⚠️ NO INCLUYE `version` - pero embedding version info en `model` |
| **UI omite renderizado** | `components/vehicles/VehicleCard.tsx` | Buscar `version` | ❌ **NO RENDERIZA** - CAUSA CONFIRMADA |
| **Detalle omite renderizado** | `app/vehiculos/[slug]/page.tsx` | Buscar `version` | ❌ **NO RENDERIZA** |

### Cómo Confirmar Cada Hipótesis

1. **Query GROQ**: Abrir `lib/vehicles.ts`, verificar líneas 98-99 contienen `model,` y `version,`
2. **Mapper**: Verificar `mapSanityVehicle()` líneas 39 y 71
3. **UI Card**: Buscar `version` en `VehicleCard.tsx` - no existe ninguna referencia
4. **UI Detail**: Buscar `version` en `[slug]/page.tsx` - no existe ninguna referencia

---

## 4. Recomendación de Fix Mínimo (Sin Implementar)

### 4.1 Fix en VehicleCard.tsx

**Archivo**: `components/vehicles/VehicleCard.tsx`
**Líneas a modificar**: 107-115

**Estado actual** (L107-115):
```tsx
{/* Brand */}
<p className="mb-1 text-xs font-medium uppercase text-gray-600">
    {vehicle.brand}
</p>

{/* Title */}
<h3 className="mb-3 text-lg font-semibold text-gray-900">
    {vehicle.model}
</h3>
```

**Propuesta de cambio**:
```tsx
{/* Brand + Model (Título principal) */}
<h3 className="mb-1 text-lg font-semibold text-gray-900">
    {vehicle.brand} {vehicle.model}
</h3>

{/* Version + Year (Subtítulo) */}
<p className="mb-3 text-sm text-gray-600">
    {vehicle.version && `${vehicle.version} · `}{vehicle.year}
</p>
```

### 4.2 Fix en Página de Detalle

**Archivo**: `app/vehiculos/[slug]/page.tsx`
**Líneas a modificar**: 62-66

**Estado actual**:
```tsx
<p className="mb-1 text-sm font-medium uppercase text-gray-600">
    {vehicle.brand}
</p>
<h1 className="text-3xl font-bold text-gray-900">{vehicle.model}</h1>
<p className="mt-2 text-lg text-gray-600">{vehicle.year}</p>
```

**Propuesta de cambio**:
```tsx
<p className="mb-1 text-sm font-medium uppercase text-gray-600">
    {vehicle.brand}
</p>
<h1 className="text-3xl font-bold text-gray-900">{vehicle.model}</h1>
{vehicle.version && (
    <p className="mt-1 text-lg font-medium text-gray-700">{vehicle.version}</p>
)}
<p className="mt-2 text-lg text-gray-600">{vehicle.year}</p>
```

### 4.3 (Opcional) Actualizar Mock Data

**Archivo**: `lib/data.ts`
**Acción**: Agregar campo `version` a cada vehículo mock para consistencia durante desarrollo sin Sanity.

---

## 5. Recomendación de Mejora UX para Título/Subtítulo

### Formato Propuesto para Card

| Elemento | Contenido | Ejemplo |
|----------|-----------|---------|
| **Título (h3)** | `{brand} {model}` | `FORD F-150` |
| **Subtítulo (p)** | `{version} · {year}` | `3.5 PLATINUM AUTO ECOBOOST 4WD · 2014` |

### Formato Visual Card

```
┌─────────────────────────────────┐
│         [IMAGEN]                │
├─────────────────────────────────┤
│ FORD F-150                      │ ← Título (brand + model)
│ 3.5 PLATINUM AUTO ECOBOOST ·2014│ ← Subtítulo (version + year)
│ ─────────────────────────────── │
│ 📅 2014  🚗 45.000 km  ⚙️ Auto  │ ← Specs rápidas
│ ─────────────────────────────── │
│ $28.990.000                     │
│ o desde $450.000/mes            │
│ [Ver Detalle]  [WhatsApp]       │
└─────────────────────────────────┘
```

### Formato Visual Página Detalle

```
Vehículos / FORD F-150                    ← Breadcrumb

┌─────────────────────────────────────────┐
│ FORD                                    │ ← Brand (small, uppercase)
│ F-150                                   │ ← Model (large, bold)
│ 3.5 PLATINUM AUTO ECOBOOST 4WD          │ ← Version (medium)
│ 2014                                    │ ← Year
├─────────────────────────────────────────┤
│ $28.990.000                             │
└─────────────────────────────────────────┘
```

---

## 6. Checklist de Verificación Post-Fix (Manual)

### En Sanity Studio (/studio)

- [ ] Abrir un vehículo existente
- [ ] Verificar que campo "Modelo" tiene valor (ej: "F-150")
- [ ] Verificar que campo "Versión" tiene valor (ej: "3.5 PLATINUM AUTO ECOBOOST 4WD")
- [ ] Guardar y publicar si hubo cambios

### En /vehiculos (Listado)

- [ ] Navegar a `/vehiculos`
- [ ] Verificar que cada card muestra:
  - Brand + Model como título principal
  - Version + Year como subtítulo (si version existe)
- [ ] Confirmar que cards sin version muestran graceful fallback (solo year)
- [ ] Probar con filtros aplicados - confirma que no afecta visualización

### En /vehiculos/[slug] (Detalle)

- [ ] Abrir un vehículo específico (ej: `/vehiculos/ford-f150-2014`)
- [ ] Verificar que muestra:
  - Brand (uppercase, pequeño)
  - Model (grande, bold)
  - Version (si existe)
  - Year
- [ ] Verificar breadcrumb muestra brand + model
- [ ] Verificar WhatsApp message incluye model (ya lo hace en L35)

### Consola del Navegador

- [ ] Abrir DevTools → Console
- [ ] Navegar a `/vehiculos`
- [ ] Confirmar NO hay errores de "undefined" o "null"
- [ ] Verificar Network tab muestra respuesta Sanity con campos model/version

---

## 7. Riesgos y No-Regresiones

### Checklist de Seguridad Pre-Deploy

| Área | Verificación | Impacto si falla |
|------|--------------|------------------|
| **SEO** | Verificar meta tags en `[slug]/page.tsx` usan model correctamente | Bajo - ya usa model |
| **Filtros** | Los filtros de `/vehiculos` NO dependen de model/version | Nulo - filtran por brand, year, etc. |
| **Detalle Page** | Ya usa model en breadcrumb y WhatsApp msg | Bajo - solo agregar version display |
| **Fallback/Error** | Si version es undefined, mostrar graceful fallback | Medio - usar conditional rendering |
| **Mock Data** | Mock no tiene version, pero producción usa Sanity | Bajo - afecta solo dev local |
| **TypeScript** | `version` ya es opcional (`version?: string`) | Nulo - ya contemplado |
| **WhatsApp Integration** | Mensaje ya incluye brand + model + year | Opcional - podría agregar version |

### Patrón Recomendado para Renderizado Seguro

```tsx
// Safe rendering pattern for optional version
{vehicle.version && (
    <span>{vehicle.version}</span>
)}

// O con fallback explícito
<span>{vehicle.version || ''}</span>
```

### Áreas que NO Deben Modificarse

1. **GROQ Query** (`lib/vehicles.ts`) - Ya funciona correctamente
2. **Mapper** (`mapSanityVehicle`) - Ya mapea correctamente
3. **Vehicle Type** (`lib/types.ts`) - Ya define correctamente
4. **Sanity Schema** (`sanity/schemaTypes/vehicle.ts`) - Ya tiene los campos
5. **Filtros** (`VehicleFilters.tsx`) - No dependen de model/version

---

## 8. Archivos Involucrados (Referencia Rápida)

| Archivo | Rol | Estado | Acción Requerida |
|---------|-----|--------|------------------|
| `sanity/schemaTypes/vehicle.ts` | Schema Sanity | ✅ OK | Ninguna |
| `lib/vehicles.ts` | GROQ + Mapper | ✅ OK | Ninguna |
| `lib/types.ts` | TypeScript Types | ✅ OK | Ninguna |
| `lib/data.ts` | Mock Data | ⚠️ Incompleto | Opcional: agregar version |
| `components/vehicles/VehicleCard.tsx` | Card UI | ❌ Falta | **Agregar version** |
| `app/vehiculos/[slug]/page.tsx` | Detail Page | ❌ Falta | **Agregar version** |
| `app/vehiculos/page.tsx` | List Page | ✅ OK | Ninguna (usa VehicleCard) |

---

## 9. Diagrama de Flujo de Datos

```
┌─────────────────┐
│  Sanity Studio  │
│  (vehicle doc)  │
│  - brand ✓      │
│  - model ✓      │
│  - version ✓    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   GROQ Query    │
│ lib/vehicles.ts │
│  lines 88-112   │
│  brand,model,   │
│  version ✓      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Mapper       │
│mapSanityVehicle │
│  lines 32-75    │
│  model: L39 ✓   │
│  version: L71 ✓ │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Vehicle Object  │
│   (runtime)     │
│  model: "F-150" │
│  version: "3.5  │
│   PLATINUM..."  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   VehicleCard   │  ← PROBLEMA AQUÍ
│  (render)       │
│  {brand} ✓      │
│  {model} ✓      │
│  {version} ❌   │  ← NO RENDERIZADO
└─────────────────┘
```

---

## 10. Conclusión

El análisis confirma que **no hay bug en el flujo de datos** - los campos `model` y `version` fluyen correctamente desde Sanity hasta el componente. La inconsistencia es puramente **una omisión en la capa de UI** donde el componente `VehicleCard.tsx` nunca fue actualizado para mostrar el campo `version`. El fix es mínimo y localizado: agregar `{vehicle.version}` al JSX del card y de la página de detalle, con renderizado condicional para manejar casos donde version sea undefined.

**Tiempo estimado de implementación**: 15-30 minutos
**Riesgo de regresión**: Bajo
**Archivos a modificar**: 2 (VehicleCard.tsx, [slug]/page.tsx)
**Tests recomendados**: Visual QA en /vehiculos y /vehiculos/[slug]
