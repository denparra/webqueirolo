import { Metadata } from 'next'
import siteConfig from '@/config'

export const metadata: Metadata = {
    title: `Terminos | ${siteConfig.company.name}`,
    description: 'Terminos y condiciones de uso del sitio Queirolo Autos.',
}

export default function TerminosPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow">
                    <h1 className="text-3xl font-bold text-gray-900">Terminos y Condiciones</h1>
                    <p className="mt-4 text-gray-600">
                        El contenido del sitio es informativo y puede cambiar sin previo aviso. Las
                        publicaciones no constituyen una oferta vinculante y la disponibilidad de los
                        vehiculos esta sujeta a confirmacion.
                    </p>
                    <h2 className="mt-8 text-xl font-semibold text-gray-900">Uso del sitio</h2>
                    <ul className="mt-3 list-disc pl-6 text-gray-600">
                        <li>No usar el sitio para fines ilicitos.</li>
                        <li>No interferir con el funcionamiento o la seguridad del sitio.</li>
                        <li>Respetar la propiedad intelectual de contenidos y marcas.</li>
                    </ul>
                    <h2 className="mt-8 text-xl font-semibold text-gray-900">Responsabilidad</h2>
                    <p className="mt-3 text-gray-600">
                        Queirolo Autos no se responsabiliza por decisiones basadas exclusivamente en la
                        informacion publicada. Recomendamos validar condiciones comerciales con un asesor.
                    </p>
                    <p className="mt-8 text-sm text-gray-500">
                        Para consultas sobre estos terminos, escribe a {siteConfig.contact.email}.
                    </p>
                </div>
            </div>
        </div>
    )
}
