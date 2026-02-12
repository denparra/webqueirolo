import { HeroSection } from '@/components/home/HeroSection'
import { FeaturedVehiclesSection } from '@/components/home/FeaturedVehiclesSection'
import { CategoriesSection } from '@/components/home/CategoriesSection'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ShieldCheckIcon,
  CurrencyDollarIcon,
  TruckIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import siteConfig from '@/config'
import { Metadata } from 'next'
import { FadeIn } from '@/components/animations/FadeIn'

export const metadata: Metadata = {
  title: 'Queirolo Autos - Venta de Vehiculos Seminuevos en Las Condes',
  description: 'Mas de 60 anos vendiendo autos con confianza. Venta, consignacion y financiamiento en Las Condes, Santiago. Visitanos sin compromiso.',
}

const features = [
  {
    icon: ShieldCheckIcon,
    stat: '60+',
    title: 'Revision Tecnica Completa',
    description: 'Cada vehiculo pasa por una inspeccion exhaustiva antes de estar disponible.',
  },
  {
    icon: CurrencyDollarIcon,
    stat: '100%',
    title: 'Financiamiento con Financieras',
    description: 'Te ayudamos a encontrar opciones de credito adaptadas a tu situacion.',
  },
  {
    icon: TruckIcon,
    stat: 'Parte',
    title: 'Recibimos tu Auto',
    description: 'Evaluamos tu vehiculo actual como parte de pago.',
  },
  {
    icon: ClockIcon,
    stat: 'Online',
    title: 'Tramites Online',
    description: 'Transferencia con clave unica y procesos digitales sin complicaciones.',
  },
]

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Vehicles Section */}
      <FeaturedVehiclesSection />

      {/* Features Section - Redesigned */}
      <section className="bg-gray-50 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl">
                ¿Por que elegir {siteConfig.company.fullName}?
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-600">
                Mas de 60 anos en el rubro automotriz
              </p>
            </div>
          </FadeIn>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, idx) => (
              <FadeIn key={feature.title} delay={idx * 0.1}>
                <Card className="border-2 transition-all hover:border-primary-500 hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                      <feature.icon className="h-6 w-6 text-primary-600" />
                    </div>
                    <p className="text-2xl font-bold text-primary-600">{feature.stat}</p>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <CategoriesSection />

      {/* CTA Section - Improved */}
      <section className="bg-primary-50 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl">
                ¿Listo para tu proximo auto?
              </h2>
              <p className="mb-2 text-lg text-gray-600">
                Visitanos en Las Condes o escribenos. Te atendemos sin presiones y resolvemos todas tus dudas.
              </p>
              <p className="mb-8 text-sm text-gray-500">
                Respuesta en minutos
              </p>
              <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Button size="lg" variant="whatsapp" asChild>
                  <a href={`https://wa.me/${siteConfig.contact.whatsapp}`} target="_blank" rel="noopener noreferrer">
                    Contactar por WhatsApp
                  </a>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/contacto">
                    Ver Ubicacion
                  </Link>
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
