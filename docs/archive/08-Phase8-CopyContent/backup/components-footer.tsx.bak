import Link from 'next/link'
import Image from 'next/image'
import { PhoneIcon, EnvelopeIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline'
import siteConfig from '@/config'

export default function Footer() {
  return (
    <footer className="border-t bg-gray-900 text-gray-300" role="contentinfo">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <Image
                src={siteConfig.logos.white}
                alt={siteConfig.company.fullName}
                width={192}
                height={48}
                className="h-12 w-auto"
                unoptimized
              />
            </div>
            <p className="text-sm leading-relaxed">
              {siteConfig.company.tagline}
            </p>
          </div>

          {/* Quick Links */}
          <nav aria-label="Enlaces rápidos">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-2 text-sm" role="list">
              <li>
                <Link href="/" className="hover:text-primary-400 transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/vehiculos" className="hover:text-primary-400 transition-colors">
                  Vehículos
                </Link>
              </li>
              <li>
                <Link href="/servicios" className="hover:text-primary-400 transition-colors">
                  Servicios
                </Link>
              </li>
              <li>
                <Link href="/nosotros" className="hover:text-primary-400 transition-colors">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-primary-400 transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </nav>

          {/* Services */}
          <nav aria-label="Servicios">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Servicios
            </h3>
            <ul className="space-y-2 text-sm" role="list">
              <li>
                <Link href="/servicios#financiamiento" className="hover:text-primary-400 transition-colors">
                  Financiamiento Directo
                </Link>
              </li>
              <li>
                <Link href="/servicios#tasacion" className="hover:text-primary-400 transition-colors">
                  Tasación de Vehículos
                </Link>
              </li>
              <li>
                <Link href="/servicios#permuta" className="hover:text-primary-400 transition-colors">
                  Permuta
                </Link>
              </li>
              <li>
                <Link href="/servicios#garantia" className="hover:text-primary-400 transition-colors">
                  Garantía Extendida
                </Link>
              </li>
            </ul>
          </nav>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Contacto
            </h3>
            <address className="space-y-3 text-sm not-italic">
              <div className="flex items-start space-x-3">
                <MapPinIcon className="h-5 w-5 flex-shrink-0 text-primary-500" aria-hidden="true" />
                <span>{siteConfig.contact.address.displayAddress}</span>
              </div>
              <div className="flex items-center space-x-3">
                <PhoneIcon className="h-5 w-5 flex-shrink-0 text-primary-500" aria-hidden="true" />
                <a href={`tel:${siteConfig.contact.whatsapp}`} className="hover:text-primary-400 transition-colors" aria-label={`Llamar al ${siteConfig.contact.whatsappDisplay}`}>
                  {siteConfig.contact.whatsappDisplay}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="h-5 w-5 flex-shrink-0 text-primary-500" aria-hidden="true" />
                <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-primary-400 transition-colors" aria-label={`Enviar correo a ${siteConfig.contact.email}`}>
                  {siteConfig.contact.email}
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <ClockIcon className="h-5 w-5 flex-shrink-0 text-primary-500" aria-hidden="true" />
                <div>
                  <div>{siteConfig.businessHours.weekdaysDetailed}</div>
                  <div>{siteConfig.businessHours.saturdayDetailed}</div>
                </div>
              </div>
            </address>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-between space-y-4 text-sm md:flex-row md:space-y-0">
            <p className="text-center md:text-left">
              © {new Date().getFullYear()} {siteConfig.company.fullName}. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6">
              <Link href="/privacidad" className="hover:text-primary-400 transition-colors">
                Privacidad
              </Link>
              <Link href="/terminos" className="hover:text-primary-400 transition-colors">
                Términos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
