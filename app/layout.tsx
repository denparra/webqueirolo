import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/shared/WhatsAppButton'
import { CompareBar } from '@/components/vehicles/CompareBar'
import { SchemaScript } from '@/components/shared/SchemaScript'
import { defaultMetadata, generateLocalBusinessSchema } from '@/lib/seo'
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics'
import siteConfig from '@/config'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
})

export const metadata: Metadata = {
  ...defaultMetadata,
  title: siteConfig.seo.title,
  description: siteConfig.seo.description,
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#E63946',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const localBusinessSchema = generateLocalBusinessSchema()

  return (
    <html lang="es" className={inter.variable}>
      <head>
        <SchemaScript schema={localBusinessSchema} />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <GoogleAnalytics />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-primary-500 focus:px-4 focus:py-2 focus:text-white focus:outline-none"
        >
          Saltar al contenido principal
        </a>
        <Navbar />
        <main id="main-content" className="flex-grow pt-16" role="main">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
        <CompareBar />
      </body>
    </html>
  )
}
