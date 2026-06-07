# IMP-20260606-002 — Frente institucional por fases

## Metadatos

| Campo       | Valor |
|-------------|-------|
| **ID**      | IMP-20260606-002 |
| **Fecha**   | 2026-06-06 |
| **Owner**   | Denny |
| **Estado**  | planning |
| **Log ref** | LOG-20260606-005 |

## Objetivo

Ordenar en un solo frente los cambios institucionales de bajo y medio riesgo del sitio: localización pública transitoria, mensajes de crédito con resguardo legal, y assets visuales de `/servicios`, `/nosotros` y `/contacto`, con ejecución escalonada por fases.

## Alcance

**Incluye:**
- Auditoría de copies y metadata que hoy exponen `Las Condes` o dirección específica
- Auditoría de superficies que muestran cuota, monto mensual o promesa de financiamiento
- Auditoría estática de referencias visuales en `app/servicios/page.tsx`, `app/nosotros/page.tsx` y `app/contacto/page.tsx`
- Documento SOT de imágenes y roadmap por fases

**Excluye:**
- Catálogo/fotos por vehículo en Sanity
- Cambios de negocio fuera del frente institucional
- Implementación visual o cambio de componentes en esta etapa documental
- Optimización de peso/formato fuera de las páginas institucionales

## Estado base verificado

- [x] Verificadas las imágenes reales de `/servicios`, `/nosotros` y `/contacto`
- [x] Detectados faltantes y desajustes de ratio/composición
- [x] Detectados puntos de copy con dirección específica o referencia a `Las Condes`
- [x] Detectadas superficies de cuota/mensualidad que necesitan lenguaje más claramente referencial
- [x] Documentados assets, formatos, tamaños y prioridades en `IMAGES-SOT.md`
- [x] Estructurado el frente por fases en `ROADMAP.md`

## Fases del frente

- **Fase 0 — Diagnóstico y SOT** ✅  
  Baseline del frente, matriz de imágenes y verificación de touchpoints de copy.
- **Fase 1 — Localización pública transitoria**  
  Reemplazar la dirección visible por `Lo Barnechea` y eliminar promesas que impliquen local físico exacto mientras se busca nuevo espacio.
- **Fase 2 — Crédito referencial / resguardo legal**  
  Hacer explícito en todas las superficies relevantes que montos y cuotas son aproximados/referenciales y que la cifra final depende de la financiera y la evaluación.
- **Fase 3 — Assets institucionales**  
  Subida y conexión de imágenes institucionales priorizadas por el SOT.
- **Fase 4 — Ajuste visual de consignación y equipo**  
  Resolver el encaje visual del bloque “Diseños de Consignación” y habilitar correctamente la foto del equipo en `/nosotros`.

## Impacto esperado

Menos riesgo legal/comercial en copy público, menos inconsistencia entre presencia real y presencia publicada, y mejor control sobre qué assets subir y cuándo hacerlo.

## Riesgos

| Riesgo | Probabilidad | Mitigación |
|--------|-------------|------------|
| Mantener mapa o dirección exacta mientras el negocio está “en búsqueda de local” genera inconsistencia pública | alta | Tratar localización como fase separada y revisar juntos texto + mapa + metadata |
| Cuotas “desde X/mes” sin matiz suficiente se interpreten como promesa firme | alta | Normalizar copy a “referencial/aprox.” + disclaimer visible en todas las superficies críticas |
| Se suben imágenes con ratio incorrecto y vuelven a recortarse mal | media | Usar el SOT como checklist antes de exportar/subir |
| Se sube `mario.jpg` pero no se ve porque la tarjeta aún usa placeholder manual | alta | Mantenerlo explícito en el SOT: ese asset requiere también cambio de código |
| Se fuerzan diseños de consignación horizontales en un layout 4:5 | alta | Priorizar nuevas piezas verticales 4:5 o cambiar el componente en una segunda fase |

## Rollback

No aplica por ahora: esta iniciativa crea documentación de decisión, no cambia comportamiento de la app.

## Evidencia de validación

- [x] Revisión estática de referencias visuales completada
- [x] Revisión estática de localización/copy de crédito completada
- [x] Ratios del layout contrastados con los assets actuales
- [x] SOT creado con rutas, formato, tamaño y prioridad
- [x] Roadmap por fases creado
- [x] Cambio registrado en `docs/logbook.md`

## Definition of Done

- [x] Carpeta `IMP-20260606-002/` con `IMP.md` existe
- [x] Decisión/acción registrada en `docs/logbook.md`
- [x] Evidencia de validación documentada
- [x] Impacto, riesgos y rollback documentados
- [x] Referencias cruzadas log ↔ IMP ↔ artefactos completas
