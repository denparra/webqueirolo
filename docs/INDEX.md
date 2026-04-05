# docs/INDEX.md — Mapa de lectura

Guía de onboarding para agentes nuevos. Leer en este orden:

## 1. Arrancar rápido
→ `AGENTS.md` (raíz) — reglas operativas completas, alcance y restricciones  
→ `claudedocs/CLAUDE.md` — resumen ejecutable, comandos, mapa de rutas

## 2. Entender el proyecto
→ `README.md` (raíz) — presentación general del repo  
→ `config.ts` — datos de negocio (contacto, SEO, horarios)

## 3. Trazabilidad y decisiones
→ `docs/logbook.md` — bitácora de cambios y decisiones relevantes  
→ `docs/implementation/` — iniciativas formales (IMP-YYYYMMDD-XXX)

## 4. Documentación interna
→ `claudedocs/00-Analysis-Planning/` — análisis y propuestas de diseño  
→ `claudedocs/03-implementation/` — notas de fases previas

## Fuente de verdad técnica
- **Schema de vehículos:** `sanity/schemaTypes/vehicle.ts`
- **Queries GROQ:** `lib/vehicles.ts`
- **Configuración de negocio:** `config.ts`
- **Tipos TypeScript:** `lib/types.ts`

## Co-gobierno de reglas
`AGENTS.md` y `claudedocs/CLAUDE.md` son co-base entrelazada.  
Toda regla crítica debe estar actualizada en **ambos** en la misma sesión.  
Si hay diferencia → aplicar la opción más segura + registrar `DECISION` en logbook.
