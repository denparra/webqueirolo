# docs/implementation/ â€” Iniciativas formales

Toda iniciativa formal de desarrollo, migraciÃ³n, refactor o cambio significativo vive aquÃ­.

## Estructura de carpetas

```
docs/implementation/
  README.md                  â† este archivo
  IMP-template.md            â† template para nuevas iniciativas
  IMP-20260405-001/          â† primera iniciativa (bootstrap de orden)
    IMP.md
  IMP-YYYYMMDD-XXX/          â† siguientes iniciativas
    IMP.md                   (obligatorio)
    ROADMAP.md               (recomendado)
    EVIDENCE.md              (recomendado)
    ROLLBACK.md              (recomendado si hay riesgo)
```

## ConvenciÃ³n de nombres

`IMP-YYYYMMDD-XXX` donde `XXX` es contador diario de 3 dÃ­gitos (001, 002...).

## Reglas

1. Una iniciativa = una carpeta. No mezclar dos iniciativas distintas.
2. Toda carpeta creada debe estar referenciada en `docs/logbook.md`.
3. El `IMP.md` es el Ãºnico archivo obligatorio por iniciativa.
4. Crear la carpeta antes de empezar el trabajo, no al final.

## Listado de iniciativas

| ID | Fecha | DescripciÃ³n | Estado |
|----|-------|-------------|--------|
| IMP-20260405-001 | 2026-04-05 | Bootstrap orden y trazabilidad (Prompt Maestro v1) | âœ… completado |
| IMP-20260405-002 | 2026-04-05 | AnÃ¡lisis de diseÃ±o + plan de mejoras con Magic MCP | âœ… completado |
| IMP-20260405-003 | 2026-04-05 | ImplementaciÃ³n mejoras de diseÃ±o (P1-P2-P4) | âœ… completado |
| IMP-20260605-001 | 2026-06-05 | SEO Fase 0 (config baseUrl) + Fase 1 (metadata por vehÃ­culo) | âœ… completado |
| IMP-20260605-002 | 2026-06-05 | SEO Fase 2 (listado a Server Component) + Fase 3 (JSON-LD) | âœ… completado |
| IMP-20260605-003 | 2026-06-05 | SEO Fase 4 (sitemap desde Sanity) | âœ… completado |
| IMP-20260605-004 | 2026-06-05 | SEO Fases 5-8 (OG, FAQ/tildes, patente/canonical, GSC/dominio) | âœ… completado |
| IMP-20260606-002 | 2026-06-06 | SOT de imágenes institucionales (/servicios, /nosotros, /contacto) | planning |
| IMP-20260614-001 | 2026-06-14 | Admin privado para alta/edición interactiva de vehículos | in-progress |

