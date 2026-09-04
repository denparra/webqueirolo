# IMP-20260904-001 — Destacados manuales del home

## Objetivo

Hacer que “Autos Destacados” muestre únicamente vehículos seleccionados por el owner mediante `isFeatured`.

## Alcance

- Corregir la consulta pública para eliminar el fallback de vehículos no marcados.
- Añadir una acción administrativa protegida para quitar todos los destacados de una vez.
- Mostrar el estado destacado y permitir filtrarlo en el listado de `/admin/vehiculos`.
- Revalidar el home después de guardar, limpiar o eliminar vehículos.

## Resguardo

El estado previo quedó etiquetado en Git como `pre-manual-featured-20260904`, apuntando al commit `2b42e0c`.

## Validación

- `npm run lint`
- `npm run test` — 24 tests en 4 suites
- `npx tsc --noEmit --pretty false`

## Riesgos y rollback

La limpieza masiva solo cambia `isFeatured` a `false`; no elimina vehículos ni imágenes. El código puede recuperarse desde el tag de resguardo. La acción requiere sesión de administrador y confirmación explícita.
