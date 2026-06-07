> Contexto: este SOT ahora vive dentro del frente institucional por fases. Para la secuencia completa, ver ROADMAP.md.

Este documento define **qué imágenes conviene subir** para las páginas institucionales del sitio y **cómo deben venir exportadas** para encajar con el layout real del repo.

---

## Paleta del sitio (referencia para generación de assets)

| Token | Hex | Uso en UI |
|---|---|---|
| `primary-500` | `#E63946` | Rojo principal de marca |
| `primary-600` | `#D62828` | Hover / acento |
| `primary-900` | `#7F1D1D` | Overlay izquierdo del hero |
| `gray-900` | `#111827` | Fondo hero / oscuro |
| `white` | `#FFFFFF` | Fondo general de páginas |

Fuente verificada: `tailwind.config.ts` + `app/globals.css`.

---

## Especificaciones verificadas por asset

> Las dimensiones y comportamientos de esta sección fueron extraídos directamente del código del repo. No son estimaciones.

### `showroom.jpg` — hero de `/contacto`

**Contexto de layout** (`app/contacto/page.tsx:19`):
```
h-[300px]  ·  100% viewport width  ·  fill + object-cover
Overlay: bg-black/50  +  bg-gradient-to-r from-primary-900/50 to-transparent
```

El hero muestra solo **300 px del centro vertical** de la imagen. Los bordes superior e inferior se recortan. El gradiente de `#7F1D1D` va de izquierda a derecha sobre toda la imagen.

**Dimensiones recomendadas:**

| Parámetro | Valor |
|---|---|
| Ratio | 16:5 (landscape ancho) |
| Mínimo | 1920 × 600 px |
| Ideal | 2560 × 800 px |
| Formato | JPG o WebP ≥ 85% calidad |
| Peso máximo | 350 KB |

**Zona segura:** mantener el sujeto principal entre el **25% y 75% del alto** de la imagen. Los primeros y últimos ~25% pueden quedar fuera de pantalla según el viewport.

**Prompt para generación con IA** (Midjourney / DALL-E 3 / Ideogram):
```
Photorealistic exterior or interior of a premium 4x4 vehicle dealership
in Santiago, Chile. Dark cinematic atmosphere. Red accent tones (#E63946).
1-2 modern black or silver SUVs prominently featured.
High contrast, dramatic lighting. Wide horizontal composition.
No people, no text. Shot on 24mm lens. Aspect ratio 16:5.
```

---

### `banner.jpg` — banner de consignación en `/servicios`

**Contexto de layout** (`app/servicios/page.tsx`):
```
aspect-[16/5]  ·  fill + object-cover  ·  rounded-xl  ·  SIN overlay
```

Reemplaza la galería `ConsignmentDesignGallery` (c1/c2) que fue eliminada. Es un único banner de diseño dentro del tab Consignación — **sin overlay ni texto encima**. El contenedor usa `aspect-[16/5]` para respetar la proporción exacta de la imagen: con un asset 16:5, `object-cover` no recorta. Si el asset NO es 16:5, recortará para llenar.

**Dimensiones recomendadas:**

| Parámetro | Valor |
|---|---|
| Archivo destino | `public/images/consignacion/banner.jpg` |
| Ratio | 16:5 (landscape ancho, igual que `/contacto`) |
| Mínimo | 1920 × 600 px |
| Ideal | 2560 × 800 px |
| Formato | JPG o WebP ≥ 85% calidad |
| Peso máximo | 350 KB |
| Zona segura | centro vertical (25%–75% del alto) |

**Zona segura del banner:**
El contenedor tiene `h-[280px]` fijo con `object-cover`. Con un asset de 1920×600 px, la imagen escala para llenar el ancho y recorta verticalmente desde el centro. El sujeto debe estar en la franja central del alto.

**Prompt para generación/mejora** (img2img — ChatGPT / Leonardo):
```
Improve this photo for use as a professional automotive dealership banner.
Enhance lighting, sharpness and contrast. Deepen the background to near-black (#111827).
Add subtle red accent tones (#E63946) in reflections or atmosphere.
Keep the vehicle as the main subject. Remove background distractions.
Premium, minimalist feel. No text or logos.
Output: wide horizontal banner, 16:5 aspect ratio, 1920×600 px minimum.
```

> **Nota:** `c1.png` y `c2.png` ya no se usan en el frontend. El componente `ConsignmentDesignGallery.tsx` quedó sin uso y puede archivarse en otra sesión.

---

## Decisión rápida

Si quieres resolver lo importante SIN dar vueltas, la tanda recomendada es:

1. ~~Reemplazar `c1` y `c2`~~ ✅ Resuelto con `banner.jpg` 16:5 (ver arriba)
2. **Subir `history.jpg`** en formato **cuadrado 1:1** para `/nosotros` (ya cableada)
3. **Subir `mario.jpg`** en formato **vertical 3:4** para `/nosotros`  
   _Contenido: auto antiguo de Turismo Carretera (no retrato). La tarjeta YA está cableada con `<Image>` condicional (2026-06-07)._
4. **Opcional:** reemplazar `showroom.jpg` por una versión más grande para héroes

## Estado actual por página

| Página / bloque | Archivo actual | Estado | Qué pide el layout | Decisión recomendada |
|---|---|---:|---|---|
| `/contacto` hero | `/images/showroom.jpg` | usable | Hero ancho | Reutilizar por ahora; opcional reemplazo HD |
| `/nosotros` hero | `/images/showroom.jpg` | usable | Hero ancho | Reutilizar por ahora; opcional reemplazo HD |
| `/nosotros` historia | `/images/history.jpg` | **desajustado** | Cuadrado `1:1` | Subir versión cuadrada |
| `/nosotros` equipo | `/images/team/mario.jpg` | **código listo, falta asset** | Vertical `3:4` | Subir auto Turismo Carretera (no retrato); tarjeta ya cableada con `<Image>` |
| `/servicios` consignación | `/images/consignacion/banner.jpg` | ✅ resuelto | Banner `16:5` | Reemplazó la galería `c1`/`c2` |

## Archivo por archivo

| Archivo destino | Uso real en código | Formato recomendado | Tamaño ideal | Ratio ideal | Prioridad | Notas |
|---|---|---|---|---|---|---|
| `public/images/showroom.jpg` | Hero de home, `/nosotros`, `/contacto` | JPG o WebP | `1920x1080` | `16:9` | Media | El actual sirve, pero para hero grande una versión mayor da más aire |
| `public/images/history.jpg` | Bloque “Nuestra Historia” en `/nosotros` | JPG o WebP | `1600x1600` | `1:1` | **Alta** | Hoy el contenedor es cuadrado y la imagen actual rectangular se recorta |
| `public/images/team/mario.jpg` | Equipo `/nosotros` | JPG o WebP | `1200x1600` | `3:4` vertical | Alta | Código YA cableado (`<Image>` condicional, 2026-06-07). Contenido: auto Turismo Carretera, no retrato. Solo falta subir el archivo |
| `public/images/consignacion/c1.png` | Galería “Diseños de Consignación” | PNG o WebP | `1200x1500` | `4:5` vertical | **Alta** | Debe leerse bien como pieza vertical; evitar export horizontal |
| `public/images/consignacion/c2.png` | Galería “Diseños de Consignación” | PNG o WebP | `1200x1500` | `4:5` vertical | **Alta** | Idealmente complementa a `c1`, no duplicar composición |

---

## Dimensiones y especificaciones técnicas

### Tabla maestra de tamaños

| Archivo | Uso | Dimensiones recomendadas | Ratio | Formato | Peso máximo | Notas técnicas |
|---|---|---|---|---|---|---|
| `showroom.jpg` | Hero `/nosotros` (400px alto) y `/contacto` (300px alto) | **1920 × 1080 px** mínimo · **2560 × 1440 px** ideal | `16:9` | JPG/WebP ≥85% calidad | 400 KB | `object-cover` + overlay 50–60% oscuro; composición centrada |
| `history.jpg` | Bloque "Nuestra Historia" en `/nosotros` | **1600 × 1600 px** | `1:1` cuadrado | JPG/WebP | 300 KB | Contenedor usa `aspect-square`; bordes se recortan si no es cuadrada |
| `team/mario.jpg` | Tarjeta de equipo en `/nosotros` | **1200 × 1600 px** | `3:4` vertical | JPG/WebP | 250 KB | Código cableado (2026-06-07). Auto Turismo Carretera centrado (no retrato); bordes laterales se recortan con `object-cover` |
| `consignacion/c1.png` | Galería ConsignmentDesignGallery | **1200 × 1500 px** | `4:5` vertical | PNG/WebP | 300 KB | Composición vertical tipo afiche; margen seguro 8% |
| `consignacion/c2.png` | Galería ConsignmentDesignGallery | **1200 × 1500 px** | `4:5` vertical | PNG/WebP | 300 KB | Complementar `c1`, no duplicar composición |

### Zona segura del banner (hero)

El hero usa `fill` + `object-cover` en Next.js Image. Esto significa que la imagen se recorta dinámicamente según el viewport:

```
┌──────────────────────────────────────────┐
│  zona que puede quedar fuera en mobile   │ ← ~15% borde izq/der
│   ┌──────────────────────────────────┐   │
│   │                                  │   │
│   │   ZONA SEGURA — siempre visible  │   │ ← 70% central del ancho
│   │   · logo / sujeto principal      │   │
│   │   · punto de interés             │   │
│   └──────────────────────────────────┘   │
│  zona que puede quedar fuera en mobile   │
└──────────────────────────────────────────┘
```

**Regla práctica**: mantené el sujeto principal en el 70% central de la imagen. Los bordes son zona de sacrificio.

El overlay oscuro (50–60% negro) cubre toda la imagen para que el texto blanco sea legible. Esto significa que:
- Las zonas muy oscuras en el asset original se vuelven *demasiado* oscuras
- Las zonas muy claras siguen siendo aceptables
- **Ideal**: imagen con luminosidad media-alta para que el overlay no aplaste el detalle

---

## ¿El banner debe ser el mismo para `/contacto` y `/nosotros`?

### Estado actual

Ambas páginas usan **la misma imagen** (`showroom.jpg`). Técnicamente esto es correcto porque el layout lo permite y la imagen es genérica del negocio.

### Cuándo compartir imagen (válido)

Si el asset disponible muestra el showroom en general (exterior, flota, ambiente de local), **una sola imagen funciona para ambas páginas**. Es lo más práctico si los recursos de fotografía son limitados.

### Cuándo conviene separarlos (recomendado a mediano plazo)

| Página | Propósito del hero | Imagen ideal |
|---|---|---|
| `/nosotros` | Transmitir historia, familia, legado, pasión | Foto interior del local con autos, atmósfera cálida, o foto histórica familiar |
| `/contacto` | Invitar a visitar, generar confianza, orientar | Foto exterior del local (fachada visible), ambiente de bienvenida, o vista de la calle |

La diferencia de altura ya marca una jerarquía: `/nosotros` tiene **400px** (más épico, más narrativo) y `/contacto` tiene **300px** (más funcional, más directo).

**Recomendación**: para el MVP, compartir `showroom.jpg` es perfectamente válido. Cuando se tenga sesión fotográfica, priorizar dos tomas distintas.

---

## Prompt de ejemplo para generar el banner con IA

Este prompt está pensado para **Midjourney, DALL-E 3 o Ideogram**. Podés adaptarlo según el estilo visual que busques.

### Prompt para `/nosotros` (historia y legado)

```
Photorealistic interior of a modern car dealership in Santiago, Chile. 
Warm ambient lighting, polished concrete floor, 2-3 premium SUVs displayed (black, silver, white). 
Natural light entering from large windows. The atmosphere feels trustworthy and family-owned. 
Wide angle shot, horizontal orientation. No people. 
Shot on Canon 5D, 24mm lens, golden hour light.
Aspect ratio 16:9, high resolution.
```

**Versión en español para DALL-E 3**:
```
Interior fotorrealista de una automotora moderna en Santiago de Chile. 
Iluminación cálida, piso de hormigón pulido, 2 o 3 camionetas 4x4 premium expuestas 
(colores negro, plata, blanco). Luz natural entrando por ventanales grandes. 
Ambiente que transmite confianza y trayectoria familiar. 
Ángulo amplio, composición horizontal. Sin personas.
Relación de aspecto 16:9.
```

### Prompt para `/contacto` (fachada y bienvenida)

```
Photorealistic exterior of a car dealership storefront in Las Condes, Santiago, Chile. 
Modern facade, clean signage, sunny day. 2-3 premium SUVs parked in front. 
Wide horizontal shot showing the entrance clearly. Welcoming and approachable atmosphere. 
Aspect ratio 16:9, daytime, high resolution.
```

### Prompt alternativo con estilo editorial

```
Aerial or wide exterior shot of a semi-new vehicle lot in Santiago, Chile. 
Modern urban setting, Las Condes neighborhood. Row of clean 4x4 SUVs. 
Bright daylight, blue sky, sharp focus. Editorial automotive photography style.
16:9 aspect ratio.
```

> **Tip**: si generás la imagen con IA, siempre exportala a **1920×1080 px** mínimo antes de subirla. Las herramientas de IA suelen generar a 1024px o 1792px — usá upscale antes de exportar.

---

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

