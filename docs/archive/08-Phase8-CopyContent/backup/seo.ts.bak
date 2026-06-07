import { Metadata } from 'next'
import { mockVehicles } from './data'
import config from '@/config'

// Base metadata for the site
export const siteConfig = {
  name: config.company.fullName,
  description: config.company.tagline,
  url: 'https://www.queirolo.cl',
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
    default: `${siteConfig.name} | Vehículos Seminuevos en Las Condes`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'vehículos 4x4',
    'seminuevos',
    'financiamiento',
    'Las Condes',
    'Chile',
    'SUV',
    'camionetas',
    'todoterreno',
    'automotriz',
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
    // Add Google Search Console verification when available
    // google: 'verification_token',
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

// Generate JSON-LD for vehicle
export function generateVehicleSchema(vehicle: {
  brand: string
  model: string
  year: number
  price: number
  km: number
  transmission: string
  fuelType: string
  image: string
  slug: string
  specs: {
    engine: string
    color: string
  }
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: `${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
    brand: {
      '@type': 'Brand',
      name: vehicle.brand,
    },
    model: vehicle.model,
    vehicleModelDate: vehicle.year.toString(),
    mileageFromOdometer: {
      '@type': 'QuantitativeValue',
      value: vehicle.km,
      unitCode: 'KMT',
    },
    vehicleTransmission: vehicle.transmission,
    fuelType: vehicle.fuelType,
    vehicleEngine: {
      '@type': 'EngineSpecification',
      name: vehicle.specs.engine,
    },
    color: vehicle.specs.color,
    image: `${siteConfig.url}${vehicle.image}`,
    url: `${siteConfig.url}/vehiculos/${vehicle.slug}`,
    offers: {
      '@type': 'Offer',
      price: vehicle.price,
      priceCurrency: 'CLP',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'AutoDealer',
        name: siteConfig.name,
      },
    },
  }
}

// Generate JSON-LD for vehicle list page
export function generateVehicleListSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Vehículos Disponibles',
    description: 'Catálogo de vehículos seminuevos certificados',
    numberOfItems: mockVehicles.length,
    itemListElement: mockVehicles.map((vehicle, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Car',
        name: `${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
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
