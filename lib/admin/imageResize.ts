// Lógica pura de redimensionado de imágenes, sin dependencias de navegador ni
// de Node, para poder compartirla entre la capa cliente (canvas) y la de
// servidor (sharp) y, sobre todo, para poder testearla de forma aislada.

/** Lado máximo (px) al que se reduce una imagen en el navegador antes de subirla. */
export const CLIENT_MAX_EDGE = 2000
/** Calidad JPEG (0..1) usada por canvas.toBlob en el cliente. */
export const CLIENT_JPEG_QUALITY = 0.82

/** Lado máximo (px) al que sharp reduce la imagen en el servidor. */
export const SERVER_MAX_EDGE = 2400
/** Calidad JPEG (0..100) usada por sharp en el servidor. */
export const SERVER_JPEG_QUALITY = 82

export interface Dimensions {
  width: number
  height: number
}

/**
 * Calcula las dimensiones objetivo manteniendo el aspect ratio.
 * - Nunca agranda: si el lado mayor ya es <= maxEdge, devuelve el original.
 * - Si las dimensiones de entrada son inválidas (<= 0), devuelve {0,0}.
 */
export function computeTargetDimensions(
  width: number,
  height: number,
  maxEdge: number
): Dimensions {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return { width: 0, height: 0 }
  }

  const longestEdge = Math.max(width, height)
  if (longestEdge <= maxEdge) {
    return { width, height }
  }

  const scale = maxEdge / longestEdge
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  }
}

/**
 * Decide si una imagen ya cumple los requisitos del servidor y puede subirse
 * a Sanity sin pasar por sharp.
 *
 * Existe porque el navegador ya reduce a CLIENT_MAX_EDGE (2000px) y comprime a
 * JPEG antes de subir. Como CLIENT_MAX_EDGE < SERVER_MAX_EDGE (2400px), el
 * resize del servidor no cambiaría un solo píxel: solo decodificaría y
 * re-comprimiría con mozjpeg, quemando CPU y bloqueando el threadpool de libuv
 * que Node comparte con `dns.lookup()`. El costo era real y el beneficio, cero.
 *
 * Se mantiene pura (sin sharp, sin Buffer) para poder testearla en aislamiento;
 * quien la llama se encarga de leer los metadatos.
 */
export function shouldSkipServerResize(metadata: {
  contentType: string
  width?: number
  height?: number
  /** Flag EXIF de orientación: `undefined` si la imagen no lo trae. */
  orientation?: number
}): boolean {
  // Solo JPEG: cualquier otro formato hay que convertirlo igual.
  if (metadata.contentType !== 'image/jpeg') return false

  // Sin dimensiones legibles no hay decisión posible: que resuelva sharp.
  if (!metadata.width || !metadata.height) return false

  // Si excede el lado máximo, el resize sí hace trabajo útil.
  if (Math.max(metadata.width, metadata.height) > SERVER_MAX_EDGE) return false

  // El resize del servidor usa .rotate() para hornear la orientación EXIF en
  // los píxeles. Saltearlo con un flag distinto de 1 dejaría fotos de celular
  // giradas en cualquier cliente que ignore el EXIF.
  if (metadata.orientation !== undefined && metadata.orientation !== 1) return false

  return true
}
