import { client } from './sanity'
import { Vehicle } from './types'
import { mockVehicles } from './data'
import { estimateMonthlyPayment } from './calculations'

// Mapper function to convert Sanity result to Vehicle interface
function mapSanityVehicle(sanityVehicle: any): Vehicle {
    return {
        id: sanityVehicle._id,
        slug: sanityVehicle.slug,
        brand: sanityVehicle.brand,
        model: sanityVehicle.model,
        year: sanityVehicle.year,
        price: sanityVehicle.price,
        monthlyPayment: estimateMonthlyPayment(sanityVehicle.price),
        km: sanityVehicle.mileage || 0,
        transmission: sanityVehicle.transmission,
        fuelType: sanityVehicle.fuel,
        image: sanityVehicle.images && sanityVehicle.images.length > 0 ? sanityVehicle.images[0] : '/images/placeholder.jpg',
        images: sanityVehicle.images || [],
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
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
        console.warn('Sanity Project ID not found. Using mock data.')
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
        const sanityVehicles = await client.fetch(query, {}, { next: { revalidate: 60 } })
        return sanityVehicles.map(mapSanityVehicle)
    } catch (error) {
        console.error('Error fetching vehicles from Sanity:', error)
        return mockVehicles
    }
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | undefined> {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
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
        const vehicle = await client.fetch(query, { slug }, { next: { revalidate: 60 } })
        return vehicle ? mapSanityVehicle(vehicle) : undefined
    } catch (error) {
        console.error('Error fetching vehicle by slug:', error)
        return mockVehicles.find(v => v.slug === slug)
    }
}
