# Phase 8: Guía Final de Copy & Contenido - Queirolo Autos

**Documento de la Verdad** | Versión 1.0
Fecha de creación: 2026-01-19

---

## 0. Resumen Ejecutivo

### Objetivo
Mejorar todos los textos del sitio web de Queirolo Autos para optimizar conversión, claridad, tono de marca y experiencia de usuario, **sin modificar UI, estilos ni layout**.

### Datos Clave de la Empresa
| Dato | Valor Real | Valor Anterior (incorrecto) |
|------|------------|----------------------------|
| Años de experiencia | +60 años (desde 1965) | +30 años |
| Clientes atendidos | +10.000 | +5.000 |
| Vehículos vendidos | +10.000 | - |
| Stock promedio | ~50 vehículos | +200 |
| Especialidad | Todo tipo de vehículos | Solo 4x4 |
| Financiamiento | Externo (financieras) | Directo (incorrecto) |

### Cambios Críticos Identificados
1. **Eliminar** toda referencia a "financiamiento directo" → usar "financiamiento con financieras"
2. **Eliminar** foco exclusivo en "4x4" → comunicar venta de todo tipo de vehículos
3. **Actualizar** todas las estadísticas con valores reales
4. **Corregir** información sobre garantía → es externa (GarantíaTotal.com)

### Entregable
Un sitio web con copy que transmita **confianza, tradición familiar, transparencia y acompañamiento**, sin claims riesgosos ni promesas no cumplibles.

---

## 1. Alcance y Reglas

### Qué SÍ incluye esta fase
- Textos estáticos (H1, H2, párrafos, descripciones)
- Microcopy (CTAs, botones, labels, placeholders)
- Mensajes de sistema (errores, éxitos, vacíos, loading)
- Contenido de formularios (labels, validaciones)
- SEO copy básico (titles, descriptions, H1s)
- Accesibilidad textual (aria-labels, screen reader text)
- Páginas de error (404, 500)

### Qué NO incluye esta fase
- Cambios de diseño, layout o estructura
- Modificaciones de estilos CSS
- Creación de nuevos componentes UI
- Cambios en la navegación o rutas
- Implementación de nuevas funcionalidades
- Integración de backend para formularios
- Cambios en la base de datos o Sanity

### Reglas de Implementación
1. **Solo strings de texto** - No tocar lógica ni estilos
2. **Backup primero** - Guardar copy actual antes de cambiar
3. **Una página a la vez** - Implementar y validar secuencialmente
4. **Aprobación antes de commit** - Revisar cada cambio antes de guardar

---

## 2. Orden de Implementación Recomendado

### Fase 2.1: Base y Configuración
| Orden | Archivo/Sección | Cambios | Prioridad |
|-------|-----------------|---------|-----------|
| 1 | `config.ts` | Stats, meta descriptions, datos empresa | Alta |

### Fase 2.2: Páginas de Alto Impacto
| Orden | Página | Cambios Principales | Prioridad |
|-------|--------|---------------------|-----------|
| 2 | Home (`/`) | Hero H1, subtítulo, features, CTA section | Alta |
| 3 | Nosotros (`/nosotros`) | Historia real, stats, equipo | Alta |
| 4 | Servicios (`/servicios`) | Financiamiento, consignación | Alta |

### Fase 2.3: Páginas de Catálogo
| Orden | Página | Cambios Principales | Prioridad |
|-------|--------|---------------------|-----------|
| 5 | Vehículos (`/vehiculos`) | H1, subtítulo, empty states | Media |
| 6 | Detalle Vehículo | Sidebar CTAs, calculator disclaimer | Media |

### Fase 2.4: Páginas de Soporte
| Orden | Página | Cambios Principales | Prioridad |
|-------|--------|---------------------|-----------|
| 7 | Contacto (`/contacto`) | Verificar datos, ajustar copy | Media |
| 8 | 404 | Crear página personalizada | Media |
| 9 | 500 | Crear página de error | Media |

### Fase 2.5: Componentes Globales
| Orden | Componente | Cambios Principales | Prioridad |
|-------|------------|---------------------|-----------|
| 10 | Formularios | Labels, placeholders, mensajes | Media |
| 11 | Footer | Links, copyright, legal | Baja |
| 12 | Navbar | Verificar menú | Baja |
| 13 | Microcopy global | Aria-labels, tooltips | Baja |

---

## 3. Voice & Tone Oficial de Queirolo Autos

### Personalidad de Marca

**Queirolo Autos es:**
- Cercano pero profesional
- Familiar pero serio
- Apasionado pero confiable
- Transparente y directo

**Queirolo Autos NO es:**
- Frío ni corporativo
- Agresivo comercialmente
- Exagerado ni vendedor
- Impersonal ni genérico

### Tono de Comunicación

| Aspecto | Definición | Ejemplo |
|---------|------------|---------|
| **Tratamiento** | Tú (informal) | "Encuentra tu próximo auto" |
| **Registro** | Semiformal, amigable | Como hablarle a un vecino de confianza |
| **Emoción** | Cálido, entusiasta mesurado | Sin exclamaciones excesivas |
| **Honestidad** | Condiciones claras | "Sujeto a evaluación", "caso a caso" |

### Framework de Voz

> "Somos una familia que lleva más de 60 años apasionada por los autos. Te hablamos claro, te acompañamos en cada paso, y te tratamos como nos gustaría ser tratados."

### Ejemplos Prácticos

| Situación | NO escribir | SÍ escribir |
|-----------|-------------|-------------|
| CTA principal | "¡Compra ahora!" | "Ver vehículos" |
| Financiamiento | "Aprobación garantizada" | "Consulta tu financiamiento" |
| Promesa | "Los mejores precios" | "Precios transparentes" |
| Permuta | "Compramos tu auto" | "Recibimos tu auto en parte de pago" |
| Evaluación | "Crédito en 24hrs" | "Evaluación en 24-48 horas aprox." |

### Palabras Permitidas
- Te acompañamos, Estamos contigo
- Más de 60 años, Empresa familiar, Tradición
- Transparente, Sin presiones, Honesto
- Previa evaluación, Caso a caso
- Pasión por los autos, Experiencia

### Palabras a Evitar
- El mejor, Número uno, Garantizado (claims absolutos)
- Financiamiento directo (incorrecto)
- 4x4 (como especialidad exclusiva)
- Gratis (sin contexto claro)
- Inmediato, Al instante (si no es real)

---

## 4. Pilares de Mensaje / Propuesta de Valor

### Los 5 Pilares de Queirolo Autos

#### Pilar 1: TRAYECTORIA
**Mensaje central:** Más de 60 años en el rubro automotriz

| Frase permitida | Uso recomendado |
|-----------------|-----------------|
| "Más de 60 años en el rubro automotriz" | Hero, Nosotros |
| "+10.000 vehículos vendidos" | Stats, Nosotros |
| "+10.000 familias nos han elegido" | Stats, Nosotros |
| "Desde 1965 en Chile" | Footer, Nosotros |
| "Tres generaciones de pasión por los autos" | Historia |

#### Pilar 2: EMPRESA FAMILIAR
**Mensaje central:** Trato cercano y valores auténticos

| Frase permitida | Uso recomendado |
|-----------------|-----------------|
| "Una empresa familiar con valores auténticos" | Nosotros, Hero |
| "Trato cercano y personalizado" | Servicios, Home |
| "Sin presiones, sin apuros" | Servicios |
| "Te atendemos como nos gustaría ser atendidos" | Nosotros |

#### Pilar 3: TRANSPARENCIA
**Mensaje central:** Información clara y vehículos revisados

| Frase permitida | Uso recomendado |
|-----------------|-----------------|
| "Información clara desde el inicio" | Home, Servicios |
| "Revisión técnica completa antes de cada venta" | Home, Detalle |
| "Te mostramos el estado real del vehículo" | Detalle |
| "Sin sorpresas" | Home, Servicios |

#### Pilar 4: ACOMPAÑAMIENTO
**Mensaje central:** Contigo en todo el proceso

| Frase permitida | Uso recomendado |
|-----------------|-----------------|
| "Te acompañamos en todo el proceso" | Home, Servicios |
| "Asesoría personalizada" | Servicios, Contacto |
| "Resolvemos tus dudas" | Contacto, FAQ |
| "Desde la primera visita hasta la entrega" | Servicios |

#### Pilar 5: FLEXIBILIDAD (con honestidad)
**Mensaje central:** Soluciones adaptadas a cada caso

| Frase permitida | Uso recomendado |
|-----------------|-----------------|
| "Evaluamos tu caso particular" | Financiamiento |
| "Opciones de financiamiento con financieras" | Servicios |
| "Recibimos tu auto en parte de pago (previa evaluación)" | Home, Servicios |
| "Consignación personalizada" | Servicios |

### Propuesta de Valor Central

> "En Queirolo Autos encontrarás más que un auto: encontrarás una familia con más de 60 años de experiencia que te acompaña, te asesora con transparencia, y te entrega confianza en cada paso."

### Mensajes Prohibidos (Riesgos)

| NO usar | Razón | Alternativa segura |
|---------|-------|-------------------|
| "Aprobación garantizada" | No pueden garantizar | "Evaluamos tu caso" |
| "El mejor precio del mercado" | Claim no verificable | "Precios transparentes" |
| "Garantía total incluida" | Es externa y opcional | "Garantía disponible con GarantíaTotal.com" |
| "Financiamiento directo" | Usan financieras | "Financiamiento con financieras" |
| "Compramos cualquier auto" | Es caso a caso | "Evaluamos tu vehículo" |
| "Especialistas en 4x4" | Venden todo tipo | "Todo tipo de vehículos" |
| "Crédito en 24 horas" | No siempre es así | "Respuesta en 24-48 hrs aprox." |

---

## 5. Sistema de Microcopy

### 5.1 CTAs (Botones)

#### CTAs Primarios
| Acción | Texto | Contexto |
|--------|-------|----------|
| Ver catálogo | "Ver Vehículos" | Home, Navbar |
| Contacto rápido | "Consultar por WhatsApp" | Global, Cards |
| Agendar | "Agendar Visita" | Detalle, Contacto |
| Solicitar evaluación | "Solicitar Evaluación" | Financiamiento, Consignación |
| Más información | "Conocer Más" | Home, Servicios |

#### CTAs Secundarios
| Acción | Texto | Contexto |
|--------|-------|----------|
| Ver detalle | "Conocer este Vehículo" | Cards |
| Limpiar | "Limpiar Filtros" | Filtros |
| Comparar | "Comparar Ahora" | Compare bar |
| Volver | "Volver al Inicio" | 404, navegación |

### 5.2 Formularios

#### Labels y Placeholders
| Campo | Label | Placeholder |
|-------|-------|-------------|
| Nombre | "Nombre completo" | "Ej: Juan Pérez" |
| Email | "Correo electrónico" | "tucorreo@ejemplo.cl" |
| Teléfono | "Teléfono" | "+56 9 1234 5678" |
| RUT | "RUT" | "12.345.678-9" |
| Mensaje | "Mensaje" | "¿En qué podemos ayudarte?" |
| Comuna | "Comuna" | "Ej: Las Condes" |

#### Estados de Botón de Envío
| Estado | Texto |
|--------|-------|
| Normal | "Enviar Solicitud" |
| Enviando | "Enviando..." |
| Éxito | "¡Enviado!" |

### 5.3 Mensajes de Éxito

| Formulario | Mensaje |
|------------|---------|
| Contacto | "¡Gracias por escribirnos! Un asesor te contactará pronto." |
| Financiamiento | "¡Solicitud recibida! Evaluaremos tu caso y te contactaremos en las próximas horas." |
| Consignación | "¡Recibimos tu solicitud! Te contactaremos para coordinar la evaluación de tu vehículo." |

### 5.4 Mensajes de Error

| Tipo | Mensaje |
|------|---------|
| Error de envío | "No pudimos enviar tu mensaje. Intenta de nuevo o escríbenos directamente al WhatsApp." |
| Error de conexión | "Parece que hay un problema de conexión. Verifica tu internet e intenta nuevamente." |
| Error de servidor | "Algo salió mal de nuestro lado. Intenta en unos minutos o contáctanos por WhatsApp." |
| Validación campo | Mensajes inline específicos (ej: "Ingresa un email válido") |

### 5.5 Estados Vacíos (Empty States)

| Contexto | Mensaje |
|----------|---------|
| Vehículos sin resultados | "No encontramos vehículos con esos filtros. Prueba con otros criterios o explora todo nuestro stock." |
| Sin favoritos | "Aún no tienes favoritos. Explora nuestros vehículos y guarda los que te interesen." |
| Sin comparar | "Agrega vehículos para compararlos lado a lado." |
| Sin características | "Este vehículo no tiene características adicionales registradas." |

### 5.6 Estados de Carga (Loading)

| Contexto | Mensaje |
|----------|---------|
| Cargando vehículos | "Cargando vehículos..." |
| Buscando | "Buscando opciones..." |
| Enviando formulario | "Procesando tu solicitud..." |
| Calculando cuota | "Calculando..." |

### 5.7 Badges y Etiquetas

| Badge | Texto | Criterio |
|-------|-------|----------|
| Nuevo | "RECIÉN LLEGADO" | Vehículos < 7 días en stock |
| Destacado | "DESTACADO" | Vehículos priorizados manualmente |
| Reservado | "RESERVADO" | En proceso de venta |

---

## 6. Guía por Vista

### 6.1 Home (`/`)

#### Hero Section
```
H1: "Queirolo Autos: Tu próximo auto con la confianza de siempre"

Subtítulo: "Venta, consignación y más de 60 años acompañándote.
           Desde Las Condes para todo Chile."

CTA Primario: "Ver Vehículos"
CTA Secundario: "Conocer Nuestra Historia"
```

#### Features Section
| Feature | Título | Descripción |
|---------|--------|-------------|
| 1 | "Revisión Técnica Completa" | "Cada vehículo pasa por una inspección exhaustiva antes de estar disponible." |
| 2 | "Financiamiento con Financieras" | "Te ayudamos a encontrar opciones de crédito adaptadas a tu situación." |
| 3 | "Recibimos tu Auto" | "Evaluamos tu vehículo actual como parte de pago." |
| 4 | "Trámites Online" | "Transferencia con clave única y procesos digitales sin complicaciones." |

#### CTA Section Final
```
Título: "¿Listo para tu próximo auto?"
Descripción: "Visítanos en Las Condes o escríbenos.
              Te atendemos sin presiones y resolvemos todas tus dudas."

CTA 1: "Contactar por WhatsApp"
CTA 2: "Ver Ubicación"
```

### 6.2 Vehículos (`/vehiculos`)

```
H1: "Nuestros Vehículos"
Subtítulo: "Explora nuestro stock actual, seleccionado con estándares de calidad."

Filtros:
- Label grupo: "Filtrar Resultados"
- Botón limpiar: "Limpiar Todo"
- Botón móvil: "Ver [X] Vehículos"

Empty State: "No encontramos vehículos con esos filtros.
              Prueba con otros criterios o explora todo nuestro stock."

Error State: "No pudimos cargar el inventario.
              Refresca la página o vuelve en unos minutos."
```

### 6.3 Detalle Vehículo (`/vehiculos/[slug]`)

#### Sidebar CTAs
```
Card título: "¿Te interesa este vehículo?"

CTA 1: "Consultar por WhatsApp"
CTA 2: "Agendar Visita"
CTA 3: "Consultar Financiamiento" (antes: "Solicitar Financiamiento")

Calculadora título: "Simula tu Cuota"
Calculadora descripción: "Calcula una cuota mensual aproximada"
Calculadora CTA: "Ver Calculadora Completa"
```

#### Calculadora Disclaimer
```
"Valores referenciales. La cuota final depende de la evaluación crediticia
y las condiciones de la financiera. CAE informado al momento de la solicitud."
```

#### Tabs
- "Especificaciones"
- "Características"

### 6.4 Servicios (`/servicios`)

```
H1: "Servicios"
Subtítulo: "Conoce cómo podemos ayudarte"
```

#### Tab Financiamiento
```
Título: "Financiamiento con Financieras"
Descripción: "Te ayudamos a encontrar la mejor opción de crédito
              para tu próximo auto."

Beneficios:
1. "Evaluación Rápida" - "Respuesta en 24 a 48 horas aproximadamente"
2. "Plazos de 12 a 60 Meses" - "Elige el plazo que mejor se adapte a ti"
3. "Pie desde 20%" - "Flexibilidad en el monto inicial"
4. "Casos Especiales" - "Evaluamos cada situación de forma particular"

Pasos:
1. "Completa el formulario con tus datos"
2. "Evaluamos tu perfil con nuestras financieras"
3. "Te contactamos con las opciones disponibles"
4. "Elige la mejor y retira tu vehículo"

Disclaimer: "El financiamiento está sujeto a evaluación crediticia.
             Los plazos, tasas y condiciones dependen del perfil del cliente
             y de la financiera seleccionada."
```

#### Tab Consignación
```
Título: "Consignación de Vehículos"
Descripción: "Vendemos tu auto por ti, sin que tengas que preocuparte por nada."

Beneficios:
1. "Sin Prendas" - "Solo recibimos vehículos sin gravámenes"
2. "Retiro Cuando Desees" - "Tu auto es tuyo hasta que se venda"
3. "Evaluación Personalizada" - "Cada caso se analiza individualmente"
4. "Gestión Completa" - "Nos encargamos de todo el proceso de venta"

Requisitos:
- "Vehículo sin prendas ni gravámenes"
- "Documentación al día"
- "Evaluación previa del vehículo"

CTA: "Solicitar Evaluación para Consignación"
```

#### Tab Compra con Deuda / Parte de Pago
```
Título: "Recibimos tu Auto en Parte de Pago"
Descripción: "¿Tienes un auto que quieres dar en parte de pago?
              Lo evaluamos y te entregamos un valor justo."

Proceso:
1. "Traes tu vehículo para evaluación"
2. "Descontamos cualquier deuda pendiente"
3. "El saldo restante se aplica a tu nuevo auto"

Nota: "Si tu auto tiene deuda, la descontamos del valor y realizamos
       todos los trámites de transferencia."

CTA: "Consultar Evaluación"
```

### 6.5 Nosotros (`/nosotros`)

```
H1: "Más que una Automotora"
Subtítulo: "Conoce nuestra historia y el compromiso que nos mueve"
```

#### Stats (VALORES REALES)
```
Stat 1: "+60 Años de Experiencia"
Stat 2: "+10.000 Familias Atendidas"
Stat 3: "+10.000 Vehículos Vendidos"
Stat 4: "~50 Vehículos en Stock"
```

#### Historia
```
Título: "Nuestra Historia"

Párrafo 1:
"Queirolo Autos nace en los años 50-60, fundada por Don Mario Queirolo
Stagnaro, quien comenzó con Frenos Queirolo, un local ubicado en el
centro de Santiago dedicado a la reparación de frenos y la importación
de autos y repuestos."

Párrafo 2:
"Proveniente de una familia italiana que migró a Chile entre 1890 y 1910,
Don Mario también fue un apasionado corredor de Turismo Carretera,
dejando un fuerte legado automovilístico en su familia."

Párrafo 3:
"Con los años, la empresa evolucionó desde la importación hasta convertirse
en Queirolo Mundo 4x4 y luego en la actual Queirolo Autos, adaptándose a
cada época, incluso durante tiempos difíciles como el estallido social y
la pandemia."

Párrafo 4:
"Hoy somos una empresa consolidada, reconocida por nuestra calidad, cercanía
y pasión por los autos, manteniéndonos siempre como un proyecto familiar
con valores firmes y auténticos."
```

#### Equipo
```
Nombre: Mario Queirolo
Cargo: Dueño
Bio: "Representa la continuación del legado automovilístico de la familia
      Queirolo en Chile. Al igual que su padre, Don Mario Queirolo Stagnaro,
      también se destacó como corredor de autos en competencias de Turismo
      Carretera, demostrando la misma pasión por la velocidad y el
      automovilismo que marcó generaciones."
```

#### Misión y Valores
```
Misión:
"Ofrecemos soluciones automotrices confiables, transparentes y cercanas
para personas que buscan un vehículo de calidad, acompañándolas en todo
el proceso con pasión y experiencia."

Valores:
1. Confianza
2. Cercanía
3. Pasión por los autos
```

#### Garantía (Nota importante)
```
Título: "Garantía Disponible"
Descripción: "En Queirolo Autos trabajamos con GarantíaTotal.com, una empresa
              reconocida en protección de vehículos usados. La garantía cubre
              fallas mecánicas en sistemas importantes, incluye repuestos y
              mano de obra, y cuenta con red de talleres a nivel nacional."

Nota: "La garantía es proporcionada por un tercero especializado.
       Consulta las condiciones específicas al momento de la compra."
```

### 6.6 Contacto (`/contacto`)

```
H1: "Contáctanos"
Subtítulo: "Estamos aquí para ayudarte a encontrar tu próximo auto"
```

#### Información de Contacto
```
Dirección: "Av. Las Condes 12461, Local 4A, Las Condes, Santiago"
WhatsApp: "+56 9 7214-9979"
Teléfono: "+56 2 4367-0362"
Email: "contacto@queirolo.cl"

Horario:
- Lunes a Viernes: 09:30 - 18:00
- Sábado: Con cita previa
- Domingo y Feriados: Cerrado
```

### 6.7 Páginas de Error

#### 404 (Not Found)
```
H1: "Esta página tomó un desvío"
Descripción: "Parece que la página que buscas no existe o fue movida.
              Vuelve al inicio o explora nuestro catálogo."

CTA 1: "Volver al Inicio"
CTA 2: "Ver Vehículos"
```

#### 500 (Server Error)
```
H1: "Algo salió mal de nuestro lado"
Descripción: "Estamos trabajando para solucionarlo.
              Intenta de nuevo en unos minutos o contáctanos por WhatsApp."

CTA 1: "Reintentar"
CTA 2: "Contactar por WhatsApp"
```

### 6.8 Footer

```
Secciones:
- "Enlaces Rápidos": Inicio, Vehículos, Servicios, Nosotros, Contacto
- "Servicios": Financiamiento, Consignación, Parte de Pago
- "Contacto": (datos desde config)

Legal:
- Link: "Política de Privacidad"
- Link: "Términos y Condiciones"

Copyright: "© {año} Queirolo Autos. Todos los derechos reservados."
Hecho en: "Hecho con pasión en Chile"
```

### 6.9 SEO Copy Básico

| Página | Title | Meta Description |
|--------|-------|------------------|
| Home | "Queirolo Autos - Venta de Vehículos Seminuevos en Las Condes" | "Más de 60 años vendiendo autos con confianza. Venta, consignación y financiamiento en Las Condes, Santiago. Visítanos sin compromiso." |
| Vehículos | "Vehículos Disponibles - Queirolo Autos" | "Explora nuestro stock de vehículos seminuevos certificados. Financiamiento disponible y parte de pago. Las Condes, Santiago." |
| Servicios | "Servicios - Financiamiento y Consignación - Queirolo Autos" | "Financiamiento con financieras, consignación de vehículos y recepción en parte de pago. Conoce todos nuestros servicios." |
| Nosotros | "Nuestra Historia - Queirolo Autos" | "Conoce la historia de Queirolo Autos. Más de 60 años de tradición familiar, confianza y pasión por los autos en Chile." |
| Contacto | "Contacto - Queirolo Autos Las Condes" | "Visítanos en Av. Las Condes 12461. Atención personalizada de lunes a viernes. Escríbenos por WhatsApp." |

---

## 7. Checklist de Implementación Segura + QA

### 7.1 Checklist Pre-Implementación

#### Por cada página, verificar:
- [x] Copy revisado y aprobado según esta guía
- [x] No hay claims absolutos ("el mejor", "garantizado")
- [x] No hay promesas de tiempos exactos sin "aproximado"
- [x] Disclaimers incluidos donde corresponde
- [x] Consistencia de tú/usted (siempre tú)

#### Verificación global:
- [x] `config.ts` actualizado con datos reales
- [x] Stats corregidas (+60 años, +10.000)
- [x] Ninguna referencia a "financiamiento directo"
- [x] Ninguna referencia exclusiva a "4x4"
- [x] Datos de contacto actualizados (email: contacto@queirolo.cl)

### 7.2 Checklist Post-Implementación

#### Revisión funcional:
- [x] Lectura en voz alta de cada página (¿suena natural?)
- [x] Tono consistente en todas las páginas
- [x] Links de WhatsApp funcionan correctamente
- [x] Formularios muestran mensajes de éxito/error
- [x] Estados vacíos se muestran correctamente
- [x] Loading states visibles donde corresponde
- [x] 404 personalizada funciona
- [x] 500 personalizada funciona

#### Revisión de accesibilidad:
- [x] Aria-labels actualizados
- [x] Screen reader text coherente
- [x] Contraste de texto legible

### 7.3 Checklist por Vista

#### Home
- [x] H1 sin referencia a 4x4
- [x] Subtítulo menciona venta y consignación
- [x] Features actualizadas (sin financiamiento directo)
- [x] CTA section revisada

#### Nosotros
- [x] Stats con valores reales
- [x] Historia real de la empresa
- [x] Equipo con datos reales (Mario Queirolo)
- [x] Misión y valores incluidos

#### Servicios
- [x] Financiamiento indica "con financieras"
- [x] Disclaimer de evaluación presente
- [x] Consignación indica "sin prendas"
- [x] Parte de pago explicado correctamente

#### Vehículos
- [x] H1 genérico (no 4x4)
- [x] Empty state amigable
- [x] Error state con alternativa

#### Detalle Vehículo
- [x] CTAs claros sin promesas
- [x] Calculadora con disclaimer
- [x] Tabs correctamente nombrados

#### Contacto
- [x] Datos verificados
- [x] Email: contacto@queirolo.cl
- [x] Horarios correctos

#### Formularios
- [x] Labels en español correcto
- [x] Placeholders útiles
- [x] Mensajes de éxito específicos por formulario
- [x] Mensajes de error con alternativa (WhatsApp)

#### 404 / 500
- [x] Páginas creadas y funcionando
- [x] CTAs útiles (volver, WhatsApp)

---

## 8. Referencias y Assets

### 8.1 Carpeta de Testimonios

**Ubicación:** `/claudedocs/08-Phase8-CopyContent/fotos_recomendaciones`

**Contenido:** 16 capturas de pantalla con recomendaciones de Google de clientes reales.

**Uso recomendado:**
1. Revisar las capturas para extraer nombres y testimonios textuales
2. Solicitar permiso al cliente para usar nombres reales (o usar iniciales)
3. Incorporar testimonios en la página "Nosotros" o crear sección dedicada
4. Usar como respaldo para claims de satisfacción del cliente

**Proceso sugerido:**
1. Transcribir manualmente los testimonios de las capturas
2. Obtener aprobación del cliente para uso de nombres
3. Formatear para la web manteniendo autenticidad

### 8.2 Documentos Fuente

| Documento | Ubicación | Propósito |
|-----------|-----------|-----------|
| PHASE8_COPY_CONTENT_GUIDE.md | `/claudedocs/08-Phase8-CopyContent/` | Auditoría técnica del copy actual |
| PHASE8_FASTQUESTIONS.md | `/claudedocs/08-Phase8-CopyContent/` | Respuestas del cliente (fuente de verdad para datos) |
| config.ts | `/config.ts` | Configuración central del sitio |
| CLAUDE.md | `/claudedocs/CLAUDE.md` | Contexto técnico del proyecto |

### 8.3 Archivos a Modificar (Referencia)

**Contenido estático:**
- `config.ts` - Datos de empresa, SEO, mensajes
- `app/page.tsx` - Home
- `app/vehiculos/page.tsx` - Listado
- `app/vehiculos/[slug]/page.tsx` - Detalle
- `app/servicios/page.tsx` - Servicios
- `app/nosotros/page.tsx` - Nosotros
- `app/contacto/page.tsx` - Contacto

**Componentes:**
- `components/forms/*.tsx` - Formularios
- `components/vehicles/*.tsx` - Cards, filtros, comparador
- `components/layout/*.tsx` - Navbar, Footer

**Nuevos archivos:**
- `app/not-found.tsx` - Página 404
- `app/error.tsx` - Página 500

---

## 9. Changelog

| Fecha | Versión | Cambios |
|-------|---------|---------|
| 2026-01-19 | 1.0 | Creación del documento final consolidando PHASE8_COPY_CONTENT_GUIDE.md y PHASE8_FASTQUESTIONS.md |
| 2026-01-20 | 1.1 | Implementación del copy Phase 8 en páginas, formularios, metadata SEO y páginas de error. Checklist actualizado. |

### Resumen de Consolidación v1.0

**De PHASE8_COPY_CONTENT_GUIDE.md:**
- Estructura de auditoría de copy actual
- Inventario de páginas y componentes
- Checklist de implementación base

**De PHASE8_FASTQUESTIONS.md:**
- Datos reales de la empresa (stats, historia, equipo)
- Propuesta de valor y diferenciadores
- Correcciones críticas (financiamiento, 4x4, garantía)
- Tono de comunicación deseado
- Información de contacto verificada
- Referencia a fotos de testimonios

**Agregado en este documento:**
- Voice & Tone estructurado con ejemplos
- Pilares de mensaje con frases permitidas
- Sistema completo de microcopy
- Plantillas por vista con copy sugerido
- Checklist de QA detallado
- Orden de implementación priorizado
- Disclaimers y restricciones legales
- SEO copy básico

---

**FIN DEL DOCUMENTO**

*Este documento es la fuente de verdad para toda implementación de copy en Phase 8. Cualquier cambio debe ser documentado en el Changelog.*
