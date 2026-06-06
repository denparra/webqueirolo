import { Metadata } from 'next'
import { Vehicle } from './types'
import config from '@/config'

// Base metadata for the site
export const siteConfig = {
  name: config.company.fullName,
  description: config.company.tagline,
  url: config.url,
  locale: 'es_CL',
  phone: config.contact.whatsappDisplay,
  address: {
    street: config.contact.address.street,
    city: config.contact.address.city,
    region: 'Santiago',
    country: 'Chile',
    postalCode: '',
  },
  geo: {
    latitude: -33.4083,
    longitude: -70.5669,
  },
  socialMedia: {
    instagram: config.social.instagram,
  },
  businessHours: {
    weekday: '09:30-18:00',
    saturday: 'Con previa cita',
    sunday: 'Cerrado',
  },
}

// Default metadata
export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'Queirolo Autos - Venta de Vehículos Seminuevos en Las Condes',
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'vehículos seminuevos',
    'autos usados',
    'financiamiento con financieras',
    'consignación',
    'parte de pago',
    'Las Condes',
    'Santiago',
    'Chile',
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Vehículos Seminuevos`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Se completa con la env var cuando el cliente tenga Search Console (sin valor, Next omite el tag).
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
  },
}

// Generate JSON-LD for local business
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.region,
      addressCountry: siteConfig.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: siteConfig.geo.latitude,
      longitude: siteConfig.geo.longitude,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:30',
        closes: '18:00',
      },
    ],
    priceRange: '$$',
    sameAs: [siteConfig.socialMedia.instagram],
    image: `${siteConfig.url}/og-image.jpg`,
  }
}

// Generate JSON-LD for vehicle.
// IMPORTANTE: nunca se incluyen patente ni VIN (decisión de privacidad).
export function generateVehicleSchema(vehicle: Vehicle) {
  // availability: solo 'sold' marca SoldOut; 'available'/'reserved' siguen InStock.
  const availability =
    vehicle.status === 'sold'
      ? 'https://schema.org/SoldOut'
      : 'https://schema.org/InStock'

  // La imagen de Sanity ya es una URL absoluta (cdn.sanity.io).
  const image = vehicle.images?.[0] || vehicle.image

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: [vehicle.brand, vehicle.model, vehicle.version, vehicle.year]
      .filter(Boolean)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim(),
    brand: {
      '@type': 'Brand',
      name: vehicle.brand,
    },
    model: vehicle.model,
    vehicleModelDate: vehicle.year ? vehicle.year.toString() : undefined,
    mileageFromOdometer: {
      '@type': 'QuantitativeValue',
      value: vehicle.km,
      unitCode: 'KMT',
    },
    image,
    url: `${siteConfig.url}/vehiculos/${vehicle.slug}`,
    offers: {
      '@type': 'Offer',
      price: vehicle.price,
      priceCurrency: 'CLP',
      availability,
      seller: {
        '@type': 'AutoDealer',
        name: siteConfig.name,
      },
    },
  }

  // Campos opcionales: solo se agregan si existen (evita valores vacíos en el schema).
  if (vehicle.transmission) schema.vehicleTransmission = vehicle.transmission
  if (vehicle.fuelType) schema.fuelType = vehicle.fuelType
  if (vehicle.specs?.color) schema.color = vehicle.specs.color
  if (vehicle.specs?.engine) {
    schema.vehicleEngine = {
      '@type': 'EngineSpecification',
      name: vehicle.specs.engine,
    }
  }

  return schema
}

// Generate JSON-LD for vehicle list page
export function generateVehicleListSchema(vehicles: Vehicle[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Nuestros Vehículos',
    description: 'Explora nuestro stock actual, seleccionado con estándares de calidad.',
    numberOfItems: vehicles.length,
    itemListElement: vehicles.map((vehicle, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Car',
        name: [vehicle.brand, vehicle.model, vehicle.version, vehicle.year]
          .filter(Boolean)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim(),
        url: `${siteConfig.url}/vehiculos/${vehicle.slug}`,
      },
    })),
  }
}

// Generate breadcrumb schema
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

// Generate FAQ schema for services page
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}
