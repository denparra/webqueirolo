# docs/implementation/ - Iniciativas formales

Toda iniciativa formal de desarrollo, migracion, refactor o cambio significativo vive aqui.

## Estructura

```txt
docs/implementation/
  README.md
  IMP-template.md
  IMP-YYYYMMDD-XXX/
    IMP.md         # obligatorio
    ROADMAP.md     # recomendado
    EVIDENCE.md    # recomendado
    ROLLBACK.md    # recomendado si hay riesgo
```

## Reglas

1. Una iniciativa = una carpeta.
2. Toda carpeta creada debe estar referenciada en `docs/logbook.md`.
3. El `IMP.md` es la fuente de verdad de la iniciativa.
4. Crear la carpeta antes de implementar, no despues.
5. Si el cambio toca reglas operativas, actualizar `AGENTS.md` y `CLAUDE.md` juntos.

## Listado de iniciativas

| ID | Fecha | Descripcion | Estado |
|----|-------|-------------|--------|
| IMP-20260405-001 | 2026-04-05 | Bootstrap orden y trazabilidad | Completado |
| IMP-20260405-002 | 2026-04-05 | Analisis de diseno + plan Magic MCP | Completado |
| IMP-20260405-003 | 2026-04-05 | Mejoras de diseno P1/P2/P4 | Completado |
| IMP-20260405-004 | 2026-04-05 | Limpieza de N/A y labels de ficha | Completado |
| IMP-20260405-005 | 2026-04-05 | Optimizacion de imagenes Sanity/Next | Completado |
| IMP-20260605-001 | 2026-06-05 | SEO Fase 0 + Fase 1 | Completado |
| IMP-20260605-002 | 2026-06-05 | SEO Fase 2 + Fase 3 | Completado |
| IMP-20260605-003 | 2026-06-05 | Sitemap desde Sanity | Completado |
| IMP-20260605-004 | 2026-06-05 | SEO Fases 5-8 | Completado |
| IMP-20260606-001 | 2026-06-06 | Leads via WhatsApp + endpoint n8n preparado | Completado |
| IMP-20260606-002 | 2026-06-06 | Frente institucional e imagenes | Parcial / pendiente assets |
| IMP-20260607-001 | 2026-06-07 | OG estatica + fixes legales | Completado |
| IMP-20260607-002 | 2026-06-07 | Pendientes SEO/dominio | Parcial |
| IMP-20260614-001 | 2026-06-14 | Admin privado para alta/edicion interactiva de vehiculos | Implementado; pendiente verificacion manual en deploy |
| IMP-20260615-001 | 2026-06-15 | Validaciones admin, boton compartir WhatsApp y quick wins | Pendiente de implementacion |
