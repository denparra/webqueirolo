# 05 - Configuracion de Imagenes - Home Redesign

## Resumen

Este archivo documenta las imagenes requeridas por la implementacion
del nuevo HOME (`feature/home-redesign`), sus especificaciones tecnicas
y las rutas donde deben colocarse.

---

## 1. Hero Background (REQUERIDA)

| Propiedad | Valor |
|-----------|-------|
| **Ruta actual** | `/public/images/showroom.jpg` |
| **Ruta ideal** | `/public/images/hero/hero-home.webp` |
| **Componente** | `components/home/HeroSection.tsx` linea 13 |
| **Renderizado** | `next/image` con `fill` + `object-cover` |
| **Prioridad** | `priority={true}` (carga inmediata, es LCP) |
| **Calidad** | `quality={85}` |
| **Sizes** | `sizes="100vw"` (fullscreen) |

### Especificaciones de la imagen

| Spec | Valor | Motivo |
|------|-------|--------|
| **Ancho minimo** | 1920px | Cubre pantallas FullHD sin pixelar |
| **Ancho ideal** | 2560px | Cubre pantallas 2K/QHD |
| **Alto minimo** | 1080px | Ratio minimo para cubrir 80vh |
| **Aspect ratio** | 16:9 o 21:9 | Panoramico horizontal, funciona en mobile y desktop |
| **Formato** | `.webp` (preferido) o `.jpg` | Next.js convierte a webp/avif automaticamente, pero empezar en webp ahorra el paso |
| **Peso maximo** | 300KB (webp) / 500KB (jpg) | Balance calidad/velocidad. Next.js optimiza pero la fuente importa |
| **Peso ideal** | 150-200KB (webp) | Carga rapida incluso en 3G |
| **Contenido sugerido** | Showroom con autos, auto premium de frente/perfil, o fachada del local | Debe transmitir confianza y calidad automotriz |

### Notas sobre el overlay

La imagen se oscurece con un gradient CSS:
```
bg-gradient-to-t from-black/80 via-black/40 to-black/20
```

Esto significa:
- La parte **inferior** queda muy oscura (80% negro) → el texto blanco es legible
- La parte **superior** queda levemente oscura (20%) → se ve la imagen
- **Imagenes claras** funcionan mejor que oscuras (el gradient ya oscurece)
- **Evitar** imagenes con texto o logos propios (quedan tapados)

### Como reemplazar la imagen

1. Colocar el archivo en `/public/images/hero/hero-home.webp`
2. Editar `components/home/HeroSection.tsx` linea 13:
   ```tsx
   // Cambiar:
   src="/images/showroom.jpg"
   // Por:
   src="/images/hero/hero-home.webp"
   ```
3. No se necesita ningun otro cambio

### Estado actual

El archivo `showroom.jpg` actual pesa ~15KB → es un placeholder de baja calidad.
**Accion requerida**: Reemplazar con una foto real de alta resolucion.

---

## 2. Imagenes de Vehiculos Destacados (AUTOMATICAS desde Sanity)

| Propiedad | Valor |
|-----------|-------|
| **Fuente** | Sanity CMS → `images[0].asset->url` |
| **LQIP** | Sanity CMS → `images[0].asset->metadata.lqip` (auto-generado) |
| **Componente** | `components/home/FeaturedVehicleCard.tsx` linea 35 |
| **Renderizado** | `next/image` con `fill` + `object-cover` |
| **Placeholder** | `placeholder="blur"` + `blurDataURL={lqip}` |
| **Priority** | `true` para las primeras 3 cards, `false` para las demas |
| **Sizes** | `(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw` |

### Especificaciones para subir a Sanity

| Spec | Valor | Motivo |
|------|-------|--------|
| **Ancho minimo** | 800px | Card se muestra a ~400px max, el doble para retina |
| **Ancho ideal** | 1200px | Cubre hasta dispositivos 3x |
| **Alto minimo** | 450px | Aspect ratio 16:9 minimo |
| **Aspect ratio** | 16:9 (obligatorio) | El contenedor usa `aspect-video` |
| **Formato** | `.jpg` o `.webp` | Sanity acepta ambos, Next.js reoptimiza |
| **Peso maximo** | 500KB por imagen | Sanity CDN + Next.js optimizan en cadena |
| **Fondo** | Neutro o showroom | Evitar fondos ruidosos que distraigan |

### Notas importantes

- Sanity genera LQIP automaticamente para cada imagen subida
- No se necesita generar blur manualmente
- La query GROQ trae solo la primera imagen del array (`images[0]`)
- Si un vehiculo no tiene imagenes, la card muestra un placeholder gris

---

## 3. Logos (YA EXISTENTES - sin cambios)

Referencia para completitud. No fueron modificados en esta implementacion.

| Logo | Ruta | Uso |
|------|------|-----|
| Letras negras | `/public/images/logo/LOGOLETRASNEGRASINFONDO.png` | Navbar (fondo claro) |
| Letras blancas | `/public/images/logo/LOGOLETRASBLANCASINFONDO.png` | Footer (fondo oscuro) |

---

## Pipeline de Optimizacion de Imagenes

```
Imagen original (JPG/PNG/WebP)
  ↓
Colocar en /public/images/ (locales) o subir a Sanity (vehiculos)
  ↓
next/image detecta formato del navegador (webp/avif support)
  ↓
Next.js Image Optimization API (sharp server-side)
  ↓
Genera variantes segun deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840]
  ↓
Cache con TTL de 1 ano (minimumCacheTTL: 31536000)
  ↓
Browser recibe la variante optima en webp o avif
```

**No necesitas** pre-optimizar manualmente. Solo sube imagenes de buena resolucion
y Next.js hace el resto. Pero **si importa** que la fuente no sea excesivamente grande
(>2MB) porque el primer request pagara el costo de optimizacion.

---

## Herramientas Recomendadas para Preparar Imagenes

| Herramienta | Uso | Link |
|-------------|-----|------|
| Squoosh | Compresion web rapida | squoosh.app |
| Sharp CLI | Batch resize/convert | `npx sharp-cli resize 1920 -i input.jpg -o output.webp` |
| TinyPNG/TinyJPG | Compresion con preservacion de calidad | tinypng.com |
| Canva | Crear hero image con branding | canva.com |

### Comando rapido para convertir a webp

```bash
# Requiere sharp-cli instalado globalmente
npx sharp-cli -i foto-original.jpg -o hero-home.webp --width 1920 --quality 85 --format webp
```

---

## Checklist Pre-Deploy

- [ ] Hero image reemplazada con foto real (>= 1920x1080, < 300KB webp)
- [ ] Al menos 6 vehiculos publicados en Sanity con imagenes (>= 800x450)
- [ ] Cada vehiculo tiene al menos 1 imagen en el array `images`
- [ ] Verificar visualmente: hero legible con overlay en mobile y desktop
- [ ] Verificar: cards muestran blur placeholder antes de cargar imagen completa
