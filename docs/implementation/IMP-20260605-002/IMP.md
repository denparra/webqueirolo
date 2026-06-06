# IMP-20260605-002 — SEO Fase 2 (listado a Server Component) + Fase 3 (JSON-LD)

## Metadatos

| Campo       | Valor |
|-------------|-------|
| **ID**      | IMP-20260605-002 |
| **Fecha**   | 2026-06-05 |
| **Owner**   | denparra |
| **Estado**  | completed |
| **Log ref** | LOG-20260605-002 |
| **Rama**    | `feat/seo-fase2-3-listado-server-jsonld` |

## Objetivo

Continuar el plan SEO (`claudedocs/00-Analysis-Planning/2026-06-05-seo-plan-tecnico-implementacion.md`): que el listado de vehículos se renderice en el servidor (los autos y sus enlaces internos deben estar en el HTML inicial, no tras ejecutar JS) y cablear los datos estructurados JSON-LD que ya existían en `lib/seo.ts` pero nunca se usaban (`Car` + `Offer`, `ItemList`, `BreadcrumbList`).

## Alcance

**Incluye:**
- `app/vehiculos/page.tsx` — convertido de Client Component a **Server Component**: hace `getVehicles()` en el servidor y pasa los datos al cliente.
- `components/vehicles/VehicleListingClient.tsx` — **nuevo**; contiene la lógica de filtros (antes en `page.tsx`), recibe `initialVehicles` por props, sin `fetch` en `useEffect`.
- `lib/seo.ts` — `generateVehicleSchema` recibe el tipo `Vehicle`, `availability` dinámica por `status`, sin VIN/patente, imagen ya absoluta; `generateVehicleListSchema` recibe la lista real por parámetro.
- `app/vehiculos/[slug]/page.tsx` — renderiza `Car` + `BreadcrumbList`.
- `app/vehiculos/page.tsx` — renderiza `ItemList`.

**Excluye:**
- OG dinámica `next/og` (Fase 5), FAQ/tildes (Fase 6), patente/filtros `noindex` (Fase 7), GSC/dominio (Fase 8).
- Cambios visuales o de UX en el listado (la grilla y los filtros se preservan idénticos).

## Pasos de implementación

- [x] Crear `VehicleListingClient.tsx` con la lógica de filtros + URL sync; quitar fetch/loading/error de cliente; recibir `initialVehicles` y `loadError` por props.
- [x] Reescribir `app/vehiculos/page.tsx` como Server Component (`async`), con `getVehicles()` en try/catch y `export const revalidate = 60` (ISR).
- [x] Renderizar `<SchemaScript schema={generateVehicleListSchema(vehicles)} />` en el listado (servidor).
- [x] Ajustar `generateVehicleSchema(vehicle: Vehicle)`: `availability` (`sold`→SoldOut, resto→InStock), sin `vehicleIdentificationNumber`/`plate`, `image = images[0]` (ya absoluta), campos opcionales condicionales.
- [x] Ajustar `generateVehicleListSchema(vehicles: Vehicle[])` (deja de usar `mockVehicles`).
- [x] Renderizar `Car` + `BreadcrumbList` en la ficha de detalle.

## Impacto esperado

- **SEO (listado):** los 42 vehículos y sus enlaces internos a fichas quedan en el HTML inicial (antes solo "Cargando vehículos…"). Mejora descubrimiento del catálogo y flujo de autoridad hacia las fichas.
- **SEO (datos estructurados):** `ItemList` en el listado; `Car` + `Offer` (precio, disponibilidad) + `BreadcrumbList` en la ficha → habilita rich results.
- **UX:** sin cambios. Los filtros (marca, precio, año, km, transmisión, combustible) y el sync a URL se preservan.

## Notas de implementación

- **Patrón clave:** un Client Component renderizado desde un Server Component con props se server-renderiza con esos datos en el HTML inicial. Así se gana SEO sin perder el filtrado client-side.
- **`availability`:** solo `status === 'sold'` marca `SoldOut`; `available`/`reserved` siguen `InStock` (no había vehículos `sold` en Sanity al validar → camino `SoldOut` verificado por código/tipos, no en vivo).
- **Privacidad (#7):** el schema `Car` se construye explícitamente sin VIN ni patente (verificado en runtime: `hasVIN: false`, `hasPlate: false`).

## Riesgos

| Riesgo | Probabilidad | Mitigación |
|--------|-------------|------------|
| Regresión en filtros tras mover la lógica a otro componente | media | Verificado en producción: filtro de marca BMW → "Mostrando 2 de 42", URL `?brand=bmw`. |
| Fallo de carga de Sanity en el servidor rompe la página | baja | `try/catch` en la page → `loadError` muestra el mensaje amigable (mismo UX que antes). |
| Error de hidratación visto en `dev` | descartado | Era el bug conocido de Next 14.2 `experimental.instrumentationHook` + HMR (dev-only). El build de producción y el runtime de producción funcionan sin errores. |

## Rollback

- `git revert` del commit de la rama `feat/seo-fase2-3-listado-server-jsonld`, o
- `git reset --hard pre-seo-20260605` (tag de resguardo del estado previo a toda la iniciativa SEO).
- Restaurar `app/vehiculos/page.tsx` a su versión `'use client'` previa y borrar `VehicleListingClient.tsx`.

## Evidencia de validación

- [x] `npx tsc --noEmit` → sin errores en archivos modificados (único error preexistente y ajeno: `__tests__/smoke.test.ts`).
- [x] `npx next lint` sobre archivos modificados → `✔ No ESLint warnings or errors`.
- [x] **`npm run build` → `✓ Compiled successfully`, `✓ checking validity of types`, `✓ Generating static pages (60/60)`** (incluye `/vehiculos` y las 43 fichas). *Build ejecutado de forma excepcional por tratarse de un cambio de arquitectura que va a producción; el error de hidratación en dev requería confirmar el comportamiento real de producción.*
- [x] Runtime de producción (`next start`) verificado en navegador:
  - `/vehiculos`: 42 enlaces a fichas en HTML, `ItemList` (42 ítems), hidratación sin errores, 25 inputs de filtro.
  - Filtro de marca BMW: "Mostrando 2 de 42 vehículos", URL `?brand=bmw`.
  - Ficha (`ford-f-150-…-2014`): JSON-LD `Car` (availability InStock, precio CLP, sin VIN, sin patente) + `BreadcrumbList`.

## Definition of Done

- [x] Carpeta `IMP-20260605-002/` con `IMP.md`.
- [x] Registrado en `docs/logbook.md` (LOG-20260605-002).
- [x] Evidencia de validación documentada (lint, type-check, build, runtime de producción).
- [x] Impacto, riesgos y rollback documentados.
- [x] Referencias cruzadas log ↔ IMP ↔ plan técnico completas.

## Referencias

- `claudedocs/00-Analysis-Planning/2026-06-05-seo-plan-tecnico-implementacion.md` (plan por fases)
- `app/vehiculos/page.tsx`, `components/vehicles/VehicleListingClient.tsx`, `lib/seo.ts`, `app/vehiculos/[slug]/page.tsx`
- IMP-20260605-001 (fases 0-1, previo)
