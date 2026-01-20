# Phase 8: Copy & Content Optimization

## Objetivo

Mejorar todos los textos del sitio web de Queirolo Autos para optimizar conversión, claridad, tono de marca y experiencia de usuario. Esta fase se centra **exclusivamente en contenido textual** (copy), no en UI, estilos ni layout.

---

## Alcance

### Páginas Principales
| Página | Ruta | Estado Actual |
|--------|------|---------------|
| Home | `/` | H1: "Tu Próximo 4x4 Está Aquí" |
| Vehículos | `/vehiculos` | H1: "Vehículos Disponibles" |
| Detalle Vehículo | `/vehiculos/[slug]` | Dinámico por vehículo |
| Servicios | `/servicios` | H1: "Nuestros Servicios" (tabs) |
| Nosotros | `/nosotros` | H1: "Más que una Automotora" |
| Contacto | `/contacto` | H1: "Contáctanos" |
| Privacidad | `/privacidad` | Pendiente verificar |
| Términos | `/terminos` | Pendiente verificar |
| 404/500 | No existen | Crear páginas de error |

### Microcopy
- CTAs (botones primarios y secundarios)
- Labels de formularios
- Placeholders
- Mensajes de validación/error
- Estados vacíos (empty states)
- Mensajes de carga (loading)
- Badges y etiquetas
- Tooltips y ayudas contextuales
- Screen reader (aria-labels)

---

## Auditoría de Copy Actual

### 1. Home (`app/page.tsx`)

#### Hero Section
```
H1: "Tu Próximo 4x4 Está Aquí"
Tagline: (desde config.ts) "Vehículos seminuevos certificados con
         financiamiento directo y sin complicaciones. Desde Las Condes
         para todo Chile."
CTA primario: "Ver Vehículos Disponibles"
CTA secundario: "Simular Financiamiento"
```

#### Features Section
| Feature | Texto Actual |
|---------|-------------|
| Feature 1 | "Vehículos Certificados" |
| Feature 2 | "Financiamiento Directo" |
| Feature 3 | "Permuta Disponible" |
| Feature 4 | "Proceso Rápido" |

#### CTA Section
```
"¿Listo para tu próximo vehículo?"
"Contáctanos hoy y agenda una visita o prueba de manejo sin compromiso."
Botón 1: "Contactar por WhatsApp"
Botón 2: "Ver Ubicación"
```

### 2. Vehículos (`app/vehiculos/page.tsx`)

```
H1: "Vehículos Disponibles"
Subtitle: "Encuentra tu próximo 4x4 entre nuestros vehículos certificados"

Empty State: "No se encontraron vehículos con los filtros seleccionados"
Error State: "No se pudo cargar el inventario. Reintenta en unos segundos."
Loading: (no hay mensaje visible)
```

#### Filtros
- "Filtrar Resultados"
- "Limpiar Todo"
- Labels: Marca, Precio (CLP), Año, Kilometraje Máximo, Transmisión, Combustible
- Botón móvil: "Ver X Vehículos"

### 3. VehicleCard (`components/vehicles/VehicleCard.tsx`)

```
Badge: "RECIÉN LLEGADO"
Precio mensual: "o desde $X/mes"
CTA: "Ver Detalles"
Aria-labels:
  - "Agregar a favoritos"
  - "Comparar vehículo"
  - "Consultar por WhatsApp"
```

### 4. Detalle Vehículo (`app/vehiculos/[slug]/page.tsx`)

```
Breadcrumb: "Vehículos / {Marca} {Modelo}"
Precio mensual: "o desde $X/mes"

Sidebar:
  - Card title: "¿Interesado en este vehículo?"
  - "Consultar por WhatsApp"
  - "Agendar Visita"
  - "Solicitar Financiamiento"
  - "Simula tu Cuota"
  - "Calcula tu cuota mensual aproximada"
  - "Ver Calculadora Completa"

Tabs:
  - "Especificaciones"
  - "Características"

Empty features: "No hay características registradas"

Spec labels: Año, Kilometraje, Transmisión, Combustible, Motor, Potencia, Torque, Tracción, Asientos, Color
```

### 5. Comparador (`components/vehicles/CompareBar.tsx`, `CompareModal.tsx`)

```
Bar: "Comparando (X/3):"
Botones: "Limpiar", "Comparar Ahora"
Modal title: "Comparación de Vehículos"
Table headers: Año, Kilometraje, Transmisión, Combustible, Motor, Potencia, Tracción
CTA: "Ver Detalles"
```

### 6. Servicios (`app/servicios/page.tsx`)

```
H1: "Nuestros Servicios"
Subtitle: "Conoce todas las formas en que podemos ayudarte"

Tabs:
  - "Financiamiento"
  - "Consignación"
  - "Contacto"

Financiamiento benefits:
  - "Aprobación Inmediata"
  - "Sin Deuda Registrada"
  - "Tasas Competitivas"
  - "Plazos Flexibles"

Financiamiento steps:
  - "Completa el formulario"
  - "Evaluamos tu perfil"
  - "Aprobación en 24hrs"
  - "Retira tu vehículo"

Consignación:
  - "Vendemos tu auto por ti"
  - "¿Quieres vender tu vehículo...?"
```

### 7. Nosotros (`app/nosotros/page.tsx`)

```
H1: "Más que una Automotora"
Subtitle: "Conoce nuestra historia y compromiso contigo"

Stats (⚠️ PLACEHOLDER - verificar con cliente):
  - "+30 Años de Experiencia"
  - "+5000 Clientes Felices"
  - "+200 Vehículos en Stock"
  - "100% Garantía de Calidad"

Historia: "Nuestra Historia" (texto genérico)

Equipo (⚠️ PLACEHOLDER - verificar con cliente):
  - "Roberto Queirolo" - CEO
  - "Carlos Queirolo" - Director Comercial
  - "Ana García" - Gerente de Ventas

Testimonios (⚠️ PLACEHOLDER):
  - "Cliente Satisfecho" (nombres genéricos)
  - Textos genéricos de testimonios
```

### 8. Contacto (`app/contacto/page.tsx`)

```
H1: "Contáctanos"
Subtitle: "Estamos aquí para ayudarte a encontrar el vehículo perfecto"

Contact info labels:
  - "Dirección"
  - "Teléfono"
  - "Email"
  - "Horario"
```

### 9. Formularios

#### ContactForm
```
Title: "Contáctanos"
Description: "Déjanos tus datos y te contactaremos a la brevedad"
Labels: Nombre Completo*, Email*, Teléfono*, Mensaje*
Placeholders: "Juan Pérez", "juan@ejemplo.cl", "+56 9 1234 5678", "¿En qué podemos ayudarte?"
Submit states: "Enviar Mensaje" → "Enviando..." → "¡Enviado!"
Screen reader: "Enviando formulario, por favor espere." / "Formulario enviado exitosamente. Gracias por contactarnos."
Error alert: "Hubo un error al enviar el mensaje. Por favor intenta nuevamente."
```

#### FinancingForm
```
Title: "Solicitar Financiamiento"
Description: "Completa el formulario y te contactaremos para evaluar tu crédito"
Fieldsets: "Datos Personales", "Datos del Vehículo", "Datos del Crédito"
Labels: Nombre Completo*, RUT*, Email*, Teléfono*, Comuna*, Marca, Modelo, Año, Precio, Pie (CLP)*, Plazo (meses)*
Placeholder RUT: "12.345.678-9"
Submit states: "Solicitar Financiamiento" → "Enviando..." → "¡Solicitud Enviada!"
Screen reader: "Enviando solicitud de financiamiento, por favor espere." / "Solicitud enviada exitosamente. Te contactaremos pronto."
```

#### ConsignmentForm
```
Title: "Consigna tu Vehículo"
Description: "Déjanos los datos de tu vehículo y te contactaremos para evaluarlo"
Labels: Nombre Completo*, Teléfono*, Email*, Marca*, Modelo*, Año*, Kilometraje*, Precio Esperado*, Mensaje Adicional (Opcional)
Submit states: "Enviar Solicitud" → "Enviando..." → "¡Solicitud Enviada!"
Screen reader: "Enviando solicitud de consignación, por favor espere." / "Solicitud enviada exitosamente. Te contactaremos para evaluar tu vehículo."
```

#### LoanCalculator
```
Title: "Calcula Tu Cuota en Tiempo Real"
Labels: Precio del Vehículo, Pie (Inicial), Plazo, Tasa de Interés (Referencial)
Value display: "X meses", "12% anual"
Results: "Monto a Financiar", "Cuota Mensual", "Total a Pagar", "Capital:", "Intereses:"
CTA: "Solicitar Este Crédito"
Disclaimer: "Valores referenciales. Cuota final sujeta a evaluación crediticia. CAE informado al momento de la solicitud."
```

### 10. Footer (`components/layout/Footer.tsx`)

```
Sections:
  - "Enlaces Rápidos": Inicio, Vehículos, Servicios, Nosotros, Contacto
  - "Servicios": Financiamiento, Consignación, Compramos tu Auto
  - "Contacto": (datos desde config)

Legal links: Privacidad, Términos
Copyright: "© {year} Queirolo Autos. Todos los derechos reservados."
Powered by: "Hecho con ❤️ en Chile"
```

### 11. Navbar (`components/layout/Navbar.tsx`, `MobileNav.tsx`)

```
Menu items: Inicio, Vehículos, Servicios, Nosotros, Contacto
CTA: "WhatsApp" / "Contactar por WhatsApp"
Mobile menu title: "Menú"
Aria-labels:
  - "Llamar al +56 9..."
  - "Abrir menú de navegación"
  - "Cerrar menú"
  - "Contactar por WhatsApp"
```

---

## Inconsistencias Detectadas

### Tono y Tratamiento
| Aspecto | Estado | Recomendación |
|---------|--------|---------------|
| Tú/Usted | Consistente "tú" | ✅ Mantener |
| Formalidad | Semiformal, amigable | ✅ Apropiado para el mercado |

### Copy Placeholder (⚠️ REQUIERE DATOS REALES)
1. **Stats en /nosotros**: "+30 Años", "+5000 Clientes" - verificar cifras reales
2. **Equipo**: Nombres genéricos (Roberto, Carlos, Ana) - obtener datos reales
3. **Testimonios**: "Cliente Satisfecho" - obtener testimonios reales con nombres y fotos

### CTAs Repetitivos
- "Contactar por WhatsApp" aparece en múltiples lugares (consistente pero verificar si es intencional)
- "Ver Detalles" es genérico - podría ser más específico

### Mensajes de Error
- Todos usan `alert()` nativo - considerar mensajes inline más elegantes
- Mensaje genérico: "Hubo un error al enviar..." - podría ser más específico

### Empty States
- Solo un empty state en vehículos - verificar otros casos
- No hay página 404 ni 500 personalizada

### SEO Copy
- H1s son descriptivos y únicos ✅
- Meta descriptions definidas en config.ts ✅
- Verificar longitud de títulos para SERP

---

## Proceso Recomendado

### Paso 1: Completar FastQuestions
Antes de escribir nuevo copy, completar `PHASE8_FASTQUESTIONS.md` con el cliente para obtener:
- Información real de la empresa (años, clientes, staff)
- Testimonios reales
- Diferenciadores específicos
- Tono de voz deseado

### Paso 2: Priorizar por Impacto
1. **Alta prioridad**: Home (H1, CTAs), Vehicle cards (conversión directa)
2. **Media prioridad**: Forms (microcopy), Servicios, Contacto
3. **Baja prioridad**: Footer, legal pages

### Paso 3: Implementar por Secciones
- Cada sección debe tener copy aprobado antes de implementar
- Mantener un documento de copy aprobado para referencia

### Paso 4: Validar
- Revisar ortografía y gramática (español chileno)
- Verificar consistencia tú/usted
- Test con usuarios si es posible

---

## Checklist de Implementación

### Por Página
- [ ] Home: Hero, Features, CTA section, Featured vehicles
- [ ] Vehículos: Filters, Empty state, Cards
- [ ] Detalle: Sidebar CTAs, Specs, Features, Calculator
- [ ] Servicios: Tabs, Benefits, Steps, Forms
- [ ] Nosotros: History, Stats (REAL), Team (REAL), Testimonials (REAL)
- [ ] Contacto: Form, Contact info, Map
- [ ] 404: Crear página personalizada
- [ ] 500: Crear página personalizada

### Por Componente
- [ ] Navbar: Menu items, CTA
- [ ] Footer: Links, Legal, Copyright
- [ ] VehicleCard: Badge, Price, CTA
- [ ] CompareBar/Modal: Labels, Table headers
- [ ] Forms: Labels, Placeholders, Validations, Success/Error messages
- [ ] LoanCalculator: Labels, Disclaimer

### Por Estado
- [ ] Loading messages (donde aplique)
- [ ] Empty states (listas vacías)
- [ ] Error messages (form validation, API errors)
- [ ] Success messages (form submissions)

### Accesibilidad
- [ ] Todos los aria-labels revisados
- [ ] Screen reader announcements verificados
- [ ] Alt text de imágenes (fuera de scope pero relacionado)

---

## Entregables

1. **PHASE8_FASTQUESTIONS.md** - Preguntas para el cliente
2. **Copy final aprobado** - Documento con todo el texto validado
3. **Implementación** - Actualización de archivos tsx/ts
4. **QA** - Verificación en browser

---

## Archivos a Modificar

### Contenido Estático
- `config.ts` - Tagline, SEO, messages
- `app/page.tsx` - Home
- `app/vehiculos/page.tsx` - Listing
- `app/vehiculos/[slug]/page.tsx` - Detail
- `app/servicios/page.tsx` - Services
- `app/nosotros/page.tsx` - About (MAYOR CAMBIO - datos reales)
- `app/contacto/page.tsx` - Contact

### Componentes
- `components/forms/*.tsx` - Form labels, messages
- `components/vehicles/*.tsx` - Cards, filters, compare
- `components/layout/*.tsx` - Navbar, Footer

### Nuevos Archivos
- `app/not-found.tsx` - 404 page
- `app/error.tsx` - 500 page

---

## Notas Finales

- Esta fase NO toca estilos, layout ni componentes UI
- Todos los cambios son en strings de texto
- Mantener backup del copy actual antes de cambiar
- Coordinar con cliente para datos reales (stats, team, testimonials)
