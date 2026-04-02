import { Metadata } from 'next'
import siteConfig from '@/config'

const privacyContactEmail = 'dennys.e.parra.g@gmail.com'

export const metadata: Metadata = {
  title: `Privacidad | ${siteConfig.company.name}`,
  description:
    'Politica de privacidad de Queirolo Autos para formularios web, WhatsApp, WhatsApp Business API y atencion comercial automatizada.',
}

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <article className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow">
          <h1 className="text-3xl font-bold text-gray-900">Politica de Privacidad</h1>
          <p className="mt-4 text-gray-600">
            En Queirolo Autos respetamos y protegemos tu informacion personal. Esta politica explica
            como recopilamos, usamos y protegemos los datos cuando interactuas con nuestro sitio web,
            formularios y canales de atencion como WhatsApp.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">Quienes somos</h2>
          <p className="mt-3 text-gray-600">
            Queirolo Autos es una empresa dedicada a la venta de vehiculos y servicios relacionados,
            incluyendo consignacion, evaluacion comercial y seguimiento de clientes interesados.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">Que datos recopilamos</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-gray-600">
            <li>Nombre y apellido.</li>
            <li>Numero de telefono.</li>
            <li>Correo electronico.</li>
            <li>Patente y datos del vehiculo (marca, modelo, ano y antecedentes comerciales).</li>
            <li>Mensajes enviados por formularios del sitio o por WhatsApp.</li>
          </ul>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">Como recopilamos los datos</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-gray-600">
            <li>Cuando completas formularios en el sitio web.</li>
            <li>Cuando nos escribes por WhatsApp o respondes mensajes comerciales.</li>
            <li>Cuando entregas informacion para cotizar, vender o consignar un vehiculo.</li>
          </ul>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">Para que usamos la informacion</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-gray-600">
            <li>Responder consultas y solicitudes de contacto.</li>
            <li>Brindar atencion comercial y asesoria durante la compra o venta de vehiculos.</li>
            <li>Gestionar procesos de consignacion y seguimiento de clientes.</li>
            <li>Mejorar la calidad y eficiencia operativa de nuestra atencion.</li>
          </ul>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">
            Uso de WhatsApp y herramientas automatizadas
          </h2>
          <p className="mt-3 text-gray-600">
            Podemos usar WhatsApp, WhatsApp Business API y herramientas de automatizacion para
            ordenar conversaciones, responder en horarios extendidos y derivar casos a asesores
            comerciales. Tambien podemos utilizar un agente conversacional con IA para apoyo en la
            atencion inicial. Estas herramientas se usan solo para fines comerciales y de servicio al
            cliente.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">
            Conservacion y proteccion de la informacion
          </h2>
          <p className="mt-3 text-gray-600">
            Conservamos los datos solo por el tiempo necesario para atender tus solicitudes, mantener
            continuidad comercial y cumplir obligaciones legales o administrativas aplicables.
            Aplicamos medidas razonables de seguridad para prevenir accesos no autorizados, perdida o
            uso indebido de la informacion.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">Derechos del usuario</h2>
          <p className="mt-3 text-gray-600">
            Puedes solicitar acceso, actualizacion, correccion o eliminacion de tus datos personales
            contactandonos por correo electronico.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">
            Como solicitar correccion o eliminacion
          </h2>
          <p className="mt-3 text-gray-600">
            Para gestionar una solicitud, escribe a{' '}
            <a href={`mailto:${privacyContactEmail}`} className="font-medium text-primary-700 hover:underline">
              {privacyContactEmail}
            </a>{' '}
            indicando tu nombre, medio de contacto y el detalle de la solicitud.
          </p>

          <h2 id="eliminacion-de-datos" className="mt-8 scroll-mt-24 text-xl font-semibold text-gray-900">
            Eliminacion de datos
          </h2>
          <p className="mt-3 text-gray-600">
            Toda persona puede solicitar la eliminacion de sus datos personales enviados a traves de
            formularios, WhatsApp u otros canales de contacto de Queirolo Autos. Para realizar esta
            solicitud, debe escribir a{' '}
            <a href={`mailto:${privacyContactEmail}`} className="font-medium text-primary-700 hover:underline">
              {privacyContactEmail}
            </a>{' '}
            indicando, idealmente, su nombre, numero de contacto y el detalle de su solicitud.
            Evaluaremos cada caso y responderemos dentro de un plazo razonable. Determinados
            antecedentes podran conservarse cuando exista una obligacion legal o administrativa que
            asi lo requiera.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">Contacto</h2>
          <p className="mt-3 text-gray-600">
            Para consultas de privacidad, uso de datos o eliminacion de informacion, contactanos en{' '}
            <a href={`mailto:${privacyContactEmail}`} className="font-medium text-primary-700 hover:underline">
              {privacyContactEmail}
            </a>
            .
          </p>

          <p className="mt-8 text-sm text-gray-500">Ultima actualizacion: 2 de abril de 2026.</p>
        </article>
      </div>
    </div>
  )
}
