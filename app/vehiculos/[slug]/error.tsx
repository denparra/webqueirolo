'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import siteConfig from '@/config'

/**
 * Boundary de la ficha de vehículo.
 *
 * `getVehicleBySlug` relanza en producción cuando Sanity no responde (timeout de
 * red, DNS saturado). Sin este boundary el visitante veía la pantalla de error
 * cruda de Next y perdía el layout del catálogo. Acá el fallo queda acotado al
 * segmento: se conserva la navegación y se ofrecen salidas útiles.
 *
 * `reset()` re-renderiza el segmento: si el problema era transitorio, la ficha
 * carga sin recargar toda la página.
 */
export default function VehicleDetailError({
  reset,
}: {
  reset: () => void
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="max-w-xl text-center">
        <h1 className="mb-4 text-2xl font-bold text-gray-900 md:text-3xl">
          No pudimos cargar este vehículo
        </h1>
        <p className="mb-8 text-gray-600">
          Es un problema temporal de nuestro lado, no del vehículo. Volvé a
          intentar en unos segundos o escribinos y te pasamos la ficha completa.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" onClick={reset}>
            Reintentar
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/vehiculos">Ver todo el stock</Link>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <a
              href={`https://wa.me/${siteConfig.contact.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Consultar por WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
