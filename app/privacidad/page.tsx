import { Metadata } from 'next'
import siteConfig from '@/config'

export const metadata: Metadata = {
    title: `Privacidad | ${siteConfig.company.name}`,
    description: 'Politica de privacidad y uso de datos de Queirolo Autos.',
}

export default function PrivacidadPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow">
                    <h1 className="text-3xl font-bold text-gray-900">Politica de Privacidad</h1>
                    <p className="mt-4 text-gray-600">
                        Este sitio recopila datos de contacto solo para responder solicitudes, evaluar
                        financiamiento y coordinar visitas. No vendemos ni compartimos datos personales con
                        terceros fuera de los proveedores necesarios para operar el servicio.
                    </p>
                    <h2 className="mt-8 text-xl font-semibold text-gray-900">Datos que recopilamos</h2>
                    <ul className="mt-3 list-disc pl-6 text-gray-600">
                        <li>Nombre, correo y telefono cuando completas formularios.</li>
                        <li>Detalles del vehiculo de interes para cotizacion.</li>
                        <li>Datos tecnicos anonimos para analitica del sitio.</li>
                    </ul>
                    <h2 className="mt-8 text-xl font-semibold text-gray-900">Uso de la informacion</h2>
                    <ul className="mt-3 list-disc pl-6 text-gray-600">
                        <li>Contactarte y responder tu solicitud.</li>
                        <li>Mejorar la experiencia del sitio y sus contenidos.</li>
                        <li>Cumplir obligaciones legales aplicables.</li>
                    </ul>
                    <p className="mt-8 text-sm text-gray-500">
                        Para consultas sobre privacidad, escribe a {siteConfig.contact.email}.
                    </p>
                </div>
            </div>
        </div>
    )
}
