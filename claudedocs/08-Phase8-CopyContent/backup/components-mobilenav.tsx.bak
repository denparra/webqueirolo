'use client'

import { useState } from 'react'
import Link from 'next/link'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import siteConfig from '@/config'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <span className="text-lg font-semibold text-gray-900">Menú</span>
            <button
              onClick={onClose}
              className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              aria-label="Cerrar menú"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto px-6 py-6">
            <ul className="space-y-1">
              <li>
                <Link
                  href="/"
                  className="block rounded-md px-4 py-3 text-base font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                  onClick={onClose}
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/vehiculos"
                  className="block rounded-md px-4 py-3 text-base font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                  onClick={onClose}
                >
                  Vehículos
                </Link>
              </li>
              <li>
                <Link
                  href="/servicios"
                  className="block rounded-md px-4 py-3 text-base font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                  onClick={onClose}
                >
                  Servicios
                </Link>
              </li>
              <li>
                <Link
                  href="/nosotros"
                  className="block rounded-md px-4 py-3 text-base font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                  onClick={onClose}
                >
                  Nosotros
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="block rounded-md px-4 py-3 text-base font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                  onClick={onClose}
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </nav>

          {/* Footer CTA */}
          <div className="border-t px-6 py-4">
            <Button variant="whatsapp" className="w-full" asChild>
              <a href={`https://wa.me/${siteConfig.contact.whatsapp}`} target="_blank" rel="noopener noreferrer">
                Contactar por WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
