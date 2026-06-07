# Prompt maestro universal v1 - Orden y trazabilidad para cualquier proyecto

Uso:
- Copiar este paquete base en cualquier repo nuevo o existente.
- Mantener todo en espanol para documentacion operativa.
- Adaptar solo nombres/rutas especificas del proyecto, no las reglas de gobierno.

---

## 1) Objetivo

Estandarizar como trabaja un agente de codigo para:
- operar con limites claros,
- dejar trazabilidad de decisiones y cambios,
- mantener continuidad entre sesiones,
- y evitar perdida de contexto en proyectos multi-stack.

---

## 2) Paquete minimo obligatorio

Crear estas rutas en el proyecto destino:

```
AGENTS.md
CLAUDE.md
docs/
  logbook.md
  implementation/
    README.md
    IMP-template.md
```

Opcional recomendado:

```
docs/INDEX.md
docs/BOUNDARY.md
docs/README-OPERACION.md
```

---

## 3) Co-gobierno de reglas (AGENTS + CLAUDE)

Principio base:
- `AGENTS.md` y `CLAUDE.md` son archivos base, complementarios y entrelazados.
- Ninguno manda sobre el otro; ambos deben reflejar las mismas reglas operativas criticas.

Rol recomendado de cada archivo:
- `AGENTS.md`: reglas operativas completas, alcance, restricciones, trazabilidad y DoD.
- `CLAUDE.md`: resumen operativo ejecutable, comandos, mapa de rutas y recordatorios criticos.

Regla de consistencia:
- Toda regla critica nueva o cambiada debe actualizarse en ambos archivos en la misma sesion.
- Si hay diferencia entre ambos, el agente debe:
  1) aplicar la opcion mas segura/no destructiva,
  2) registrar `DECISION` en `docs/logbook.md`,
  3) proponer alineacion inmediata de ambos archivos.

Documentos de apoyo:
- `docs/README-OPERACION.md`: rutina diaria y comandos frecuentes.
- `docs/INDEX.md`: mapa de lectura para onboarding.
- `README.md`: presentacion general del repo.

Si existe una fuente tecnica declarada (ejemplo: JSON principal, esquema DB, spec API), esa fuente prevalece sobre docs narrativas.

---

## 4) Reglas operativas universales

1. No ejecutar cambios en produccion sin orden explicita del owner.
2. Cualquier cambio relevante debe registrarse en `docs/logbook.md`.
3. Toda iniciativa formal debe vivir en `docs/implementation/IMP-YYYYMMDD-XXX/`.
4. Cada carpeta `IMP-*` debe incluir `IMP.md` minimo.
5. No exponer secretos en docs, logs, commits o evidencias.
6. Si hay duda de alcance, priorizar seguridad y pedir confirmacion antes de acciones irreversibles.

---

## 4.1) Frase de activacion operativa (para ejecutar este estandar)

Frase sugerida del owner:
- `Aplicar Prompt Maestro Universal v1`.

Comportamiento esperado del agente al leer esa frase:
1. Verifica existencia de `AGENTS.md`, `CLAUDE.md`, `docs/logbook.md`, `docs/implementation/README.md`.
2. Si faltan archivos base, los crea desde templates del paquete.
3. Sincroniza reglas criticas entre `AGENTS.md` y `CLAUDE.md`.
4. Registra un `ACTION` en `docs/logbook.md` con lo aplicado.
5. Si crea iniciativa formal, abre `docs/implementation/IMP-YYYYMMDD-XXX/` con `IMP.md`.

---

## 5) Politica de trazabilidad (logbook)

Registrar solo cambios relevantes (no ruido):
- decisiones que cambian direccion tecnica/negocio,
- acciones que modifican codigo/config/documentacion base,
- ejecucion de pruebas con resultado,
- riesgos, bloqueos e incidentes,
- cambios de alcance o politicas.

Frecuencia minima:
- una entrada por cambio relevante.

Formato de ID recomendado:
- `LOG-YYYYMMDD-XXX` (contador diario de 3 digitos).

Taxonomia recomendada:
- `DECISION`, `PLAN`, `ACTION`, `TEST`, `RISK`, `BLOCKER`, `SECURITY`, `INCIDENT`.

Campos obligatorios por entrada:
- ID
- Fecha
- Tipo
- Contexto
- Acuerdo/resultado
- Impacto
- Siguiente paso
- Referencias (rutas de archivo, ID de flujo, issue, PR)

---

## 6) Estructura de implementaciones

Regla fija:
- usar siempre `docs/implementation/IMP-YYYYMMDD-XXX/`.

Contenido minimo por implementacion:
- `IMP.md` (obligatorio)
- `ROADMAP.md` (recomendado)
- `EVIDENCE.md` o `evidence/` (recomendado)
- `ROLLBACK.md` (recomendado en cambios de riesgo)

Reglas:
- no mezclar dos iniciativas distintas en una misma carpeta.
- toda carpeta creada debe estar referenciada en `docs/logbook.md`.

---

## 7) Politica de git y commits

Reglas:
- no hacer commit sin solicitud explicita del owner (si el contexto lo requiere).
- no usar `--amend` salvo solicitud explicita.
- no hacer `push --force` a ramas protegidas.
- no revertir cambios ajenos sin instruccion.

Esquema de commit recomendado:

```
<tipo>(<alcance>): <resumen corto>

<por que del cambio>

Refs: <LOG-ID>, <IMP-ID>
```

Tipos sugeridos:
- `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `security`.

Ejemplo:

```
docs(governance): estandariza prompt maestro universal

Define paquete minimo de archivos para trazabilidad y operacion cross-stack.

Refs: LOG-20260404-072, IMP-20260404-005
```

---

## 8) Que va en AGENTS.md

Debe contener:
- objetivo del proyecto y alcance actual,
- reglas criticas obligatorias,
- fuente de verdad tecnica,
- limites de operacion (produccion, MCP/API, owner-driven changes),
- estructura y trazabilidad (`logbook` + `IMP-*`),
- definicion de done por etapa,
- politica de seguridad y secretos,
- comandos de validacion no destructivos.
- enlace directo a `CLAUDE.md` indicando que ambos son co-base.

No debe contener:
- secretos reales,
- instrucciones ambiguas sin criterio de prioridad,
- decisiones historicas largas (eso va al logbook).

---

## 9) Que va en CLAUDE.md

Debe contener:
- resumen operativo corto del proyecto,
- reglas criticas sintetizadas (espejo activo de `AGENTS.md`),
- comandos frecuentes,
- mapa de carpetas,
- notas de arquitectura actual,
- regla de trazabilidad obligatoria.
- enlace directo a `AGENTS.md` indicando co-gobierno.

Objetivo:
- que un agente nuevo pueda ejecutar bien en pocos minutos.

---

## 10) Definition of Done universal (checklist)

Se considera completada una iniciativa cuando:
- [ ] existe carpeta `IMP-YYYYMMDD-XXX/` con `IMP.md`.
- [ ] se registro decision/accion principal en `docs/logbook.md`.
- [ ] hay evidencia de validacion (manual o automatizada).
- [ ] se documento impacto, riesgos y rollback.
- [ ] se actualizaron referencias cruzadas (log <-> IMP <-> artefactos).

---

## 11) Prompt base reutilizable (listo para pegar)

```text
Eres un agente de codigo para este proyecto.

OBJETIVO
- Ejecutar tareas tecnicas con orden, trazabilidad y seguridad.

GOBIERNO
- Trata `AGENTS.md` y `CLAUDE.md` como co-base entrelazada; ninguno manda.
- Mantiene ambas guias sincronizadas en cada cambio de reglas criticas.
- Si existe fuente tecnica declarada, prevalece sobre documentacion narrativa.

ACTIVACION
- Si el owner indica `Aplicar Prompt Maestro Universal v1`, ejecuta bootstrap de orden: verifica/crea archivos base, sincroniza reglas y registra log.

RESTRICCIONES
- No ejecutar cambios en produccion sin instruccion explicita del owner.
- No exponer secretos en codigo, docs, logs o commits.
- No ejecutar acciones destructivas sin validar alcance y contexto.

TRAZABILIDAD OBLIGATORIA
- Registrar en docs/logbook.md todo cambio relevante con ID LOG-YYYYMMDD-XXX.
- Crear docs/implementation/IMP-YYYYMMDD-XXX/ para toda iniciativa formal y agregar IMP.md.
- Referenciar en el log todos los artefactos creados/modificados.

ESTANDAR DE LOG
- Tipos permitidos: DECISION, PLAN, ACTION, TEST, RISK, BLOCKER, SECURITY, INCIDENT.
- Campos obligatorios: ID, Fecha, Tipo, Contexto, Acuerdo/resultado, Impacto, Siguiente paso, Referencias.

ESTANDAR DE COMMIT
- Usar: <tipo>(<alcance>): <resumen corto>
- Incluir motivo del cambio y referencias: LOG-ID e IMP-ID.

DEFINITION OF DONE
- No cerrar tarea sin evidencia, log actualizado y referencias cruzadas completas.
```
