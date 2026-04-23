# docs/logbook.md — Bitácora de decisiones y cambios

Registra solo cambios relevantes (no ruido operativo cotidiano).

**Taxonomía:** `DECISION` | `PLAN` | `ACTION` | `TEST` | `RISK` | `BLOCKER` | `SECURITY` | `INCIDENT`

**Formato de ID:** `LOG-YYYYMMDD-XXX` (contador diario, 3 dígitos)

---

## Entradas

---

### LOG-20260422-002

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260422-002 |
| **Fecha**       | 2026-04-22 |
| **Tipo**        | TEST |
| **Contexto**    | Verificación posterior a la inclusión de galería con lightbox en la sección de consignación. |
| **Acuerdo/resultado** | `npm run lint` ejecutado con resultado exitoso (`✔ No ESLint warnings or errors`). |
| **Impacto**     | Confirma consistencia de tipado/estilo sin afectar funcionalidad existente de formularios ni API. |
| **Siguiente paso** | Validar visualmente `/servicios#consignacion` en desktop y móvil. |
| **Referencias** | `app/servicios/page.tsx`, `components/services/ConsignmentDesignGallery.tsx` |

---

### LOG-20260422-001

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260422-001 |
| **Fecha**       | 2026-04-22 |
| **Tipo**        | ACTION |
| **Contexto**    | Solicitud de incluir diseños de consignación en `/servicios` sin romper la funcionalidad existente. |
| **Acuerdo/resultado** | Completado. Se añadió una galería de consignación con vista ampliada (lightbox), navegación entre imágenes y accesos por clic/teclado, limitada al tab de consignación. Se mantuvo intacta la lógica de `ConsignmentForm` y `POST /api/submit-lead`. |
| **Impacto**     | Cambio solo de presentación dentro de la sección de consignación. No hay cambios en rutas, backend ni payload de leads. |
| **Siguiente paso** | Si se agregan más diseños, solo actualizar el arreglo `images` en `app/servicios/page.tsx`. |
| **Referencias** | `app/servicios/page.tsx`, `components/services/ConsignmentDesignGallery.tsx`, `public/images/consignacion/c1.png`, `public/images/consignacion/c2.png` |

---

### LOG-20260405-005

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260405-005 |
| **Fecha**       | 2026-04-05 |
| **Tipo**        | ACTION |
| **Contexto**    | Delay visible al cargar imágenes de autos. Causa: Next.js Image Optimizer descargaba imágenes full-res (~2-5 MB) desde Sanity CDN en cada cold-cache hit. |
| **Acuerdo/resultado** | Completado. P1: `applySanityTransform()` en `vehicles.ts` y `featured-vehicles.ts` — URLs con `?w=800/1200&q=80&auto=format&fit=max` reducen payload 80-90%. P2: LQIP `blurDataURL` añadido a `VehicleCard` (ya existía en `FeaturedVehicleCard`). P3: `sizes` añadido a `VehicleDetailGallery` main + thumbnails — elimina warnings de consola. P4: `priority={idx < 4}` en primeras 4 cards de `/vehiculos`. Lint: ✅. |
| **Impacto**     | Solo cambios en data-fetching (GROQ + mapper) y props de `next/image`. Sin cambios a rutas, lógica de negocio ni UI visual. |
| **Siguiente paso** | Verificar en producción que Sanity CDN responde los params de transformación correctamente. |
| **Referencias** | `IMP-20260405-005/IMP.md`, `lib/vehicles.ts`, `lib/featured-vehicles.ts`, `lib/types.ts`, `VehicleCard.tsx`, `VehicleDetailGallery.tsx` |

---

### LOG-20260405-004

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260405-004 |
| **Fecha**       | 2026-04-05 |
| **Tipo**        | ACTION |
| **Contexto**    | Valores N/A aparecían en la página de detalle `/vehiculos/[slug]` — Motor, Potencia, Torque siempre N/A; Transmisión/Combustible/Color N/A para la mayoría de vehículos. |
| **Acuerdo/resultado** | Completado. Tres causas resueltas: (1) Filas Motor/Potencia/Torque removidas — no hay datos en Sanity. (2) Fallbacks `'N/A'` → `''`/`undefined` + render condicional para transmission/fuelType/color/bodyType. (3) `bodyType` agregado a queries GROQ. Se creó `lib/constants/featureLabels.ts` con 40+ mapeos para que las características del tab muestren labels legibles en español. Lint: ✅. |
| **Impacto**     | Solo cambios de presentación y mapper. Sin cambios a rutas, schema de Sanity ni lógica de negocio. |
| **Siguiente paso** | Owner ingresa datos opcionales (transmisión, combustible, color, categoría, carrocería) en Sanity Studio para cada vehículo que los requiera. |
| **Referencias** | `IMP-20260405-004/IMP.md`, `lib/constants/featureLabels.ts`, `lib/vehicles.ts`, `lib/types.ts`, `app/vehiculos/[slug]/page.tsx` |

---

### LOG-20260405-003

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260405-003 |
| **Fecha**       | 2026-04-05 |
| **Tipo**        | ACTION |
| **Contexto**    | Implementación de mejoras de diseño basadas en IMP-20260405-002. P1: fix crop imágenes. P2: rediseño cards con Magic. P3/P4: hero y espaciado. |
| **Acuerdo/resultado** | Completado. P1 (crop fix): `aspect-video`→`aspect-[4/3]` + `object-contain` + `bg-gray-50` en `VehicleCard.tsx` y `FeaturedVehicleCard.tsx`. P2 (rediseño card): border fino, shadow-sm, specs sin año duplicado, CTA "Ver Vehículo", padding compacto. P4 (espaciado): `py-16 lg:py-24`→`py-10 lg:py-16`. Lint: ✅. Validado con Chrome DevTools — autos completamente visibles. |
| **Impacto**     | Solo cambios de presentación (CSS/layout). Sin cambios a lógica, rutas, datos o APIs. |
| **Siguiente paso** | P3 (hero con auto real) queda pendiente para próxima iteración. |
| **Referencias** | `IMP-20260405-003/IMP.md`, `v1-pre-redesign` tag |

---

### LOG-20260405-002

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260405-002 |
| **Fecha**       | 2026-04-05 |
| **Tipo**        | PLAN |
| **Contexto**    | Análisis de diseño completo del sitio para mejoras con Magic MCP. Se identificó causa raíz del recorte de autos en cards y múltiples mejoras de UX/UI. |
| **Acuerdo/resultado** | Tag de respaldo `v1-pre-redesign` creado. Análisis documentado con Playwright screenshots (8 capturas). Issue principal: `aspect-video` (16:9) en `VehicleCard.tsx:65` y `FeaturedVehicleCard.tsx:32` causa crop de autos. Plan de mejoras P1-P4 definido. **Sin cambios aplicados al código.** |
| **Impacto**     | Ninguno aún. Solo análisis y planificación. |
| **Siguiente paso** | Owner confirma opción de solución para P1. Abrir IMP-20260405-003 para implementación. |
| **Referencias** | `IMP-20260405-002/IMP.md`, `docs/implementation/IMP-20260405-002/screenshots/`, tag `v1-pre-redesign` |

---

### LOG-20260405-001

| Campo           | Valor |
|-----------------|-------|
| **ID**          | LOG-20260405-001 |
| **Fecha**       | 2026-04-05 |
| **Tipo**        | ACTION |
| **Contexto**    | Bootstrap del estándar de orden y trazabilidad (Prompt Maestro Universal v1 adaptado al stack Next.js/Sanity). |
| **Acuerdo/resultado** | Se creó la estructura mínima obligatoria: `docs/logbook.md`, `docs/INDEX.md`, `docs/implementation/README.md`, `docs/implementation/IMP-template.md`, y la iniciativa `IMP-20260405-001`. Se actualizaron `AGENTS.md` y `claudedocs/CLAUDE.md` con co-gobierno y reglas de trazabilidad. |
| **Impacto**     | Ningún cambio funcional. Solo archivos de gobernanza y documentación. El proyecto funciona igual. |
| **Siguiente paso** | Usar `IMP-YYYYMMDD-XXX/` para toda iniciativa futura. Registrar en logbook cualquier cambio relevante. |
| **Referencias** | `IMP-20260405-001/IMP.md`, `AGENTS.md`, `claudedocs/CLAUDE.md`, `docs/implementation/README.md` |

---
