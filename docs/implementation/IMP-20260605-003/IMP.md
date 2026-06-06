# IMP-20260605-003 — SEO Fase 4 (sitemap desde Sanity)

## Metadatos

| Campo       | Valor |
|-------------|-------|
| **ID**      | IMP-20260605-003 |
| **Fecha**   | 2026-06-05 |
| **Owner**   | denparra |
| **Estado**  | completed |
| **Log ref** | LOG-20260605-004 |
| **Rama**    | `feat/seo-fase4-sitemap-sanity` |

## Objetivo

Que `/sitemap.xml` declare el inventario real de vehículos (desde Sanity) en vez de los datos mock estáticos. Antes le declaraba a Google URLs falsas/viejas y le ocultaba el stock real.

## Alcance

**Incluye:**
- `app/sitemap.ts` — pasa a `async`, obtiene vehículos con `getVehicles()`, filtra `sold` y registros sin slug/imágenes, `revalidate = 60`. Se agrega `/contacto` a las páginas estáticas (faltaba).

**Excluye:**
- OG dinámica (Fase 5), FAQ/tildes (Fase 6), patente/filtros (Fase 7), GSC/dominio (Fase 8).
- Consolidación de rutas legales duplicadas (`/privacidad` vs `/politica-de-privacidad`, `/terminos` vs `/terminos-y-condiciones`) — se mantiene la elección previa del sitemap; se documenta como pendiente menor.

## Pasos de implementación

- [x] Reemplazar `import { mockVehicles }` por `import { getVehicles }`.
- [x] `sitemap()` → `async`, `await getVehicles()` dentro de try/catch (si Sanity falla, devuelve solo las estáticas).
- [x] Filtrar: `slug` presente, `status !== 'sold'`, `images.length > 0`.
- [x] `export const revalidate = 60`.
- [x] Agregar `/contacto` a las páginas estáticas.

## Impacto esperado

- **SEO/crawleo:** Google recibe los 42 vehículos reales publicados en Sanity. Los vendidos no se incluyen (siguen indexables vía su propia página, pero no son prioridad de re-crawl — decisión #2a). Se añade `/contacto`.
- **Resiliencia:** si Sanity falla, el sitemap responde igual con las páginas estáticas.

## Riesgos

| Riesgo | Probabilidad | Mitigación |
|--------|-------------|------------|
| Fallo de Sanity deja el sitemap vacío de vehículos | baja | try/catch → devuelve estáticas; `revalidate=60` reintenta. |
| Inconsistencia entre filtro del sitemap y el listado | baja | Mismo `getVehicles()` que el listado; verificado: 42 = 42. |

## Rollback

- `git revert` del commit de la rama `feat/seo-fase4-sitemap-sanity`, o
- `git reset --hard pre-seo-fase4-20260605` (tag de resguardo), o restaurar `app/sitemap.ts` a la versión con `mockVehicles`.

## Evidencia de validación

- [x] `npx tsc --noEmit` → sin errores en `app/sitemap.ts` (único error preexistente y ajeno: `__tests__/smoke.test.ts`).
- [x] `npx next lint --file app/sitemap.ts` → `✔ No ESLint warnings or errors`.
- [x] Runtime (`next dev`) — `GET /sitemap.xml` 200: 50 URLs = 8 estáticas (incluye `/contacto`) + 42 fichas con slugs reales de Sanity (bmw-x3-…, ford-explorer-…). Sin URLs de `cdn.sanity`. Coincide con los 42 del listado.
- [x] `npm run build` NO reejecutado (ya validado en IMP-20260605-002; cambio acotado a una ruta de servidor).

## Definition of Done

- [x] Carpeta `IMP-20260605-003/` con `IMP.md`.
- [x] Registrado en `docs/logbook.md` (LOG-20260605-004).
- [x] Evidencia de validación documentada.
- [x] Impacto, riesgos y rollback documentados.
- [x] Referencias cruzadas log ↔ IMP ↔ plan técnico.

## Referencias

- `claudedocs/00-Analysis-Planning/2026-06-05-seo-plan-tecnico-implementacion.md` (Fase 4)
- `app/sitemap.ts`, `lib/vehicles.ts`
- IMP-20260605-001, IMP-20260605-002 (previos)
