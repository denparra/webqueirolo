# docs/implementation/ — Iniciativas formales

Toda iniciativa formal de desarrollo, migración, refactor o cambio significativo vive aquí.

## Estructura de carpetas

```
docs/implementation/
  README.md                  ← este archivo
  IMP-template.md            ← template para nuevas iniciativas
  IMP-20260405-001/          ← primera iniciativa (bootstrap de orden)
    IMP.md
  IMP-YYYYMMDD-XXX/          ← siguientes iniciativas
    IMP.md                   (obligatorio)
    ROADMAP.md               (recomendado)
    EVIDENCE.md              (recomendado)
    ROLLBACK.md              (recomendado si hay riesgo)
```

## Convención de nombres

`IMP-YYYYMMDD-XXX` donde `XXX` es contador diario de 3 dígitos (001, 002...).

## Reglas

1. Una iniciativa = una carpeta. No mezclar dos iniciativas distintas.
2. Toda carpeta creada debe estar referenciada en `docs/logbook.md`.
3. El `IMP.md` es el único archivo obligatorio por iniciativa.
4. Crear la carpeta antes de empezar el trabajo, no al final.

## Listado de iniciativas

| ID | Fecha | Descripción | Estado |
|----|-------|-------------|--------|
| IMP-20260405-001 | 2026-04-05 | Bootstrap orden y trazabilidad (Prompt Maestro v1) | ✅ completado |
| IMP-20260405-002 | 2026-04-05 | Análisis de diseño + plan de mejoras con Magic MCP | ✅ completado |
| IMP-20260405-003 | 2026-04-05 | Implementación mejoras de diseño (P1-P2-P4) | ✅ completado |
| IMP-20260605-001 | 2026-06-05 | SEO Fase 0 (config baseUrl) + Fase 1 (metadata por vehículo) | ✅ completado |
| IMP-20260605-002 | 2026-06-05 | SEO Fase 2 (listado a Server Component) + Fase 3 (JSON-LD) | ✅ completado |
| IMP-20260605-003 | 2026-06-05 | SEO Fase 4 (sitemap desde Sanity) | ✅ completado |
