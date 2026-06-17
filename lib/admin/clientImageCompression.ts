// Compresión/redimensionado de imágenes en el navegador antes de subirlas al
// Server Action. Reduce los bytes que viajan por la conexión del owner (el
// cuello de botella real en producción) y evita acercarse al límite de
// bodySizeLimit de Next.js. La capa de servidor (sharp) actúa como red de
// seguridad si algo de esto falla o el navegador no soporta las APIs usadas.
//
// Usa solo APIs nativas del navegador (createImageBitmap / canvas), sin
// dependencias nuevas.

import {
  computeTargetDimensions,
  CLIENT_MAX_EDGE,
  CLIENT_JPEG_QUALITY,
} from './imageResize'

// Solo se comprimen formatos raster que el canvas maneja sin pérdida estructural.
// GIF se excluye a propósito para no aplanar animaciones; HEIC/HEIF y otros se
// dejan pasar para que la capa de servidor los convierta.
const CLIENT_COMPRESSIBLE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

async function decodeBitmap(file: File): Promise<ImageBitmap | null> {
  if (typeof createImageBitmap !== 'function') return null
  try {
    // imageOrientation: 'from-image' respeta la orientación EXIF al decodificar.
    return await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch {
    try {
      // Fallback para navegadores que no aceptan el segundo argumento.
      return await createImageBitmap(file)
    } catch {
      return null
    }
  }
}

function canvasToJpegBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/jpeg', CLIENT_JPEG_QUALITY)
  })
}

/**
 * Devuelve una versión comprimida del archivo, o el archivo original si no se
 * puede comprimir (tipo no soportado, API ausente, error, o si el resultado no
 * resulta más liviano). Nunca lanza: ante cualquier problema, devuelve el
 * original para no bloquear al owner.
 */
export async function compressImageFile(file: File): Promise<File> {
  if (!CLIENT_COMPRESSIBLE_TYPES.has(file.type)) return file

  const bitmap = await decodeBitmap(file)
  if (!bitmap) return file

  try {
    const { width, height } = computeTargetDimensions(bitmap.width, bitmap.height, CLIENT_MAX_EDGE)
    if (width <= 0 || height <= 0) return file

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')
    if (!ctx) return file

    ctx.drawImage(bitmap, 0, 0, width, height)

    const blob = await canvasToJpegBlob(canvas)
    if (!blob || blob.size === 0) return file

    // Si la "compresión" no redujo el peso (imagen ya muy optimizada), se
    // conserva el original para no degradar calidad sin beneficio.
    if (blob.size >= file.size) return file

    const newName = file.name.replace(/\.[^.]+$/, '') + '.jpg'
    return new File([blob], newName, { type: 'image/jpeg', lastModified: Date.now() })
  } catch {
    return file
  } finally {
    bitmap.close?.()
  }
}

/** Comprime una lista de archivos en paralelo, tolerando fallos individuales. */
export async function compressImageFiles(files: File[]): Promise<File[]> {
  return Promise.all(files.map((file) => compressImageFile(file)))
}
