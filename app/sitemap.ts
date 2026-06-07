import { MetadataRoute } from 'next'
import { getVehicles } from '@/lib/vehicles'
import config from '@/config'

// Revalida con la misma cadencia que el fetch de Sanity para reflejar el stock real.
export const revalidate = 60

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = config.url

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/vehiculos`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/servicios`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/nosotros`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacidad`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terminos-y-condiciones`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/eliminacion-de-datos`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  ]

  // Vehicle pages — inventario real desde Sanity.
  // Se excluyen los vendidos (siguen indexables pero no son prioridad de re-crawl)
  // y los registros sin slug o sin imágenes.
  let vehiclePages: MetadataRoute.Sitemap = []

  try {
    const vehicles = await getVehicles()
    vehiclePages = vehicles
      .filter(
        (vehicle) =>
          vehicle.slug &&
          vehicle.status !== 'sold' &&
          Array.isArray(vehicle.images) &&
          vehicle.images.length > 0
      )
      .map((vehicle) => ({
        url: `${baseUrl}/vehiculos/${vehicle.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
  } catch (error) {
    // Si Sanity falla, el sitemap igual responde con las páginas estáticas.
    console.error('[sitemap] Error obteniendo vehículos de Sanity:', error)
  }

  return [...staticPages, ...vehiclePages]
}
