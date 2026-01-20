import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4 py-16">
      <div className="max-w-xl text-center">
        <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
          Esta página tomó un desvío
        </h1>
        <p className="mb-8 text-gray-600">
          Parece que la página que buscas no existe o fue movida. Vuelve al inicio o explora nuestro catálogo.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/">Volver al Inicio</Link>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/vehiculos">Ver Vehículos</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
