import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ShieldCheckIcon,
  CurrencyDollarIcon,
  TruckIcon,
  ClockIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import siteConfig from '@/config'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-dark py-20 lg:py-32">
        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold leading-tight text-white lg:text-6xl">
              Tu Próximo 4x4 Está Aquí
            </h1>
            <p className="mb-8 text-lg text-gray-200 lg:text-xl">
              {siteConfig.company.tagline}
            </p>
            <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button size="lg" asChild>
                <Link href="/vehiculos">
                  Ver Vehículos Disponibles
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/servicios#financiamiento">
                  Simular Financiamiento
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 to-transparent" />
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl">
              ¿Por Qué Elegir {siteConfig.company.fullName}?
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Más de 15 años de experiencia en el mercado automotriz chileno
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1 */}
            <Card className="border-2 transition-all hover:border-primary-500 hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                  <ShieldCheckIcon className="h-6 w-6 text-primary-600" />
                </div>
                <CardTitle>Vehículos Certificados</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Todos nuestros vehículos pasan por una rigurosa inspección mecánica y de documentación.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-2 transition-all hover:border-primary-500 hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                  <CurrencyDollarIcon className="h-6 w-6 text-primary-600" />
                </div>
                <CardTitle>Financiamiento Directo</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Facilidades de pago sin banco, con tasas competitivas y aprobación rápida.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-2 transition-all hover:border-primary-500 hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                  <TruckIcon className="h-6 w-6 text-primary-600" />
                </div>
                <CardTitle>Permuta Disponible</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Aceptamos tu vehículo usado como parte de pago. Tasación justa y transparente.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="border-2 transition-all hover:border-primary-500 hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                  <ClockIcon className="h-6 w-6 text-primary-600" />
                </div>
                <CardTitle>Proceso Rápido</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Desde la consulta hasta la entrega de llaves en el menor tiempo posible.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-50 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl">
              ¿Listo para tu Próxima Aventura?
            </h2>
            <p className="mb-8 text-lg text-gray-600">
              Visítanos en nuestra sala de ventas en Las Condes o contáctanos por WhatsApp para más información
            </p>
            <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button size="lg" variant="whatsapp" asChild>
                <a href={`https://wa.me/${siteConfig.contact.whatsapp}`} target="_blank" rel="noopener noreferrer">
                  Contactar por WhatsApp
                </a>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/contacto">
                  Ver Ubicación
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
