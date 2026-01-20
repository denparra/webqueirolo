'use client'

import { Button } from '@/components/ui/button'
import siteConfig from '@/config'

export default function Error({
  reset,
}: {
  reset: () => void
}) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4 py-16">
      <div className="max-w-xl text-center">
        <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
          Algo salió mal de nuestro lado
        </h1>
        <p className="mb-8 text-gray-600">
          Estamos trabajando para solucionarlo. Intenta de nuevo en unos minutos o contáctanos por WhatsApp.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" onClick={reset}>
            Reintentar
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <a
              href={`https://wa.me/${siteConfig.contact.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Contactar por WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
