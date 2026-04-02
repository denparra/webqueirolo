import { Metadata } from 'next'
import siteConfig from '@/config'

const dataRequestEmail = 'dennys.e.parra.q@gmail.com'

export const metadata: Metadata = {
  title: `Eliminacion de Datos | ${siteConfig.company.name}`,
  description:
    'Procedimiento para solicitar eliminacion de datos personales en Queirolo Autos.',
}

export default function EliminacionDeDatosPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <article className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow">
          <h1 className="text-3xl font-bold text-gray-900">Eliminacion de Datos</h1>
          <p className="mt-4 text-gray-600">
            Si quieres solicitar la eliminacion de tus datos personales de nuestros registros,
            puedes hacerlo a traves del correo indicado en esta pagina.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">
            Como solicitar la eliminacion de datos
          </h2>
          <p className="mt-3 text-gray-600">
            Envia una solicitud por correo electronico indicando claramente que deseas la eliminacion
            de tus datos asociados a formularios web, conversaciones de WhatsApp o procesos
            comerciales de Queirolo Autos.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">
            Informacion necesaria para validar la solicitud
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-gray-600">
            <li>Nombre completo del titular de los datos.</li>
            <li>Numero de telefono y/o correo utilizado en el contacto con Queirolo Autos.</li>
            <li>Detalle del canal usado (formulario web o WhatsApp).</li>
            <li>Patente o referencia del vehiculo, si corresponde.</li>
          </ul>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">Canal de contacto</h2>
          <p className="mt-3 text-gray-600">
            Correo de solicitudes de privacidad y eliminacion de datos:{' '}
            <a href={`mailto:${dataRequestEmail}`} className="font-medium text-primary-700 hover:underline">
              {dataRequestEmail}
            </a>
            .
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">Plazo estimado de respuesta</h2>
          <p className="mt-3 text-gray-600">
            Revisaremos la solicitud y responderemos en un plazo estimado de hasta 10 dias habiles,
            sujeto a validacion de identidad y antecedentes minimos necesarios para procesarla.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">
            Excepciones por obligacion legal o administrativa
          </h2>
          <p className="mt-3 text-gray-600">
            En algunos casos podriamos conservar ciertos datos por el periodo estrictamente necesario
            para cumplir obligaciones legales, administrativas o resguardar registros comerciales.
          </p>

          <p className="mt-8 text-sm text-gray-500">Ultima actualizacion: 2 de abril de 2026.</p>
        </article>
      </div>
    </div>
  )
}
