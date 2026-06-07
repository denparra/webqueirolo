# 02 - Auditoria de Performance: Imagenes

## Diagnostico de la Cadena de Carga de Imagenes

### Flujo Actual

```
Sanity CMS → GROQ: images[].asset->url → URL cruda cdn.sanity.io
→ next/image <Image> con fill + sizes → Next.js Image Optimization API
→ /_next/image?url=...&w=...&q=75 → sharp (server-side) → webp/avif
→ Browser render
```

### Configuracion en `next.config.js`

```js
images: {
  formats: ['image/webp', 'image/avif'],        // ✅ Formatos modernos
  deviceSizes: [640,750,828,1080,1200,1920,2048,3840], // ✅ Rangos amplios
  imageSizes: [16,32,48,64,96,128,256,384],      // ✅ Iconos y thumbs
  minimumCacheTTL: 31536000,                      // ✅ 1 ano cache
  remotePatterns: [{ hostname: 'cdn.sanity.io' }] // ✅ CDN permitido
}
```

**Veredicto config**: La configuracion de Next.js es correcta y sigue buenas practicas.

---

## Causas Raiz del Delay Visible

### Causa 1: No hay `placeholder="blur"` ni `blurDataURL` en ninguna imagen

**Evidencia**: Grep de `placeholder|blurDataURL|blur` en `**/*.tsx` → **CERO resultados** en componentes de vehiculos.

**Impacto**: Cuando una imagen se carga, el espacio esta vacio (o con el color de fondo) hasta que la imagen completa llega. Esto produce un "flash" visible especialmente en:
- `VehicleCard.tsx` (grid de cards en listado)
- `VehicleDetailGallery.tsx` (imagen principal en detalle)
- `VehicleGalleryLightbox.tsx` (lightbox fullscreen)

**Severidad**: **CRITICA** - Es la causa mas probable del delay percibido.

### Causa 2: No se usa `urlFor()` con transformaciones de Sanity

**Evidencia**: En `lib/vehicles.ts`, la query GROQ es:
```groq
"images": images[].asset->url
```

Esto devuelve la URL **original sin transformar** del asset en Sanity CDN. No se aplica:
- Resize server-side via Sanity Image API
- Calidad reducida
- Formato forzado
- LQIP (Low Quality Image Placeholder) que Sanity puede generar

El builder `urlFor()` existe en `lib/sanity.ts` pero **no se usa** en las queries de vehiculos.

**Impacto**: Las imagenes originales (potencialmente 2-5MB cada una) viajan al servidor Next.js para ser procesadas por sharp. El doble hop (Sanity CDN → Next.js server → browser) agrega latencia.

**Severidad**: **ALTA** - Agrega latencia innecesaria al pipeline.

### Causa 3: Sin `priority` en imagenes criticas del listado

**Evidencia** en `VehicleCard.tsx`:
```tsx
<Image
  src={vehicle.image}
  alt={...}
  fill
  className="object-cover ..."
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  // ← NO tiene priority
/>
```

En `VehicleDetailGallery.tsx`:
```tsx
<Image src={vehicle.image} alt={...} fill className="object-cover" priority />
// ✅ Este SI tiene priority (correcto para LCP en detalle)
```

**Impacto**: Las primeras cards del listado (above-the-fold) se cargan con lazy loading por defecto, retrasando el LCP.

**Severidad**: **MEDIA** - Afecta LCP pero no es el delay principal.

### Causa 4: Thumbnails en galeria sin `sizes` optimizado

**Evidencia** en `VehicleDetailGallery.tsx`:
```tsx
{vehicle.images.slice(0, 4).map((img, idx) => (
  <div className="relative aspect-video overflow-hidden rounded ...">
    <Image
      src={img}
      alt={`Vista ${idx + 1}`}
      fill
      className="object-cover ..."
      // ← Sin sizes → Next.js asume 100vw → descarga imagen grande
    />
  </div>
))}
```

**Impacto**: Thumbnails pequenos (1/4 del ancho) descargan imagenes de ancho completo.

**Severidad**: **MEDIA** - Desperdicio de ancho de banda, contribuye al delay acumulado.

### Causa 5: Lightbox carga imagen con `priority` pero sin preload inteligente

**Evidencia** en `VehicleGalleryLightbox.tsx`:
```tsx
<Image src={images[currentIndex]} alt={...} fill priority />
```

Cada cambio de imagen en el lightbox inicia una descarga nueva. No hay prefetch de la siguiente/anterior.

**Severidad**: **BAJA** - Afecta UX de navegacion en galeria, no la carga inicial.

### Causa 6: Logo en Navbar con `unoptimized`

**Evidencia** en `Navbar.tsx`:
```tsx
<Image src={siteConfig.logos.black} alt={...} width={208} height={52} priority unoptimized />
```

Y en `Footer.tsx`:
```tsx
<Image src={siteConfig.logos.white} alt={...} width={192} height={48} unoptimized />
```

**Impacto**: Los logos no pasan por la optimizacion de Next.js. Si son PNG grandes, se envian sin comprimir.

**Severidad**: **BAJA** - Los logos son pequenos pero `unoptimized` es innecesario si estan en `/public`.

---

## Resumen de Causas (Ordenadas por Impacto)

| # | Causa | Impacto en Delay | Fix Complexity |
|---|-------|-----------------|----------------|
| 1 | Sin `placeholder="blur"` / `blurDataURL` | **CRITICO** | Media |
| 2 | URLs crudas sin transformacion Sanity | **ALTO** | Media |
| 3 | Sin `priority` en primeras cards del listado | **MEDIO** | Baja |
| 4 | Thumbnails sin `sizes` adecuado | **MEDIO** | Baja |
| 5 | Lightbox sin prefetch de siguiente imagen | **BAJO** | Media |
| 6 | Logos con `unoptimized` | **BAJO** | Baja |

---

## Soluciones Propuestas

### Solucion 1: Implementar Placeholders Blur (CRITICO)

**Opcion A - LQIP desde Sanity (Recomendada)**:
Modificar la query GROQ para obtener el LQIP que Sanity genera automaticamente:

```groq
"images": images[]{
  "url": asset->url,
  "lqip": asset->metadata.lqip
}
```

Luego usar en el componente:
```tsx
<Image
  src={image.url}
  alt={...}
  fill
  placeholder="blur"
  blurDataURL={image.lqip}
/>
```

**Pros**: Blur nativo de Sanity, ~200 bytes por imagen, sin build-time cost.
**Contras**: Requiere cambiar el tipo de `images` de `string[]` a `{url: string, lqip: string}[]`.

**Opcion B - Placeholder CSS skeleton**:
Agregar un skeleton/shimmer CSS al contenedor de la imagen:
```tsx
<div className="relative aspect-video overflow-hidden bg-gray-200 animate-pulse">
  <Image ... onLoad={() => setLoaded(true)} />
</div>
```

**Pros**: No requiere cambios en queries ni tipos.
**Contras**: No es blur real, es un shimmer generico.

**Recomendacion**: Opcion A para el HOME redesenado (nuevos componentes), Opcion B como quick-win para los componentes existentes sin modificarlos.

### Solucion 2: Usar `urlFor()` con Transformaciones

Crear un helper que use el image builder de Sanity:

```ts
// lib/image.ts
import { urlFor } from './sanity'

export function getOptimizedImageUrl(source: any, width: number = 800) {
  return urlFor(source)
    .width(width)
    .quality(80)
    .auto('format')
    .url()
}
```

**Alternativa sin cambiar queries**: Aplicar parametros de URL directamente a las URLs de cdn.sanity.io:
```
https://cdn.sanity.io/images/.../image.jpg?w=800&q=80&auto=format
```

**Nota**: Para el HOME, como crearemos componentes nuevos, podemos usar `urlFor()` directamente.

### Solucion 3: Priority en Primeras Cards

Para el HOME redesenado, las primeras 2-3 cards de "Autos Destacados" deben tener `priority={true}`:

```tsx
<Image
  src={vehicle.image}
  alt={...}
  fill
  priority={index < 3}
  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
  placeholder="blur"
  blurDataURL={vehicle.lqip}
/>
```

### Solucion 4: Sizes Optimizados para Thumbnails

```tsx
<Image
  src={img}
  alt={...}
  fill
  sizes="(max-width: 768px) 25vw, 200px"
/>
```

### Solucion 5: Prefetch en Lightbox

Agregar un `<link rel="prefetch">` para la siguiente imagen:
```tsx
useEffect(() => {
  const nextIdx = (currentIndex + 1) % images.length
  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = images[nextIdx]
  document.head.appendChild(link)
  return () => document.head.removeChild(link)
}, [currentIndex, images])
```

### Solucion 6: Quitar `unoptimized` de Logos

Remover `unoptimized` de los logos en Navbar y Footer. Si los logos son PNG locales en `/public`, Next.js los optimizara automaticamente.

---

## Metricas Esperadas de Mejora

| Metrica | Antes (estimado) | Despues (objetivo) |
|---------|------------------|-------------------|
| LCP (home) | >3.5s (sin imagenes) | <2.5s |
| CLS (cards) | >0.1 (sin placeholder) | <0.05 |
| Perceived load (delay visible) | Notable | Eliminado (blur placeholder) |
| Bytes transferidos por card | ~500KB (original) | ~80KB (optimized) |
| TTFB imagenes | 2 hops (Sanity→Next→Browser) | 1 hop (Sanity CDN directo + Next cache) |

---

## Prioridad de Implementacion

1. **Primero**: Implementar LQIP/blur en componentes nuevos del HOME (Solucion 1A)
2. **Segundo**: Usar `urlFor()` con width/quality en componentes nuevos (Solucion 2)
3. **Tercero**: Priority en cards above-the-fold del HOME (Solucion 3)
4. **Cuarto**: Skeleton placeholder para VehicleCard existente (Solucion 1B) - si se quiere mejorar listado sin romperlo
5. **Quinto**: Sizes en thumbnails galeria (Solucion 4)
6. **Sexto**: Prefetch lightbox (Solucion 5)
7. **Septimo**: Quitar unoptimized logos (Solucion 6)
