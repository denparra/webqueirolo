import { client, projectId } from './sanity'
import { Vehicle } from './types'
import { mockVehicles } from './data'
import { estimateMonthlyPayment } from './calculations'

const isProd = process.env.NODE_ENV === 'production'

async function fetchWithRetry<T>(query: string, params: Record<string, unknown>) {
    try {
        return await client.fetch<T>(query, params, { next: { revalidate: 60 } })
    } catch (error) {
        if (!isProd) {
            throw error
        }
        await new Promise((resolve) => setTimeout(resolve, 500))
        return await client.fetch<T>(query, params, { next: { revalidate: 60 } })
    }
}

// Safe placeholder - uses a gray SVG data URI that works without external files
const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect fill="%23e5e7eb" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="16" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ESin imagen%3C/text%3E%3C/svg%3E'

// Helper to get safe image URL
function getSafeImageUrl(images: string[] | null | undefined): string {
    if (images && Array.isArray(images) && images.length > 0 && images[0]) {
        return images[0]
    }
    return PLACEHOLDER_IMAGE
}

// Mapper function to convert Sanity result to Vehicle interface
function mapSanityVehicle(sanityVehicle: any): Vehicle {
    const safeImages = sanityVehicle.images?.filter((img: string) => img) || []

    return {
        id: sanityVehicle._id,
        slug: sanityVehicle.slug,
        brand: sanityVehicle.brand || 'N/A',
        model: sanityVehicle.model || 'N/A',
        year: sanityVehicle.year || 0,
        price: sanityVehicle.price || 0,
        monthlyPayment: estimateMonthlyPayment(sanityVehicle.price || 0),
        km: sanityVehicle.mileage || 0,
        transmission: sanityVehicle.transmission || 'N/A',
        fuelType: sanityVehicle.fuel || 'N/A',
        image: getSafeImageUrl(safeImages),
        images: safeImages.length > 0 ? safeImages : [PLACEHOLDER_IMAGE],
        isNew: sanityVehicle.mileage < 100 && sanityVehicle.year >= new Date().getFullYear(),
        specs: {
            engine: 'N/A', // Not in current schema
            power: 'N/A',
            torque: 'N/A',
            drivetrain: sanityVehicle.safetyFeatures?.includes('4x4') ? '4x4' : '4x2',
            seating: sanityVehicle.comfortFeatures?.includes('tercera_fila') ? 7 : 5,
            color: sanityVehicle.color || 'N/A',
            doors: sanityVehicle.doors || 4,
        },
        features: [
            ...(sanityVehicle.comfortFeatures || []),
            ...(sanityVehicle.safetyFeatures || []),
            ...(sanityVehicle.entertainmentFeatures || []),
            ...(sanityVehicle.otherFeatures || [])
        ],
        // Preserve detailed arrays
        comfortFeatures: sanityVehicle.comfortFeatures,
        safetyFeatures: sanityVehicle.safetyFeatures,
        entertainmentFeatures: sanityVehicle.entertainmentFeatures,
        otherFeatures: sanityVehicle.otherFeatures,
        description: sanityVehicle.description,
        category: sanityVehicle.category,
        version: sanityVehicle.version,
        status: sanityVehicle.status,
        plate: sanityVehicle.plate
    }
}

export async function getVehicles(): Promise<Vehicle[]> {
    // If no project ID, return mock data to prevent errors
    if (!projectId) {
        const message = '[getVehicles] Sanity Project ID not found.'
        if (isProd) {
            throw new Error(message)
        }
        console.warn(`${message} Using mock data.`)
        return mockVehicles
    }

    const query = `*[_type == "vehicle"] | order(_createdAt desc) {
    _id,
    name,
    "slug": slug.current,
    price,
    year,
    mileage,
    transmission,
    fuel,
    brand,
    model,
    version,
    category,
    doors,
    color,
    plate,
    "images": images[].asset->url,
    comfortFeatures,
    safetyFeatures,
    entertainmentFeatures,
    otherFeatures,
    description,
    isFeatured,
    status
  }`

    try {
        const sanityVehicles = await fetchWithRetry<any[]>(query, {})
        return sanityVehicles.map(mapSanityVehicle)
    } catch (error) {
        console.error('Error fetching vehicles from Sanity:', error)
        if (isProd) {
            throw error
        }
        return mockVehicles
    }
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | undefined> {
    if (!projectId) {
        const message = '[getVehicleBySlug] Sanity Project ID not found.'
        if (isProd) {
            throw new Error(message)
        }
        console.warn(`${message} Using mock data.`)
        return mockVehicles.find(v => v.slug === slug)
    }

    const query = `*[_type == "vehicle" && slug.current == $slug][0] {
      _id,
      name,
      "slug": slug.current,
      price,
      year,
      mileage,
      transmission,
      fuel,
      brand,
      model,
      version,
      category,
      doors,
      color,
      plate,
      "images": images[].asset->url,
      comfortFeatures,
      safetyFeatures,
      entertainmentFeatures,
      otherFeatures,
      description,
      isFeatured,
      status
    }`

    try {
        const vehicle = await fetchWithRetry<any | null>(query, { slug })
        return vehicle ? mapSanityVehicle(vehicle) : undefined
    } catch (error) {
        console.error('Error fetching vehicle by slug:', error)
        if (isProd) {
            throw error
        }
        return mockVehicles.find(v => v.slug === slug)
    }
}
