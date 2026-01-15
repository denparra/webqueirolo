'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Bars3Icon, PhoneIcon, ClockIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import MobileNav from './MobileNav'
import siteConfig from '@/config'

export default function Navbar() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80" role="banner">
        {/* Top Bar - Hidden on mobile */}
        <div className="hidden border-b bg-gray-50 lg:block" aria-label="Información de contacto">
          <div className="container mx-auto px-4">
            <div className="flex h-10 items-center justify-between text-sm">
              <div className="flex items-center space-x-6 text-gray-600">
                <div className="flex items-center space-x-2">
                  <ClockIcon className="h-4 w-4" aria-hidden="true" />
                  <span suppressHydrationWarning>{siteConfig.businessHours.weekdays} | {siteConfig.businessHours.saturday}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <PhoneIcon className="h-4 w-4" aria-hidden="true" />
                  <a href={`tel:${siteConfig.contact.whatsapp}`} className="hover:text-primary-600" aria-label={`Llamar al ${siteConfig.contact.whatsappDisplay}`}>
                    {siteConfig.contact.whatsappDisplay}
                  </a>
                </div>
              </div>
              <address className="text-gray-600 not-italic">
                <span>{siteConfig.contact.address.displayAddress}</span>
              </address>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/">
              <Image
                src={siteConfig.logos.black}
                alt={siteConfig.company.fullName}
                width={208}
                height={52}
                className="h-[52px] w-auto"
                priority
                unoptimized
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex lg:items-center lg:space-x-8" aria-label="Navegación principal">
              <Link
                href="/"
                className="text-sm font-medium text-gray-700 transition-colors hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md px-2 py-1"
              >
                Inicio
              </Link>
              <Link
                href="/vehiculos"
                className="text-sm font-medium text-gray-700 transition-colors hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md px-2 py-1"
              >
                Vehículos
              </Link>
              <Link
                href="/servicios"
                className="text-sm font-medium text-gray-700 transition-colors hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md px-2 py-1"
              >
                Servicios
              </Link>
              <Link
                href="/nosotros"
                className="text-sm font-medium text-gray-700 transition-colors hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md px-2 py-1"
              >
                Nosotros
              </Link>
              <Link
                href="/contacto"
                className="text-sm font-medium text-gray-700 transition-colors hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md px-2 py-1"
              >
                Contacto
              </Link>
            </nav>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <Button variant="whatsapp" size="sm" className="hidden lg:inline-flex" asChild>
                <a
                  href={`https://wa.me/${siteConfig.contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Contactar por WhatsApp"
                >
                  WhatsApp
                </a>
              </Button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileNavOpen(true)}
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 lg:hidden"
                aria-label="Abrir menú de navegación"
                aria-expanded={mobileNavOpen}
                aria-controls="mobile-navigation"
              >
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
    </>
  )
}
