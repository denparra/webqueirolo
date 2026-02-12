# 01 - Auditoria UI/UX del HOME Actual

## Estado Actual del HOME (`app/page.tsx`)

El HOME actual tiene 3 secciones estaticas, sin imagenes, sin vehiculos, sin datos dinamicos:

1. **Hero Section**: Gradient oscuro (`bg-gradient-dark`) + titulo + tagline + 2 botones
2. **Features Section**: Grid 4 columnas de cards con iconos (beneficios)
3. **CTA Section**: Fondo `primary-50` + texto + 2 botones (WhatsApp + Ubicacion)

**Critica principal**: Es un HOME generico que podria ser de cualquier negocio. No muestra vehiculos, no tiene imagenes, no transmite la identidad automotriz.

---

## Analisis por Dimension

### 1. Jerarquia Visual

| Aspecto | Hallazgo | Severidad |
|---------|----------|-----------|
| Hero sin imagen | Solo gradient + texto. Sin foto de auto ni showroom | **P0** |
| Sin seccion de vehiculos | El HOME no muestra ni un solo auto del inventario | **P0** |
| Monotonia visual | 3 secciones text-heavy, sin quiebre visual | **P1** |
| Features cards identicas | 4 cards con mismo patron visual, sin diferenciacion | **P2** |
| Sin social proof | No hay testimonios, contadores, ni indicadores de confianza visual | **P2** |

### 2. Layout y Estructura

| Aspecto | Hallazgo | Severidad |
|---------|----------|-----------|
| Hero demasiado vacio | `py-20 lg:py-32` de padding con solo texto centrado | **P0** |
| Sin contenido above-the-fold visual | El primer contenido visual son iconos genricos | **P1** |
| Flujo de conversion debil | Hero → Features → CTA. No hay engagement intermedio | **P1** |
| Sin breadcrumb de inventario | No hay preview del stock ni link directo a categorias | **P1** |
| Container widths correctos | Usa `container mx-auto px-4` consistentemente | OK |

### 3. Tipografia

| Aspecto | Hallazgo | Severidad |
|---------|----------|-----------|
| Font: Inter | Correcta eleccion para automotriz (clean, modern) | OK |
| Jerarquia H1→H2 | H1 en hero (4xl→6xl), H2 en secciones (3xl→4xl) | OK |
| Body text legible | `text-lg text-gray-200` en hero, `text-lg text-gray-600` en body | OK |
| Sin variacion de peso | Todo bold o regular, falta variedad (medium, semibold) | **P2** |
| Sin accent typography | No hay numeros grandes, contadores, ni destacados | **P2** |

### 4. Spacing y Ritmo

| Aspecto | Hallazgo | Severidad |
|---------|----------|-----------|
| Sections: `py-16 lg:py-24` | Consistente y adecuado | OK |
| Gap cards: `gap-8` | Buen spacing entre cards | OK |
| Boton spacing: `space-y-4 sm:space-x-4` | Stack mobile → row desktop, correcto | OK |
| Falta ritmo visual | Todas las secciones tienen padding similar, sin "respiro" | **P2** |

### 5. CTAs y Conversion

| Aspecto | Hallazgo | Severidad |
|---------|----------|-----------|
| CTA principal: "Ver Vehiculos" | Correcto pero sin urgencia ni diferenciacion visual | **P1** |
| Sin CTA en featured vehicles | No existe seccion de vehiculos | **P0** |
| WhatsApp CTA | Presente en seccion final y FAB flotante | OK |
| Sin CTA contextual | No hay "Ver mas como este" ni filtros rapidos | **P1** |
| Boton hover effects | `hover:shadow-lg hover:-translate-y-0.5` - buen feedback | OK |

### 6. Navegacion (Navbar)

| Aspecto | Hallazgo | Severidad |
|---------|----------|-----------|
| Top bar informativo | Horarios + telefono + direccion (solo desktop) | OK |
| Sticky header | `sticky top-0 z-40` con backdrop-blur | OK |
| Links claros | Inicio, Vehiculos, Servicios, Nosotros, Contacto | OK |
| WhatsApp en nav | CTA verde visible en desktop | OK |
| Mobile hamburger | Con MobileNav modal | OK |
| Sin active state visual | No se resalta la pagina actual | **P2** |
| Logo sin optimizar | `unoptimized` flag en Image del logo | **P2** |

### 7. Responsividad

| Aspecto | Hallazgo | Severidad |
|---------|----------|-----------|
| Hero: mobile ok | Texto responsivo 4xl→6xl | OK |
| Features: 1→2→4 cols | `md:grid-cols-2 lg:grid-cols-4` correcto | OK |
| Botones: stack→row | `flex-col sm:flex-row` correcto | OK |
| Top bar: hidden mobile | `hidden lg:block` adecuado | OK |
| Sin contenido visual mobile | Hero vacio es peor en mobile (solo texto en gradient) | **P0** |

### 8. Consistencia de Design System

| Aspecto | Hallazgo | Severidad |
|---------|----------|-----------|
| Paleta primaria | Rojo #E63946 bien implementado | OK |
| Gradients | `bg-gradient-primary` y `bg-gradient-dark` definidos | OK |
| Border radius | Sistema consistente (sm/md/lg/xl/2xl) | OK |
| Spacing tokens | `xs` a `4xl` definidos en tailwind | OK |
| Cards UI | CVA + Radix bien estructurados | OK |
| Sin dark mode content | `darkMode: ['class']` habilitado pero sin uso | **P2** |

---

## Resumen de Hallazgos Priorizados

### P0 - Criticos (deben resolverse)

1. **HOME sin vehiculos**: La pagina principal de un sitio de autos no muestra autos
2. **Hero sin imagen**: Solo gradient oscuro + texto. Nulo impacto visual
3. **Sin "Autos Destacados"**: No existe seccion que muestre inventario
4. **Mobile hero vacio**: En mobile el hero es un bloque oscuro con texto

### P1 - Importantes (alta prioridad)

5. **Flujo de conversion debil**: No hay puente entre hero y catalogo
6. **Sin preview de categorias**: No hay acceso rapido a SUV, Sedan, etc.
7. **CTA principal generico**: "Ver Vehiculos" sin diferenciacion visual
8. **Sin social proof**: No hay indicadores de confianza (anos, autos vendidos)
9. **Monotonia visual**: 3 secciones text-heavy consecutivas

### P2 - Deseables (segunda iteracion)

10. Sin variacion tipografica en numeros/contadores
11. Features cards sin diferenciacion entre si
12. Logo Navbar con `unoptimized`
13. Sin active state en navegacion
14. Spacing monotono entre secciones

---

## Benchmarks Automotrices (Tendencias 2025-2026)

| Tendencia | Descripcion | Aplicable a Queirolo |
|-----------|-------------|---------------------|
| Hero visual fullscreen | Imagen/video de auto como hero principal | Si - usar imagen de showroom o auto destacado |
| Cards con hover reveal | Informacion adicional aparece en hover | Si - ya existe en VehicleCard |
| Scroll animations | Secciones que animan al entrar en viewport | Si - FadeIn/SlideUp ya existen |
| Counters/Stats | "60+ anos", "500+ autos vendidos" | Si - datos de config disponibles |
| Category chips | Filtros rapidos de categoria en home | Si - categories en schema |
| Gradient overlays | Sobre imagenes para legibilidad | Si - patron existente |
| Micro-interactions | Hover scales, button lifts, icon animations | Parcial - algunos existen |
| Trust badges | Sellos de garantia, revision tecnica | Si - features section adaptable |
