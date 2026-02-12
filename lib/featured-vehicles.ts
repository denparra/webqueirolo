import { client, projectId } from './sanity'
import { estimateMonthlyPayment } from './calculations'

export interface FeaturedVehicle {
  id: string
  slug: string
  brand: string
  model: string
  version?: string
  year: number
  price: number
  monthlyPayment: number
  km: number
  transmission: string
  category?: string
  image: string
  lqip?: string
  isNew: boolean
}

const FEATURED_QUERY = `
  *[_type == "vehicle" && status == "available"]
  | order(isFeatured desc, _createdAt desc) [0...6] {
    _id,
    "slug": slug.current,
    price,
    year,
    mileage,
    transmission,
    brand,
    model,
    version,
    category,
    "image": images[0].asset->url,
    "lqip": images[0].asset->metadata.lqip,
    status
  }
`

export async function getFeaturedVehicles(): Promise<FeaturedVehicle[]> {
  if (!projectId) {
    console.warn('[getFeaturedVehicles] No Sanity projectId, returning empty')
    return []
  }

  try {
    const results = await client.fetch(FEATURED_QUERY, {}, { next: { revalidate: 60 } })
    return results.map(mapToFeaturedVehicle)
  } catch (error) {
    console.error('Error fetching featured vehicles:', error)
    return []
  }
}

function mapToFeaturedVehicle(raw: any): FeaturedVehicle {
  return {
    id: raw._id,
    slug: raw.slug || '',
    brand: raw.brand || 'N/A',
    model: raw.model || 'N/A',
    version: raw.version,
    year: raw.year || 0,
    price: raw.price || 0,
    monthlyPayment: estimateMonthlyPayment(raw.price || 0),
    km: raw.mileage || 0,
    transmission: raw.transmission || 'N/A',
    category: raw.category,
    image: raw.image || '',
    lqip: raw.lqip,
    isNew: raw.mileage < 100 && raw.year >= new Date().getFullYear(),
  }
}
