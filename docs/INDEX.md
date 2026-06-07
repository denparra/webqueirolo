# docs/INDEX.md — Mapa de lectura

Guía de onboarding para agentes nuevos. Leer en este orden:

## 1. Arrancar rápido
→ `AGENTS.md` (raíz) — reglas operativas completas, alcance y restricciones  
→ `CLAUDE.md` (raíz) — resumen ejecutable, comandos, mapa de rutas

## 2. Entender el proyecto
→ `README.md` (raíz) — presentación general del repo  
→ `config.ts` — datos de negocio (contacto, SEO, horarios)

## 3. Trazabilidad y decisiones
→ `docs/logbook.md` — bitácora de cambios y decisiones relevantes  
→ `docs/implementation/` — iniciativas formales (IMP-YYYYMMDD-XXX)

## 4. Análisis y planificación activos
→ `docs/analysis/` — análisis y planes recientes (SEO, performance, etc.)

## 5. Frentes archivados (solo lectura)
→ `docs/archive/` — fases completadas (01–08), propuestas previas, backups históricos

## Fuente de verdad técnica
- **Schema de vehículos:** `sanity/schemaTypes/vehicle.ts`
- **Queries GROQ:** `lib/vehicles.ts`
- **Configuración de negocio:** `config.ts`
- **Tipos TypeScript:** `lib/types.ts`

## Co-gobierno de reglas
`AGENTS.md` y `CLAUDE.md` (raíz) son co-base entrelazada.  
Toda regla crítica debe estar actualizada en **ambos** en la misma sesión.  
Si hay diferencia → aplicar la opción más segura + registrar `DECISION` en logbook.

## Convención para nuevos frentes
- **Nuevo análisis / propuesta**: `docs/analysis/YYYY-MM-DD-tema.md`
- **Nueva implementación formal**: `docs/implementation/IMP-YYYYMMDD-XXX/IMP.md`
- **NO** crear carpetas en la raíz del repo ni en `docs/archive/` (es solo lectura)
