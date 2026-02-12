import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { getFeaturedVehicles } from '@/lib/featured-vehicles'
import { FeaturedVehicleCard } from './FeaturedVehicleCard'
import { FadeIn } from '@/components/animations/FadeIn'

export async function FeaturedVehiclesSection() {
  const vehicles = await getFeaturedVehicles()

  if (vehicles.length === 0) {
    return null
  }

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <FadeIn>
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-3xl font-bold text-gray-900 lg:text-4xl">
              Autos Destacados
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Seleccionados especialmente para ti
            </p>
          </div>
        </FadeIn>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle, idx) => (
            <FadeIn delay={idx * 0.1} key={vehicle.id}>
              <FeaturedVehicleCard vehicle={vehicle} priority={idx < 3} />
            </FadeIn>
          ))}
        </div>

        {/* CTA */}
        <FadeIn>
          <div className="mt-10 text-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/vehiculos">
                Ver todo el inventario
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
