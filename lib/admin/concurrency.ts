// Ejecuta una función asíncrona sobre una lista con un límite de concurrencia,
// preservando el orden del array de resultados (resultado[i] corresponde a
// items[i], sin importar el orden en que terminen las promesas).
//
// Se usa para subir imágenes a Sanity en paralelo sin disparar N subidas
// simultáneas (que podrían saturar memoria/red), manteniendo el orden de la
// galería: images[0] sigue siendo la portada.

export async function mapWithConcurrency<T, R>(
  items: readonly T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length)

  if (items.length === 0) return results

  const workerCount = Math.max(1, Math.min(Math.floor(limit) || 1, items.length))
  let cursor = 0

  async function worker(): Promise<void> {
    while (cursor < items.length) {
      const index = cursor
      cursor += 1
      results[index] = await fn(items[index], index)
    }
  }

  await Promise.all(Array.from({ length: workerCount }, () => worker()))

  return results
}
