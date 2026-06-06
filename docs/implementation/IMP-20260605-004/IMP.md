# IMP-20260605-004 — SEO Fases 5-8 (OG, FAQ/tildes, patente/canonical, GSC/dominio)

## Metadatos

| Campo       | Valor |
|-------------|-------|
| **ID**      | IMP-20260605-004 |
| **Fecha**   | 2026-06-05 |
| **Owner**   | denparra |
| **Estado**  | completed |
| **Log ref** | LOG-20260605-005 |
| **Rama**    | `feat/seo-fase5-8-polish` |

## Objetivo

Cerrar el plan SEO con las fases de amplificación y medición: OG por vehículo (5), FAQ schema + tildes del home (6), privacidad de la patente + canonical de filtros (7), y verificación de Search Console + redirect de dominio (8).

## Alcance y resultado por fase

### Fase 5 — OG image por vehículo
- **Intentado:** ruta dinámica `app/vehiculos/[slug]/opengraph-image.tsx` con `next/og` (tarjeta con foto + precio).
- **Bloqueado:** `@vercel/og` crashea **en Windows** al inicializar el módulo (`ERR_INVALID_URL` construyendo la URL `file:` de su fuente por defecto `noto-sans-v27-latin-regular.ttf`). El crash ocurre dentro de la librería, al importar el módulo, **antes** de poder pasar una fuente explícita → no se puede sortear desde el código. Es un bug específico de Windows; en Linux (producción) funcionaría, pero **no se pudo verificar desde el entorno de desarrollo**.
- **Resolución:** se **revirtió a la OG estática con la foto real del vehículo** (comportamiento de la Fase 1 / IMP-20260605-001). Cada auto compartido muestra su propia foto — el 90% del valor, con cero riesgo y verificable. La tarjeta con branding queda como mejora futura a confirmar en Linux.
- **Net en el repo:** sin cambios (la ficha vuelve a su estado previo; se eliminó la ruta OG y las fuentes descargadas).

### Fase 6 — FAQ schema + tildes del home
- `app/servicios/page.tsx`: array `serviciosFaqs` (5 Q&A basadas en el contenido real) + render de `generateFAQSchema` → rich result `FAQPage`.
- `app/page.tsx`: metadata del home pasa a usar `siteConfig.seo.title/description` (con tildes correctas), eliminando el texto hardcodeado con tildes rotas.

### Fase 7 — Privacidad de la patente + canonical de filtros
- **Patente:** `plate` removido de las dos proyecciones GROQ y del mapper en `lib/vehicles.ts`, y del tipo `Vehicle` en `lib/types.ts`. Antes viajaba en el JSON al browser aunque no se mostrara. El campo sigue existiendo en Sanity para uso interno.
- **Filtros:** canonical fijo a `${config.url}/vehiculos` en `app/vehiculos/layout.tsx` → consolida las variantes con filtros (`?brand=…`) **sin** volver dinámica la ruta (se prefirió esto sobre `noindex` condicional, que habría requerido leer `searchParams` y perder el render estático).

### Fase 8 — Search Console + dominio
- **GSC:** `lib/seo.ts` toma `verification.google` de `process.env.NEXT_PUBLIC_GSC_VERIFICATION` (sin valor, Next omite el tag). Listo para activar cuando el cliente tenga acceso.
- **Dominio:** nuevo `middleware.ts` que redirige `queirolo.cl` → `www.queirolo.cl` con `308` permanente (resuelve en código el contenido duplicado por host). Solo actúa sobre el apex exacto; no afecta localhost, previews ni www. Si se prefiere resolver a nivel hosting/DNS, el archivo puede eliminarse.

## Pasos de implementación

- [x] F7: remover `plate` de GROQ (×2), mapper y tipo `Vehicle`. Verificar que nada lo consuma.
- [x] F7: canonical estático del listado en `app/vehiculos/layout.tsx`.
- [x] F6: tildes del home desde `config.seo`.
- [x] F6: FAQ array + `generateFAQSchema` en servicios.
- [x] F8: GSC vía env var en `lib/seo.ts`.
- [x] F8: `middleware.ts` redirect apex → www (308).
- [x] F5: intento OG dinámica → bloqueo por bug de `@vercel/og` en Windows → revert a OG estática con foto.

## Impacto esperado

- **SEO:** rich result de FAQ en servicios; canonical consolida los filtros; home con metadata limpia; redirect de dominio elimina el contenido duplicado (el ítem de mayor impacto del diagnóstico).
- **Privacidad:** la patente deja de exponerse en el payload del cliente.
- **OG:** se mantiene la foto real por vehículo al compartir (sin regresión respecto a Fase 1).

## Riesgos

| Riesgo | Probabilidad | Mitigación |
|--------|-------------|------------|
| OG dinámica rota en producción | eliminado | Se revirtió a OG estática; no se ship la ruta `next/og`. |
| Middleware redirige hosts no deseados | baja | Solo redirige el host apex exacto `queirolo.cl`; verificado que localhost responde 200. |
| Quitar `plate` rompe algún consumidor | baja | Grep previo: ningún componente usa `vehicle.plate`; type-check y build OK. |

## Rollback

- `git revert` del commit de la rama `feat/seo-fase5-8-polish`, o `git reset --hard pre-seo-fase5-8-20260605` (tag de resguardo).
- Para desactivar solo el redirect de dominio: borrar `middleware.ts`.

## Evidencia de validación

- [x] `npx tsc --noEmit` → sin errores en archivos modificados (único error preexistente y ajeno: `__tests__/smoke.test.ts`).
- [x] `npx next lint` sobre archivos modificados → `✔ No ESLint warnings or errors`.
- [x] `npm run build` → `✓ Compiled successfully`, `✓ types`, `✓ 60/60 páginas`, `ƒ Middleware 76.6 kB`.
- [x] Runtime de producción (`next start`) verificado por curl:
  - Ficha `og:image` = foto real de Sanity del auto. ✅
  - `/servicios`: `FAQPage` presente. ✅
  - Home `<title>` con tildes correctas ("Vehículos"). ✅
  - `/vehiculos`: `canonical = https://www.queirolo.cl/vehiculos`. ✅
  - Patente: no viaja al cliente (los matches `plate` son `template`/`templateScripts`/`templateStyles`, clases internas de Next). ✅
  - Middleware no rompe localhost (home 200). ✅

## Definition of Done

- [x] Carpeta `IMP-20260605-004/` con `IMP.md`.
- [x] Registrado en `docs/logbook.md` (LOG-20260605-005).
- [x] Evidencia de validación documentada.
- [x] Impacto, riesgos, rollback y la desviación de F5 documentados.
- [x] Referencias cruzadas log ↔ IMP ↔ plan técnico.

## Pendientes / follow-up

- **OG dinámica (F5):** revisitar la tarjeta con branding con una fuente bundleada, verificando en un entorno Linux (no se pudo confirmar en Windows por el bug de `@vercel/og`).
- **Dominio (F8):** confirmar que el `308` apex→www se comporta bien en el hosting real; alternativamente moverlo a nivel DNS y quitar el middleware.
- **GSC:** activar `NEXT_PUBLIC_GSC_VERIFICATION` cuando el cliente tenga la cuenta.
- **Rutas legales duplicadas** (`/privacidad` vs `/politica-de-privacidad`, `/terminos` vs `/terminos-y-condiciones`): evaluar consolidación.

## Referencias

- `claudedocs/00-Analysis-Planning/2026-06-05-seo-plan-tecnico-implementacion.md`
- `app/servicios/page.tsx`, `app/page.tsx`, `app/vehiculos/layout.tsx`, `lib/seo.ts`, `lib/types.ts`, `lib/vehicles.ts`, `middleware.ts`
- IMP-20260605-001/002/003 (fases previas)
