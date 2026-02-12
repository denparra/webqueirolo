import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { StatsBar } from './StatsBar'
import siteConfig from '@/config'

export function HeroSection() {
  return (
    <section className="relative flex min-h-[70vh] items-end overflow-hidden lg:min-h-[80vh]">
      {/* Background image */}
      <Image
        src="/images/showroom.jpg"
        alt="Queirolo Autos showroom"
        fill
        priority
        className="object-cover"
        sizes="100vw"
        quality={85}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 pb-8 pt-32 lg:pb-12">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold leading-tight text-white lg:text-6xl">
            Queirolo Autos: Tu proximo auto con la confianza de siempre
          </h1>
          <p className="mb-8 text-lg text-gray-200 lg:text-xl">
            {siteConfig.company.tagline}
          </p>
          <div className="mb-10 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Button size="lg" asChild>
              <Link href="/vehiculos">
                Ver Vehiculos
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 hover:text-white" asChild>
              <Link href="/nosotros">
                Conocer Nuestra Historia
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats bar at the bottom */}
        <StatsBar />
      </div>
    </section>
  )
}
