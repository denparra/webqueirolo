# Roadmap por fases — frente institucional

Este roadmap divide el frente abierto en fases pequeñas, con bajo riesgo de regresión y decisiones claras antes de tocar código.

## Resumen ejecutivo

Orden recomendado:

1. **Fase 1 — Localización pública transitoria** ✅ (2026-06-07)
2. **Fase 2 — Crédito referencial / resguardo legal** ✅ (2026-06-07)
3. **Fase 3 — Assets institucionales** 🟡 (consignación `banner.jpg` ✅; falta `history.jpg`, `mario.jpg`)
4. **Fase 4 — Ajuste visual de consignación y equipo** 🟡 (consignación ✅; falta equipo `/nosotros`)

## Fase 0 — Diagnóstico y SOT ✅

### Ya cubierto
- Inventario de imágenes institucionales
- Detección del descalce visual en “Diseños de Consignación”
- Detección de copys con `Las Condes` o dirección específica
- Detección de superficies con mensajes de cuota/mensualidad

### Artefactos
- `IMAGES-SOT.md`
- `IMP.md`

## Fase 1 — Localización pública transitoria ✅ (2026-06-07)

> **Completado.** Decisión del owner: usar **"Lo Barnechea"** como referencia pública y mantener el mapa pero a **nivel zona** (no dirección exacta). Cambios aplicados:
> - `config.ts`: `address.street` vaciado, `city`/`fullAddress`/`displayAddress` → `Lo Barnechea, Santiago`, coordenadas movidas a zona Lo Barnechea (`-33.3496, -70.5176`), tagline y SEO (title/description/keywords) → Lo Barnechea.
> - `lib/seo.ts`: title default, keyword y `geo` → Lo Barnechea; `streetAddress` del JSON-LD ahora es **condicional** (se omite si no hay calle exacta).
> - `app/contacto/page.tsx`: metadata title/description sin dirección exacta.
> - `app/vehiculos/layout.tsx`: description → Lo Barnechea.
> - `components/maps/LazyContactMap.tsx`: `zoom` 16 → 13 (vista de zona).
> - `app/page.tsx`: CTA "Visítanos en Lo Barnechea".
> - `components/home/StatsBar.tsx`: stat "Las Condes" → "Lo Barnechea".
> - Footer y FAQ de servicios se actualizan solos (consumen `config`).
> - Nota: el placeholder `Ej: Las Condes` en `FinancingForm` se dejó: es la comuna **del cliente**, no del negocio.

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

## Fase 2 — Crédito referencial / resguardo legal ✅ (2026-06-07)

> **Completado.** Cambios aplicados:
> - `components/forms/LoanCalculator.tsx`: "Cuota Mensual" → "Cuota mensual referencial" (ya tenía disclaimer de valores referenciales + CAE).
> - `components/vehicles/VehicleCard.tsx` y `components/home/FeaturedVehicleCard.tsx`: "Desde $X/mes" → "Desde aprox. $X/mes".
> - `app/vehiculos/[slug]/page.tsx`: "o desde $X/mes" → "o desde aprox. $X/mes".
> - **Promesa de financiamiento**: se eliminó el "100%" (no dan financiamiento del 100%). `app/page.tsx` tarjeta y `StatsBar` ahora muestran "Financieras".

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

## Fase 4 — Ajuste visual de consignación y equipo 🟡 (consignación ✅, equipo cableado 2026-06-07)

> **Avance:** Consignación cerrada (banner único 16:5 sin overlay). Tarjeta de equipo en `/nosotros` **cableada** con `<Image>` condicional + `imageAlt` (`app/nosotros/page.tsx`); cae a placeholder si el archivo aún no existe. Falta solo subir `mario.jpg` (auto Turismo Carretera, 3:4) y `history.jpg` (1:1) — F3.

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

## Mejoras adicionales ✅ (2026-06-07)

Pedidas por el owner junto con F1/F2:

- **Sección "¿Por qué elegir Queirolo Autos?" (`app/page.tsx`)**:
  - Tarjeta 1: reemplazada por completo — stat "60+" (no calzaba, ya está en el subtítulo) → "✓", tema mantenido en "Revisión Técnica Completa".
  - Tarjeta 2: stat "100%" → "Financieras".
  - Tarjetas "Recibimos tu Auto" (Parte) y "Trámites Online" se conservaron.
- **Consistencia "+10.000"**: `StatsBar` mostraba "500+ Autos vendidos" (incoherente con `/nosotros` que dice "+10.000 Vehículos Vendidos"). Unificado a "+10.000 Vehículos vendidos".
- **Tildes/ñ en "años"**: corregido `anos`→`años` en `StatsBar` y home; `ano`→`año` en `/privacidad`. También tildes rotas del home (`Mas`, `Visitanos`, `Tramites`, `credito`, `situacion`, `proximo`, `Ubicacion`, etc.) y `RECIEN`→`RECIÉN` en `FeaturedVehicleCard` (consistente con `VehicleCard`).

> Validación: `npm run lint` ✅ sin errores. Sin `npm run build` (regla del proyecto).

## Secuencia recomendada de ejecución

- **Primero:** Fase 1  
  Porque hoy hay una incoherencia pública más delicada que lo visual.
- **Segundo:** Fase 2  
  Porque reduce riesgo legal/comercial en mensajes de crédito.
- **Tercero:** Fase 3  
  Porque ya podrás subir assets con especificación cerrada.
- **Cuarto:** Fase 4  
  Porque depende de las decisiones tomadas en Fase 3.
