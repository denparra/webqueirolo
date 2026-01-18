# Network review completo - localhost:3000

Date: 2026-01-18 17:43:04

## Contexto
- Analisis con chrome-devtools (MCP) sobre http://localhost:3000
- Entorno dev (HMR + eval-source-map). Los resultados no representan produccion.

## Resumen global
- Rutas revisadas: /, /vehiculos, /vehiculos/[slug], /servicios, /nosotros, /contacto, /studio, /robots.txt, /sitemap.xml, /privacidad, /terminos
- Errores recurrentes: /icons/icon-192x192.png (404), /privacidad (404), /terminos (404)
- Revalidaciones frecuentes (304): logos y manifest
- Recursos externos: Sanity API/CDN, Leaflet CDN, OpenStreetMap tiles

## Detalle por ruta (network)

### /
- Total requests: 11
- 4xx/5xx: 1 (GET /icons/icon-192x192.png => 404)
- 304: 3 (logos x2, manifest)
- Nota: solo layout bundles + fuente.

### /vehiculos
- Total requests: 18
- 4xx/5xx: 1 (GET /icons/icon-192x192.png => 404)
- 304: 5 (logos x2, manifest, _next/image x2)
- Externo: 2x GET https://4124jngl.api.sanity.io/... (misma query)
- Nota: imagenes via /_next/image hacia cdn.sanity.io.

### /vehiculos/ford-f-150-3-5-platinum-auto-ecoboost-4wd-2014
- Total requests: 17
- 4xx/5xx: 1 (GET /icons/icon-192x192.png => 404)
- 304: 2 (logo, manifest)
- Nota: se cargan varias imagenes 1920w en el primer render.

### /servicios
- Total requests: 13
- 4xx/5xx: 1 (GET /icons/icon-192x192.png => 404)
- 304: 2 (logo, manifest)

### /nosotros
- Total requests: 15
- 4xx/5xx: 3 (/_next/image?url=/images/showroom.jpg => 400, /_next/image?url=/images/history.jpg => 400, /icons/icon-192x192.png => 404)
- 304: 2 (logo, manifest)
- Nota: no existen en public/ las imagenes showroom.jpg e history.jpg.

### /contacto
- Total requests: 29
- 4xx/5xx: 2 (/_next/image?url=/images/showroom.jpg => 400, /icons/icon-192x192.png => 404)
- 304: 3 (logos x2, manifest)
- Externo: Leaflet CDN + multiples tiles de OpenStreetMap (10+ requests)
- Nota: HMR hot-update abortado (dev only).

### /studio
- Total requests: 33
- 4xx/5xx: 1 (GET /icons/icon-192x192.png => 404)
- 304: 5 (logos x2, manifest, auth/providers x2)
- Externo: Sanity CDN (bridge.js) + Sanity API (users/me, auth/providers)
- Nota: muchas cargas JS por Studio (esperable para admin).

### /robots.txt
- Total requests: 1
- Errores: 0

### /sitemap.xml
- Total requests: 2
- Errores: 0

### /privacidad
- Total requests: 11
- 4xx/5xx: 2 (GET /privacidad => 404, GET /icons/icon-192x192.png => 404)
- 304: 3 (logos x2, manifest)
- Nota: ruta enlazada en el footer pero no existe.

### /terminos
- Total requests: 11
- 4xx/5xx: 2 (GET /terminos => 404, GET /icons/icon-192x192.png => 404)
- 304: 3 (logos x2, manifest)
- Nota: ruta enlazada en el footer pero no existe.

## Recomendaciones de mejora
1) Agregar iconos y favicon en public/ o ajustar rutas en el manifest.
   - Faltan /icons/icon-192x192.png (404) y no hay carpeta public/icons.
   - Verificar public/favicon.ico y apple-touch-icon.png.

2) Corregir imagenes locales que rompen /_next/image.
   - Agregar public/images/showroom.jpg y public/images/history.jpg, o actualizar los paths.
   - Evita respuestas 400 y retrabajo del optimizador.

3) Resolver /privacidad y /terminos (404).
   - Crear paginas o eliminar links del footer.

4) Reducir revalidaciones de logos/manifest.
   - Versionar nombres (logo.v1.png) y servir con cache largo.
   - Mantener manifest estable o servir via CDN.

5) Evitar doble query a Sanity en /vehiculos.
   - Deduplicar fetch (server-only) o cachear con revalidate/SWR.

6) Optimizar carga de imagenes en /vehiculos/[slug].
   - Cargar solo la imagen hero en inicial (priority) y lazy-load el resto.
   - Usar sizes para evitar 1920w en mobile.

7) /contacto: lazy-load del mapa.
   - Renderizar mapa cuando sea visible o tras click; reduce 10+ requests a tiles.
   - Opcional: usar imagen estatica como placeholder.

8) /studio: evitar prefetch accidental.
   - No prefetch desde rutas publicas; mantenerlo aislado.

## Nota de medicion
- Para cifras reales de rendimiento, repetir con:
  - npm run build
  - npm run start
