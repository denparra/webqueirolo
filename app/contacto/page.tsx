import { Metadata } from 'next'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { ContactForm } from '@/components/forms/ContactForm'
import { FadeIn } from '@/components/animations/FadeIn'
import { SlideUp } from '@/components/animations/SlideUp'
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon } from '@heroicons/react/24/outline'
import siteConfig from '@/config'

// Dynamic import for Leaflet (client-side only)
const LeafletMap = dynamic(() => import('@/components/maps/LeafletMap'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-200 animate-pulse" />,
})

// Wrapper component to pass config data
function LeafletMapWrapper() {
    const { lat, lng } = siteConfig.contact.address.coordinates
    return (
        <LeafletMap
            center={[lat, lng]}
            zoom={16}
            markerText={siteConfig.contact.address.displayAddress}
            className="w-full h-full"
        />
    )
}

export const metadata: Metadata = {
    title: `Contacto | ${siteConfig.company.name}`,
    description: 'Contáctanos para encontrar tu próximo vehículo 4x4. Estamos ubicados en Las Condes, Santiago.',
}

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative h-[300px] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
                <div className="absolute inset-0 bg-black/50 z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary-900/50 to-transparent z-10" />
                <Image
                    src="/images/showroom.jpg" // Ensuring we use a valid placeholder or image
                    alt="Contacto Queirolo Mundo 4x4"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="relative z-20 container mx-auto px-4 text-center">
                    <FadeIn>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Contáctanos</h1>
                        <p className="text-xl text-gray-200 max-w-2xl mx-auto">
                            Estamos aquí para ayudarte a encontrar el vehículo perfecto
                        </p>
                    </FadeIn>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Contact Info & Map */}
                        <SlideUp className="space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">Información de Contacto</h2>
                                <div className="grid gap-6">
                                    {/* Address */}
                                    <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl">
                                        <div className="p-3 bg-primary-100 rounded-xl">
                                            <MapPinIcon className="w-6 h-6 text-primary-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-1">Visítanos</h3>
                                            <p className="text-gray-600">{siteConfig.contact.address.displayAddress}</p>
                                            <a
                                                href="https://maps.google.com"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary-600 font-medium text-sm mt-2 inline-block hover:underline"
                                            >
                                                Ver en Mapa →
                                            </a>
                                        </div>
                                    </div>

                                    {/* Phone & WhatsApp */}
                                    <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl">
                                        <div className="p-3 bg-primary-100 rounded-xl">
                                            <PhoneIcon className="w-6 h-6 text-primary-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-1">Llámanos</h3>
                                            <div className="space-y-1">
                                                <a href={`tel:${siteConfig.contact.phone2.replace(/\D/g, '')}`} className="block text-gray-600 hover:text-primary-600">
                                                    {siteConfig.contact.phone2}
                                                </a>
                                                <a href={`tel:${siteConfig.contact.phone1.replace(/\D/g, '')}`} className="block text-gray-600 hover:text-primary-600">
                                                    {siteConfig.contact.phone1}
                                                </a>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-2">
                                                Atención telefónica en horario laboral
                                            </p>
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl">
                                        <div className="p-3 bg-primary-100 rounded-xl">
                                            <EnvelopeIcon className="w-6 h-6 text-primary-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-1">Escríbenos</h3>
                                            <a href={`mailto:${siteConfig.contact.email}`} className="text-gray-600 hover:text-primary-600">
                                                {siteConfig.contact.email}
                                            </a>
                                        </div>
                                    </div>

                                    {/* Hours */}
                                    <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl">
                                        <div className="p-3 bg-primary-100 rounded-xl">
                                            <ClockIcon className="w-6 h-6 text-primary-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-1">Horarios</h3>
                                            <p className="text-gray-600">{siteConfig.businessHours.weekdaysDetailed}</p>
                                            <p className="text-gray-600">{siteConfig.businessHours.saturdayDetailed}</p>
                                            <p className="text-gray-500 text-sm mt-1">Domingos y Festivos: {siteConfig.businessHours.sunday}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SlideUp>

                        {/* Contact Form */}
                        <SlideUp delay={0.2}>
                            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 lg:p-10 sticky top-24">
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Envíanos un Mensaje</h2>
                                    <p className="text-gray-600">
                                        Completa el formulario y te contactaremos a la brevedad posible.
                                    </p>
                                </div>
                                <ContactForm />
                            </div>
                        </SlideUp>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="h-[400px] w-full bg-gray-200">
                <LeafletMapWrapper />
            </section>
        </div>
    )
}
