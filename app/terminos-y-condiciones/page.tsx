import { Metadata } from 'next'
import siteConfig from '@/config'

const legalContactEmail = 'dennys.e.parra.q@gmail.com'

export const metadata: Metadata = {
  title: `Terminos y Condiciones | ${siteConfig.company.name}`,
  description:
    'Terminos y condiciones de uso del sitio web y canales de contacto de Queirolo Autos.',
}

export default function TerminosYCondicionesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <article className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow">
          <h1 className="text-3xl font-bold text-gray-900">Terminos y Condiciones</h1>
          <p className="mt-4 text-gray-600">
            Estos terminos regulan el uso del sitio web y de los canales de contacto de Queirolo
            Autos. Al utilizar este sitio, aceptas estas condiciones.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">Uso del sitio</h2>
          <p className="mt-3 text-gray-600">
            El contenido publicado es de caracter informativo y comercial. La disponibilidad de
            vehiculos, precios, condiciones de financiamiento y servicios puede variar y esta sujeta a
            confirmacion por parte del equipo comercial.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">
            Uso de formularios y canales de contacto
          </h2>
          <p className="mt-3 text-gray-600">
            Los formularios del sitio y canales como WhatsApp pueden utilizarse para solicitar
            informacion, cotizaciones, seguimiento comercial, venta de vehiculos y consignacion.
            Tambien podemos usar WhatsApp Business API y automatizaciones para mejorar tiempos de
            respuesta y gestion de conversaciones.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">
            Responsabilidad sobre la informacion entregada
          </h2>
          <p className="mt-3 text-gray-600">
            El usuario es responsable de que los datos proporcionados sean correctos, actuales y
            verificables, especialmente en antecedentes de contacto y datos del vehiculo.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">Propiedad del contenido</h2>
          <p className="mt-3 text-gray-600">
            Los textos, imagenes, marcas, logotipos y otros contenidos del sitio pertenecen a Queirolo
            Autos o a sus respectivos titulares. No esta permitido reproducirlos o usarlos con fines
            comerciales sin autorizacion previa.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">Limitacion de responsabilidad</h2>
          <p className="mt-3 text-gray-600">
            Queirolo Autos no garantiza que el sitio opere sin interrupciones o errores en todo
            momento. Tampoco se responsabiliza por decisiones tomadas exclusivamente con base en la
            informacion publicada sin validacion comercial directa.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">Cambios en contenido o servicios</h2>
          <p className="mt-3 text-gray-600">
            Nos reservamos el derecho de actualizar o modificar contenidos, servicios, procesos
            comerciales y estos terminos cuando sea necesario para mejorar la operacion o cumplir
            exigencias legales y de plataformas.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">Contacto</h2>
          <p className="mt-3 text-gray-600">
            Para consultas relacionadas con estos terminos, escribe a{' '}
            <a href={`mailto:${legalContactEmail}`} className="font-medium text-primary-700 hover:underline">
              {legalContactEmail}
            </a>
            .
          </p>

          <p className="mt-8 text-sm text-gray-500">Ultima actualizacion: 2 de abril de 2026.</p>
        </article>
      </div>
    </div>
  )
}
