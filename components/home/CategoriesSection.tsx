import Link from 'next/link'
import { FadeIn } from '@/components/animations/FadeIn'

const categories = [
  { name: 'SUV', slug: 'suv' },
  { name: 'Sedan', slug: 'sedan' },
  { name: 'Camioneta', slug: 'camioneta' },
  { name: 'Hatchback', slug: 'hatchback' },
  { name: 'Coupe', slug: 'coupe' },
  { name: 'Comercial', slug: 'comercial' },
]

export function CategoriesSection() {
  return (
    <section className="py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <FadeIn>
          <div className="mb-8 text-center">
            <h2 className="mb-3 text-3xl font-bold text-gray-900 lg:text-4xl">
              Explora por Categoria
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Encuentra el vehiculo ideal segun tu estilo
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href="/vehiculos"
                className="rounded-full border-2 border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-primary-500 hover:bg-primary-50 hover:text-primary-600"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
