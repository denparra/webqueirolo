# Roadmap por fases — frente institucional

Este roadmap divide el frente abierto en fases pequeñas, con bajo riesgo de regresión y decisiones claras antes de tocar código.

## Resumen ejecutivo

Orden recomendado:

1. **Fase 1 — Localización pública transitoria**
2. **Fase 2 — Crédito referencial / resguardo legal**
3. **Fase 3 — Assets institucionales**
4. **Fase 4 — Ajuste visual de consignación y equipo**

## Fase 0 — Diagnóstico y SOT ✅

### Ya cubierto
- Inventario de imágenes institucionales
- Detección del descalce visual en “Diseños de Consignación”
- Detección de copys con `Las Condes` o dirección específica
- Detección de superficies con mensajes de cuota/mensualidad

### Artefactos
- `IMAGES-SOT.md`
- `IMP.md`

## Fase 1 — Localización pública transitoria

### Objetivo
Reflejar que hoy la marca está operando en búsqueda de local y que la referencia pública debe ser solo **“Lo Barnechea”**.

### Cambios a estructurar
- Reemplazar textos visibles de dirección exacta por `Lo Barnechea`
- Revisar menciones de `Las Condes` en:
  - `config.ts`
  - `app/contacto/page.tsx`
  - `app/page.tsx`
  - `components/layout/Navbar.tsx`
  - `components/layout/Footer.tsx`
  - `app/servicios/page.tsx`
  - metadata/SEO relacionadas
- Revisar si el mapa sigue siendo válido; **recomendación**: si ya no representa la operación real, ocultarlo o degradarlo a contacto por WhatsApp hasta tener nuevo local

### Resultado esperado
La web deja de prometer una ubicación exacta desactualizada y comunica una presencia territorial compatible con el estado actual del negocio.

## Fase 2 — Crédito referencial / resguardo legal

### Objetivo
Dejar CLARÍSIMO que los montos y cuotas son aproximados/referenciales y que la cifra final depende de la financiera y la evaluación del cliente.

### Superficies detectadas
- `components/forms/LoanCalculator.tsx`
- `app/servicios/page.tsx`
- `components/home/FeaturedVehicleCard.tsx`
- `components/vehicles/VehicleCard.tsx`
- `app/vehiculos/[slug]/page.tsx`
- mensajes generales de home relacionados a crédito

### Cambios a estructurar
- Renombrar labels sensibles:
  - `Cuota Mensual` → `Cuota mensual referencial`
  - `Desde $X/mes` → `Desde aprox. $X/mes` o equivalente consistente
- Unificar disclaimer:
  - monto referencial
  - sujeto a evaluación crediticia
  - cuota exacta depende de la financiera y condiciones aprobadas
- Revisar que FAQ/copy de servicios no contradigan el disclaimer

### Resultado esperado
La web informa crédito sin dar apariencia de oferta cerrada o promesa contractual.

## Fase 3 — Assets institucionales

### Objetivo
Subir solo los assets que realmente aportan a `/servicios`, `/nosotros` y `/contacto`, con formato y ratio correctos.

### Prioridad recomendada
1. `history.jpg` cuadrada `1:1`
2. `c1.png` vertical `4:5`
3. `c2.png` vertical `4:5`
4. `mario.jpg` vertical `3:4`
5. `showroom.jpg` HD opcional

### Referencia
- Ver detalle completo en `IMAGES-SOT.md`

## Fase 4 — Ajuste visual de consignación y equipo

### Objetivo
Cerrar el frente visualmente, no solo por carga de archivos.

### Cambios a estructurar
- `/servicios`:
  - mantener layout actual si llegan nuevas piezas 4:5
  - o ajustar componente si se decide conservar assets no ideales
- `/nosotros`:
  - reemplazar placeholder manual de equipo por imagen real cuando exista `mario.jpg`

### Resultado esperado
Los assets institucionales no solo existen: se ven coherentes con el layout y comunican bien.

## Secuencia recomendada de ejecución

- **Primero:** Fase 1  
  Porque hoy hay una incoherencia pública más delicada que lo visual.
- **Segundo:** Fase 2  
  Porque reduce riesgo legal/comercial en mensajes de crédito.
- **Tercero:** Fase 3  
  Porque ya podrás subir assets con especificación cerrada.
- **Cuarto:** Fase 4  
  Porque depende de las decisiones tomadas en Fase 3.
