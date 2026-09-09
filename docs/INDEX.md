# docs/INDEX.md - Mapa de lectura

Guia rapida para entender el proyecto sin perderse. Leer en este orden.

## 1. Arranque obligatorio

| Documento | Para que sirve |
|-----------|----------------|
| `AGENTS.md` | Reglas operativas completas, restricciones, trazabilidad y DoD |
| `CLAUDE.md` | Resumen ejecutable para agentes y comandos principales |
| `README.md` | Estado funcional actual del producto |

## 1.1. Referencias auxiliares

| Documento | Para que sirve |
|-----------|----------------|
| `docs/reference/configuration.md` | Guia para ajustar datos de negocio en `config.ts` |
| `docs/reference/project-overview.md` | Referencia corta y enlaces documentales |
| `docs/reference/project-reference.md` | Panorama tecnico integral del proyecto |
| `docs/reference/deuda-tecnica.md` | Registro unico de deuda conocida y decisiones que NO hay que revertir |
| `docs/reference/automotive-platform-specification.md` | Especificacion reusable de arquitectura, construccion y operacion |

## 2. Fuente de verdad tecnica

| Area | Archivo/carpeta |
|------|-----------------|
| Schema de vehiculos | `sanity/schemaTypes/vehicle.ts` |
| Queries publicas Sanity | `lib/vehicles.ts` |
| Admin privado | `app/admin/`, `components/admin/`, `lib/admin/`, `middleware.ts` |
| Tipos publicos | `lib/types.ts` |
| Rich text/descripcion | `lib/richText.ts`, `components/shared/RichTextRenderer.tsx` |
| Configuracion negocio | `config.ts` |

## 3. Iniciativas relevantes

| Frente | Documento | Estado |
|--------|-----------|--------|
| Admin privado de vehiculos | `docs/implementation/IMP-20260614-001/IMP.md`, `IMP-20260615-001`, `IMP-20260616-001` | Implementado; verificar en deploy con env reales |
| SEO, sitemap y rutas publicas | `docs/implementation/IMP-20260605-001` a `IMP-20260607-002` | Implementado; revisar IMPs para detalle |
| Institucional e imagenes | `docs/implementation/IMP-20260606-002/` | Revisar estado y assets pendientes |
| Centro de Control automotriz | `docs/implementation/IMP-20260825-004/IMP.md` | Planning; `app/panel-web-automotoras/`; `/admin` cliente preservado |
| Estabilidad de produccion (threadpool y timeouts a Sanity) | `docs/implementation/IMP-20260908-003/IMP.md` | Cerrado y verificado en produccion 2026-09-08; deuda derivada en `docs/reference/deuda-tecnica.md` |

## 4. Trazabilidad

- `docs/logbook.md` registra decisiones, acciones, pruebas, riesgos e incidentes.
- Toda iniciativa formal vive en `docs/implementation/IMP-YYYYMMDD-XXX/`.
- `docs/archive/` es solo lectura: no crear trabajo nuevo ahi.

## 5. Convenciones para nuevos frentes

- Analisis/propuesta: `docs/analysis/YYYY-MM-DD-tema.md`.
- Implementacion formal: `docs/implementation/IMP-YYYYMMDD-XXX/IMP.md`.
- Referencias auxiliares: `docs/reference/<tema>.md`.
- Registrar en `docs/logbook.md` antes/durante el trabajo, no al final.

## Co-gobierno de reglas

`AGENTS.md` y `CLAUDE.md` son co-base entrelazada. Si una regla critica cambia, actualizar ambos en la misma sesion. Si hay conflicto, aplicar la opcion mas segura y registrar una `DECISION` en logbook.
