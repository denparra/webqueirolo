> Contexto: este SOT ahora vive dentro del frente institucional por fases. Para la secuencia completa, ver ROADMAP.md.

Este documento define **qué imágenes conviene subir** para las páginas institucionales del sitio y **cómo deben venir exportadas** para encajar con el layout real del repo.

## Decisión rápida

Si quieres resolver lo importante SIN dar vueltas, la tanda recomendada es:

1. **Reemplazar `c1` y `c2`** por 2 piezas **verticales 4:5** para `/servicios`
2. **Reexportar `history.jpg`** en formato **cuadrado 1:1** para `/nosotros`
3. **Preparar `mario.jpg`** en formato **vertical 3:4** para `/nosotros`  
   _OJO: hoy no basta con subirla; la tarjeta aún usa placeholder manual_
4. **Opcional:** reemplazar `showroom.jpg` por una versión más grande para héroes

## Estado actual por página

| Página / bloque | Archivo actual | Estado | Qué pide el layout | Decisión recomendada |
|---|---|---:|---|---|
| `/contacto` hero | `/images/showroom.jpg` | usable | Hero ancho | Reutilizar por ahora; opcional reemplazo HD |
| `/nosotros` hero | `/images/showroom.jpg` | usable | Hero ancho | Reutilizar por ahora; opcional reemplazo HD |
| `/nosotros` historia | `/images/history.jpg` | **desajustado** | Cuadrado `1:1` | Subir versión cuadrada |
| `/nosotros` equipo | `/images/team/mario.jpg` | **faltante + no renderizado** | Vertical `3:4` | Preparar asset y luego habilitarlo en código |
| `/servicios` consignación `c1` | `/images/consignacion/c1.png` | **desajustado** | Vertical `4:5` | Rehacer/exportar vertical |
| `/servicios` consignación `c2` | `/images/consignacion/c2.png` | **desajustado** | Vertical `4:5` | Rehacer/exportar vertical |

## Archivo por archivo

| Archivo destino | Uso real en código | Formato recomendado | Tamaño ideal | Ratio ideal | Prioridad | Notas |
|---|---|---|---|---|---|---|
| `public/images/showroom.jpg` | Hero de home, `/nosotros`, `/contacto` | JPG o WebP | `1920x1080` | `16:9` | Media | El actual sirve, pero para hero grande una versión mayor da más aire |
| `public/images/history.jpg` | Bloque “Nuestra Historia” en `/nosotros` | JPG o WebP | `1600x1600` | `1:1` | **Alta** | Hoy el contenedor es cuadrado y la imagen actual rectangular se recorta |
| `public/images/team/mario.jpg` | Equipo `/nosotros` | JPG o WebP | `1200x1600` | `3:4` vertical | Alta | Hoy la UI NO la muestra todavía; se necesita asset + ajuste de código |
| `public/images/consignacion/c1.png` | Galería “Diseños de Consignación” | PNG o WebP | `1200x1500` | `4:5` vertical | **Alta** | Debe leerse bien como pieza vertical; evitar export horizontal |
| `public/images/consignacion/c2.png` | Galería “Diseños de Consignación” | PNG o WebP | `1200x1500` | `4:5` vertical | **Alta** | Idealmente complementa a `c1`, no duplicar composición |

## Qué NO hace falta subir ahora

- **Fotos por vehículo**: quedan fuera de este SOT; en producción dependen de Sanity
- **Más imágenes para `/contacto`**: no son obligatorias si `showroom.jpg` se mantiene
- **Más imágenes para `/servicios`** fuera de consignación: el código actual no las solicita

## Problema puntual: “Diseños de Consignación”

### Qué está pasando

El componente `ConsignmentDesignGallery` usa tarjetas con ratio **`4:5`** y la imagen interna se pinta con **`object-cover`**.

Eso significa:

- una imagen **horizontal** se recorta mal
- una imagen **cuadrada** también pierde aire/composición
- el problema NO es solo “la imagen está fea”; es un descalce entre **asset** y **layout**

## Solución recomendada

### Opción A — RECOMENDADA

**Subir 2 piezas nuevas pensadas desde el inicio para vertical 4:5.**

Ventajas:
- no exige tocar el componente
- mantiene una grilla limpia y consistente
- evita márgenes vacíos o recortes raros

Lineamientos visuales:
- composición vertical tipo afiche / mockup / pieza de campaña
- texto importante lejos de bordes
- dejar margen de seguridad de ~8% alrededor
- no usar screenshots completos en horizontal

### Opción B — Si quieres mantener los assets actuales

**Cambiar luego el componente** para usar `object-contain` o un ratio menos rígido.

Tradeoff:
- preserva la imagen completa
- pero la tarjeta perderá fuerza visual y puede quedar con mucho fondo vacío

### Opción C — Replantear el bloque

En vez de “diseños”, convertirlo en:
- mockups de publicaciones
- antes/después
- carrusel de beneficios del servicio

Tradeoff:
- puede comunicar mejor el servicio
- pero ya implica una decisión de contenido/UX, no solo de exportación

## Recomendación final para decidir uploads

Sube en este orden:

1. `history.jpg` cuadrada
2. `c1.png` vertical 4:5
3. `c2.png` vertical 4:5
4. `mario.jpg` vertical 3:4
5. `showroom.jpg` HD solo si la actual no te representa bien

## Referencias de código

- `app/nosotros/page.tsx`
- `app/contacto/page.tsx`
- `app/servicios/page.tsx`
- `components/services/ConsignmentDesignGallery.tsx`

