# IMP-template.md — Template para nuevas iniciativas

Copiar esta carpeta como `IMP-YYYYMMDD-XXX/` y renombrar el archivo a `IMP.md`.

---

# IMP-YYYYMMDD-XXX — [Título corto de la iniciativa]

## Metadatos

| Campo       | Valor |
|-------------|-------|
| **ID**      | IMP-YYYYMMDD-XXX |
| **Fecha**   | YYYY-MM-DD |
| **Owner**   | [nombre] |
| **Estado**  | planning \| in-progress \| completed \| cancelled |
| **Log ref** | LOG-YYYYMMDD-XXX |

## Objetivo

[Qué se va a hacer y por qué. 2-4 líneas máximo.]

## Alcance

**Incluye:**
- [archivo/componente/feature A]
- [archivo/componente/feature B]

**Excluye:**
- [qué NO se toca]

## Pasos de implementación

- [ ] Paso 1
- [ ] Paso 2
- [ ] Paso 3

## Impacto esperado

[Funcional, técnico, de UX. Qué cambia para el usuario/sistema.]

## Riesgos

| Riesgo | Probabilidad | Mitigación |
|--------|-------------|------------|
| [riesgo A] | baja/media/alta | [cómo se mitiga] |

## Rollback

[Cómo revertir si algo falla. Pasos concretos o "no aplica".]

## Evidencia de validación

- [ ] `npm run lint` ✅
- [ ] `npm run build` ✅
- [ ] Rutas clave verificadas en local
- [ ] [evidencia específica de la iniciativa]

## Definition of Done

- [ ] Carpeta `IMP-YYYYMMDD-XXX/` con `IMP.md` existe
- [ ] Decisión/acción registrada en `docs/logbook.md`
- [ ] Evidencia de validación documentada
- [ ] Impacto, riesgos y rollback documentados
- [ ] Referencias cruzadas log ↔ IMP ↔ artefactos completas
