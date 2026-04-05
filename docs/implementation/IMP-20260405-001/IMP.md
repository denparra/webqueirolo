# IMP-20260405-001 — Bootstrap de orden y trazabilidad (Prompt Maestro v1)

## Metadatos

| Campo       | Valor |
|-------------|-------|
| **ID**      | IMP-20260405-001 |
| **Fecha**   | 2026-04-05 |
| **Owner**   | denparra |
| **Estado**  | completed |
| **Log ref** | LOG-20260405-001 |

## Objetivo

Adaptar e implementar el Prompt Maestro Universal v1 al stack del proyecto (Next.js 14 / Sanity / TypeScript).  
Objetivo: dar orden, estructura y trazabilidad clara al proyecto sin romper ninguna página funcional.  
Todos los cambios son puramente de archivos de gobernanza y documentación.

## Alcance

**Incluye:**
- Creación de `docs/logbook.md` (bitácora de trazabilidad)
- Creación de `docs/INDEX.md` (mapa de onboarding)
- Creación de `docs/implementation/README.md` (guía de implementaciones)
- Creación de `docs/implementation/IMP-template.md` (template reutilizable)
- Creación de `docs/implementation/IMP-20260405-001/IMP.md` (esta iniciativa)
- Actualización de `AGENTS.md` con co-gobierno y reglas de trazabilidad
- Actualización de `claudedocs/CLAUDE.md` con co-gobierno y ref a logbook

**Excluye:**
- Todo archivo de código (`app/`, `components/`, `lib/`, `sanity/`, `store/`)
- `package.json`, `tsconfig.json`, `next.config.js`, `tailwind.config.ts`
- Variables de entorno o secrets
- Commits (solo si el owner lo solicita)

## Artefactos creados

| Archivo | Tipo | Descripción |
|---------|------|-------------|
| `docs/logbook.md` | nuevo | Bitácora de trazabilidad del proyecto |
| `docs/INDEX.md` | nuevo | Mapa de lectura para onboarding |
| `docs/implementation/README.md` | nuevo | Guía de iniciativas formales |
| `docs/implementation/IMP-template.md` | nuevo | Template reutilizable para IMP |
| `docs/implementation/IMP-20260405-001/IMP.md` | nuevo | Esta iniciativa |
| `AGENTS.md` | modificado | Co-gobierno + trazabilidad añadidos |
| `claudedocs/CLAUDE.md` | modificado | Co-gobierno + ref logbook añadidos |

## Impacto

- **Funcional**: ninguno. Cero cambios a código, rutas o configuración.
- **Técnico**: proyecto tiene ahora estructura de gobernanza estándar.
- **Operativo**: agentes futuros pueden arrancar rápido con contexto claro.

## Riesgos

| Riesgo | Probabilidad | Mitigación |
|--------|-------------|------------|
| Inconsistencia entre AGENTS.md y CLAUDE.md | baja | Regla de co-gobierno obliga sincronización en cada cambio |

## Rollback

No aplica — todos los cambios son archivos de documentación nuevos o adiciones a existentes.  
Para revertir: eliminar la carpeta `docs/` y las secciones añadidas en `AGENTS.md` y `claudedocs/CLAUDE.md`.

## Evidencia de validación

- [x] Sin cambios a código funcional
- [x] `docs/` no afecta build de Next.js (carpeta ignorada por framework)
- [x] `AGENTS.md` y `claudedocs/CLAUDE.md` actualizados con co-gobierno
- [x] Logbook registrado con LOG-20260405-001

## Definition of Done

- [x] Carpeta `IMP-20260405-001/` con `IMP.md` existe
- [x] Acción registrada en `docs/logbook.md` como LOG-20260405-001
- [x] Impacto, riesgos y rollback documentados
- [x] Referencias cruzadas log ↔ IMP ↔ artefactos completas
