# AGENT_DOCS_IMPLEMENTATION_MASTER.md
> Documento único (raíz del repo). Plan + guía + skeletons para implementar estructura documental Agent-First sin romper un proyecto existente.

## 0) Contexto y objetivo
Este proyecto ya está iniciado y funciona. Queremos implementar una estructura documental “Agent-First” para que los agentes (Claude / OpenAI Codex / Gemini) trabajen con:
- contexto rápido
- menos tokens
- cambios verificables
- cero regresiones

### Condiciones del repo (importante)
- Ya existe `agents.md` → **es la guía para OpenAI/Codex**.
- Ya existe `claude.md` → guía para Claude.
- Roadmap “archivo de la verdad” será: `roadmap.md` (en raíz).

**Regla clave:** No duplicar `agents.md`.  
Por lo tanto, NO crearemos `ai/codex.md` si ya tenemos `agents.md` como guía Codex.

---

## 1) Restricciones estrictas (no romper nada)
1) Prohibido tocar lógica de negocio: **solo docs / carpetas / organización documental**.
2) Prohibido cambiar: dependencias, build, CI/CD, deploy, configuración productiva.
3) Prohibido mover/renombrar código o carpetas core.
4) Si se mueve un archivo existente, debe ser con `git mv` (mantener historial).
5) “Stubs” (archivos de redirección) solo si se detectan referencias por path en scripts/CI/README.

---

## 2) Estructura objetivo (reutilizable)
> Crear solo si no existe. Si ya hay `/docs` o algo equivalente, respetar y mapear.

### /ai (guías por modelo + router)
- `ai/agents.md`  ✅ (aquí vivirá **el existente** `agents.md` de Codex)
- `ai/claude.md`  ✅ (aquí vivirá **el existente** `claude.md`)
- `ai/gemini.md`  🆕 (nuevo)
- `ai/context-map.md` 🆕 (nuevo, router corto)

> Nota: NO se crea `ai/codex.md` para evitar duplicar la función de `agents.md`.

### /docs (verdad del proyecto, corta y enlazada)
- `docs/00-index.md` 🆕 router principal
- `docs/01-product.md` 🆕 objetivo / no-alcance
- `docs/02-architecture.md` 🆕 módulos / flujos
- `docs/03-interfaces.md` 🆕 contratos (API/DB/eventos)
- `docs/04-conventions.md` 🆕 naming/commits/estilo
- `docs/05-security.md` 🆕 auth/roles/secrets/OWASP
- `docs/06-runbook.md` 🆕 cómo correr/env/troubleshooting
- `docs/07-testing.md` 🆕 tests/commands/gates
- `docs/08-decisions-adr.md` 🆕 decisiones importantes
- `docs/_inventory.md` 🆕 hallazgos (read-only) del repo

### /prompts (plantillas para ahorrar tokens)
- `prompts/briefs/feature.md` 🆕
- `prompts/briefs/bugfix.md` 🆕
- `prompts/briefs/refactor.md` 🆕
- `prompts/briefs/spike.md` 🆕
- `prompts/logs/.gitkeep` 🆕

### Roadmap (fuente de verdad)
- `roadmap.md` (en raíz) ✅
- Si existe `docs/09-roadmap.md`, que sea solo un link a `../roadmap.md` (evitar duplicidad)

---

## 3) Proceso obligatorio (orden exacto)

### Fase 0 — Análisis READ-ONLY (obligatorio antes de crear/mover)
Objetivo: levantar hechos del repo sin inventar.

Checklist:
- [ ] Capturar árbol alto nivel del repo (módulos).
- [ ] Ubicar rutas reales de `agents.md` y `claude.md`.
- [ ] Buscar referencias por path a esos archivos en:
  - scripts (package.json, makefiles, scripts/)
  - CI (GitHub Actions / GitLab CI / etc.)
  - README / docs existentes
- [ ] Encontrar comandos reales:
  - dev/run
  - test
  - lint/format
  - build
- [ ] Identificar stack: web / SaaS / scraping / mixto.
- [ ] Identificar env vars (solo nombres; nunca valores).

Salida obligatoria:
- Crear `docs/_inventory.md` (plantilla más abajo) con lo encontrado.

---

### Fase 1 — Crear carpetas (cero impacto)
Crear si no existen:
- `ai/`
- `docs/`
- `prompts/briefs/`
- `prompts/logs/` y `.gitkeep`

---

### Fase 2 — Reubicar guías existentes (sin duplicar)
Regla:
- `agents.md` (Codex/OpenAI) debe quedar en: `ai/agents.md`
- `claude.md` debe quedar en: `ai/claude.md`

Acciones:
- `git mv <ruta_actual>/agents.md ai/agents.md`
- `git mv <ruta_actual>/claude.md ai/claude.md`

Stubs (recomendado):
- Solo si Fase 0 detectó referencias por path (ej: algo lee `./agents.md`):
  - crear stub en la ruta antigua con texto corto apuntando a `/ai/agents.md` o `/ai/claude.md`.
- Si no hay referencias: no crear stubs.

---

### Fase 3 — Crear skeletons (docs vacíos con estructura fija)
Crear los docs nuevos listados en `/docs`, `/ai` (solo gemini/context-map), y `/prompts/briefs` con skeletons.
- No inventar info: usar “TBD según inventory”.

---

### Fase 4 — Rellenar (completar contenido) usando solo lo observado
Orden recomendado para rellenar (mejor eficiencia y menos tokens):
1) `docs/00-index.md`
2) `ai/context-map.md`
3) `docs/06-runbook.md`
4) `docs/07-testing.md`
5) `docs/02-architecture.md`
6) `docs/03-interfaces.md`
7) `docs/04-conventions.md`
8) `docs/05-security.md`
9) `docs/01-product.md`
10) `docs/08-decisions-adr.md`

Regla: cada doc 1–2 páginas máximo, usar links a rutas reales.

---

## 4) Plan de commits sugerido (seguro y reversible)
1) `docs(ai): add agent-first folders and skeleton docs`
2) `docs: add inventory + fill runbook/testing from repo analysis`
3) `docs: complete architecture/interfaces/security/conventions`
4) `ai: add gemini guide + context map; align existing agent docs`

---

## 5) Criterios de éxito (Definition of Done)
- [ ] No se tocó código funcional.
- [ ] `ai/agents.md` y `ai/claude.md` existen (provenientes de los archivos existentes).
- [ ] `docs/_inventory.md` existe con rutas y comandos reales.
- [ ] `docs/00-index.md` + `ai/context-map.md` permiten navegar rápido.
- [ ] `docs/06-runbook.md` y `docs/07-testing.md` tienen comandos reales.
- [ ] `roadmap.md` es la única fuente de verdad del plan.

---

# 6) SKELETONS — Crear archivos con estas plantillas

## 6.1 docs/_inventory.md (OBLIGATORIO)
```md
# Inventory (Read-Only)
> Hallazgos del repo. No inventar.

## Fecha
- YYYY-MM-DD

## Estructura (alto nivel)
- /<modulo> — (1 línea)
- /<modulo> — (1 línea)

## Ubicación actual de guías AI
- agents.md: <ruta exacta>
- claude.md: <ruta exacta>

## Referencias por path detectadas (stubs)
- Referencia a ./agents.md: Sí/No → dónde
- Referencia a ./claude.md: Sí/No → dónde

## Stack detectado
- Runtime/Lenguaje:
- Backend:
- Frontend:
- DB:
- Infra/Deploy:
- Otros:

## Comandos reales encontrados
- Dev/Run:
- Test:
- Lint/Format:
- Build:
- Migraciones (si aplica):
- Seeds (si aplica):

## Env vars (solo nombres)
- VAR_1
- VAR_2
- ...

## Riesgos a evitar
- Ej: “CI depende de path X”, “deploy lee archivo Y”, etc.
6.2 docs/00-index.md (router principal)
md
Copiar código
# Docs Index (Agent Router)

## Si tu tarea es…
- **Correr el proyecto / env / instalar** → [Runbook](06-runbook.md)
- **Tests / gates / cómo verificar** → [Testing](07-testing.md)
- **Cambios grandes / módulos** → [Architecture](02-architecture.md)
- **Contratos (API/DB/eventos)** → [Interfaces](03-interfaces.md)
- **Convenciones** → [Conventions](04-conventions.md)
- **Seguridad / Auth** → [Security](05-security.md)
- **Decisiones importantes** → [ADR](08-decisions-adr.md)
- **Roadmap (fuente de verdad)** → ../roadmap.md
- **Router rápido (AI)** → ../ai/context-map.md

## Módulos (rutas reales)
- `<ruta>` — (1 línea)
- `<ruta>` — (1 línea)

## Orden recomendado (agente)
1) ../ai/agents.md (OpenAI/Codex guide)
2) ../ai/claude.md (Claude guide)
3) ../ai/context-map.md
4) 06-runbook.md
5) 07-testing.md
6) Docs del módulo a tocar
6.3 docs/01-product.md
md
Copiar código
# Product Overview

## Propósito
- ...

## Usuarios / casos de uso
- ...

## No-alcance
- ...

## Referencias
- Roadmap: ../roadmap.md
- Arquitectura: 02-architecture.md
6.4 docs/02-architecture.md
md
Copiar código
# Architecture

## Vista general (diagrama textual)
- Frontend/UI →
- Backend/API →
- Workers/Jobs →
- DB →
- Integraciones →

## Módulos (rutas reales)
- `<ruta>` — responsabilidad
- `<ruta>` — responsabilidad

## Flujos clave
- Auth/Session (si aplica)
- Flujo principal de negocio
- Flujo data/scraping (si aplica)
6.5 docs/03-interfaces.md
md
Copiar código
# Interfaces & Contracts

## API (si existe)
- Endpoints principales (lista corta)
- Ejemplos request/response (1–2)

## DB (si existe)
- Tablas/colecciones clave
- Cómo se corre migración

## Integraciones externas
- Proveedor → propósito → notas auth (sin secretos)
6.6 docs/04-conventions.md
md
Copiar código
# Conventions

## Naming
- Archivos:
- Carpetas:
- Variables:
- Endpoints:

## PRs
- 1 cambio por PR
- checklist de verificación

## Logging/Errores
- convención de errores
- niveles de logs
6.7 docs/05-security.md
md
Copiar código
# Security

## AuthN/AuthZ (si aplica)
- Roles/permisos

## Secrets/env
- dónde se definen (local/CI/prod)
- no loguear secretos

## Hardening (web)
- validación inputs
- rate limit (si aplica)
- headers (si aplica)

## Datos sensibles
- qué es PII aquí
- reglas de logging
6.8 docs/06-runbook.md
md
Copiar código
# Runbook

## Requisitos
- runtime, DB, servicios

## Setup local
1) ...
2) ...

## Env vars (solo nombres)
- ...

## Comandos
- Dev:
- Test:
- Lint/Format:
- Build:
- Start:

## Troubleshooting
- error → solución
6.9 docs/07-testing.md
md
Copiar código
# Testing

## Tipos
- Unit:
- Integration:
- E2E:

## Comandos exactos
- unit:
- integration:
- e2e:
- lint:

## Gates
- no merge si fallan tests/lint/build
6.10 docs/08-decisions-adr.md
md
Copiar código
# ADR (Architecture Decision Records)

## Formato ADR
- Decisión:
- Contexto:
- Opciones:
- Decisión tomada:
- Consecuencias:

## ADRs
- ADR-001:
7) /prompts/briefs (plantillas de tareas)
7.1 prompts/briefs/feature.md
md
Copiar código
# Task Brief — Feature
## Objetivo
## Scope / No-Scope
## Archivos/Módulos
## Criterios de aceptación
## Verificación (comandos + resultado esperado)
7.2 prompts/briefs/bugfix.md
md
Copiar código
# Task Brief — Bugfix
## Bug
## Reproducción
## Expected vs Actual
## Logs
## Fix scope
## Verificación
7.3 prompts/briefs/refactor.md
md
Copiar código
# Task Brief — Refactor
## Motivo
## Restricción (no cambiar comportamiento)
## Plan
## Verificación
7.4 prompts/briefs/spike.md
md
Copiar código
# Task Brief — Spike
## Pregunta
## Timebox
## Entregable
## Criterio de decisión
8) /ai — Archivos nuevos (sin duplicar agents.md)
8.1 ai/context-map.md
md
Copiar código
# Context Map (Fast Router)

Lectura recomendada:
1) ./agents.md (OpenAI/Codex)
2) ./claude.md (Claude)
3) ../docs/00-index.md
4) ../docs/06-runbook.md
5) ../docs/07-testing.md

Si la tarea es…
- UI/UX → docs/02-architecture + módulo frontend + docs/04-conventions
- API/Backend → docs/02-architecture + docs/03-interfaces
- DB/Migraciones → docs/03-interfaces + docs/06-runbook
- Data/Scraping → docs/02-architecture + runbook/testing
- Seguridad/Auth → docs/05-security primero

Roadmap (fuente de verdad): ../roadmap.md
8.2 ai/gemini.md
md
Copiar código
# Gemini Guide (Exploration / Data)

## Rol
Explorar alternativas, research, data/ML, comparativas, planes previos a implementación.

## Restricciones
- No reestructurar repo.
- No tocar código funcional sin brief y verificación.

## Output recomendado
- 2–4 opciones
- pros/contras
- recomendación
- riesgos
- checklist de implementación
9) Nota crítica: ai/agents.md y ai/claude.md
Este repo ya trae:

agents.md (OpenAI/Codex)

claude.md (Claude)

Por lo tanto:

Se mueven a /ai con git mv si están en otra ruta.

Se “alinean” agregando:

links al router: ../docs/00-index.md

formato de salida + verificación

restricciones anti-regresión

NO se crea un segundo archivo tipo codex.md para no duplicar.