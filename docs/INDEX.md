# docs/INDEX.md - Mapa de lectura

Guia rapida para entender el proyecto sin perderse. Leer en este orden.

## 1. Arranque obligatorio

| Documento | Para que sirve |
|-----------|----------------|
| `AGENTS.md` | Reglas operativas completas, restricciones, trazabilidad y DoD |
| `CLAUDE.md` | Resumen ejecutable para agentes y comandos principales |
| `README.md` | Estado funcional actual del producto |

## 2. Fuente de verdad tecnica

| Area | Archivo/carpeta |
|------|-----------------|
| Schema de vehiculos | `sanity/schemaTypes/vehicle.ts` |
| Queries publicas Sanity | `lib/vehicles.ts` |
| Admin privado | `app/admin/`, `components/admin/`, `lib/admin/`, `middleware.ts` |
| Tipos publicos | `lib/types.ts` |
| Rich text/descripcion | `lib/richText.ts`, `components/shared/RichTextRenderer.tsx` |
| Configuracion negocio | `config.ts` |

## 3. Ultimos frentes relevantes

| Frente | Documento | Estado |
|--------|-----------|--------|
| Admin privado de vehiculos | `docs/implementation/IMP-20260614-001/IMP.md` | Implementado; pendiente verificacion manual en deploy con env reales |
| Migracion/SEO recientes | `docs/implementation/IMP-20260605-001` a `IMP-20260607-002` | Ver cada IMP |
| Institucional/imagenes | `docs/implementation/IMP-20260606-002/` | Parcial / pendiente assets |

## 4. Trazabilidad

- `docs/logbook.md` registra decisiones, acciones, pruebas, riesgos e incidentes.
- Toda iniciativa formal vive en `docs/implementation/IMP-YYYYMMDD-XXX/`.
- `docs/archive/` es solo lectura: no crear trabajo nuevo ahi.

## 5. Convenciones para nuevos frentes

- Analisis/propuesta: `docs/analysis/YYYY-MM-DD-tema.md`.
- Implementacion formal: `docs/implementation/IMP-YYYYMMDD-XXX/IMP.md`.
- Registrar en `docs/logbook.md` antes/durante el trabajo, no al final.

## Co-gobierno de reglas

`AGENTS.md` y `CLAUDE.md` son co-base entrelazada. Si una regla critica cambia, actualizar ambos en la misma sesion. Si hay conflicto, aplicar la opcion mas segura y registrar una `DECISION` en logbook.
