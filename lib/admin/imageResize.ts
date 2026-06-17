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
