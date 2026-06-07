import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LoanCalculator } from '@/components/forms/LoanCalculator'
import { FinancingForm } from '@/components/forms/FinancingForm'
import { ConsignmentForm } from '@/components/forms/ConsignmentForm'
import { ContactForm } from '@/components/forms/ContactForm'
import {
    ShieldCheckIcon,
    ClockIcon,
    CurrencyDollarIcon,
    TruckIcon,
} from '@heroicons/react/24/outline'
import siteConfig from '@/config'

export default function ServiciosPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-12 text-center">
                    <h1 className="mb-4 text-4xl font-bold text-gray-900 lg:text-5xl">
                        Nuestros Servicios
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-gray-600">
                        Soluciones completas para la compra, venta y financiamiento de tu vehículo 4x4
                    </p>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="financiamiento" className="mx-auto max-w-6xl">
                    <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
                        <TabsTrigger value="financiamiento">Financiamiento</TabsTrigger>
                        <TabsTrigger value="consignacion">Consignación</TabsTrigger>
                        <TabsTrigger value="contacto">Contacto</TabsTrigger>
                    </TabsList>

                    {/* Financiamiento Tab */}
                    <TabsContent value="financiamiento" className="mt-8 space-y-8">
                        {/* Benefits Section */}
                        <div className="rounded-lg bg-white p-8 shadow">
                            <h2 className="mb-6 text-2xl font-bold text-gray-900">
                                Financia Tu Vehículo Sin Complicaciones
                            </h2>
                            <div className="grid gap-6 md:grid-cols-3">
                                <div className="flex gap-4">
                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100">
                                        <ClockIcon className="h-6 w-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <h3 className="mb-1 font-semibold text-gray-900">Aprobación Inmediata</h3>
                                        <p className="text-sm text-gray-600">
                                            Respuesta en minutos, sin largas esperas
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100">
                                        <ShieldCheckIcon className="h-6 w-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <h3 className="mb-1 font-semibold text-gray-900">Sin Deuda Registrada</h3>
                                        <p className="text-sm text-gray-600">
                                            No queda registrada en el sistema financiero
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100">
                                        <CurrencyDollarIcon className="h-6 w-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <h3 className="mb-1 font-semibold text-gray-900">Tasas Competitivas</h3>
                                        <p className="text-sm text-gray-600">
                                            Las mejores condiciones del mercado
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Calculator */}
                        <div id="financiamiento">
                            <LoanCalculator />
                        </div>

                        {/* Form */}
                        <FinancingForm />
                    </TabsContent>

                    {/* Consignación Tab */}
                    <TabsContent value="consignacion" className="mt-8 space-y-8">
                        <div className="rounded-lg bg-white p-8 shadow">
                            <h2 className="mb-6 text-2xl font-bold text-gray-900">
                                Vende Tu Vehículo con Nosotros
                            </h2>
                            <div className="mb-8 grid gap-6 md:grid-cols-2">
                                <div className="flex gap-4">
                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100">
                                        <TruckIcon className="h-6 w-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <h3 className="mb-1 font-semibold text-gray-900">Proceso Simple</h3>
                                        <p className="text-sm text-gray-600">
                                            Solo déjanos tu vehículo y nosotros nos encargamos de todo
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100">
                                        <ShieldCheckIcon className="h-6 w-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <h3 className="mb-1 font-semibold text-gray-900">Tasación Justa</h3>
                                        <p className="text-sm text-gray-600">
                                            Evaluación transparente basada en el mercado actual
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-lg bg-primary-50 p-6">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                    ¿Cómo Funciona?
                                </h3>
                                <ol className="space-y-3">
                                    <li className="flex gap-3">
                                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-semibold text-white">
                                            1
                                        </span>
                                        <span className="text-gray-700">
                                            Completa el formulario con los datos de tu vehículo
                                        </span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-semibold text-white">
                                            2
                                        </span>
                                        <span className="text-gray-700">
                                            Nuestro equipo te contacta para coordinar una evaluación
                                        </span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-semibold text-white">
                                            3
                                        </span>
                                        <span className="text-gray-700">
                                            Publicamos tu vehículo y gestionamos la venta
                                        </span>
                                    </li>
                                </ol>
                            </div>
                        </div>

                        <ConsignmentForm />
                    </TabsContent>

                    {/* Contacto Tab */}
                    <TabsContent value="contacto" className="mt-8">
                        <div className="grid gap-8 md:grid-cols-2">
                            <ContactForm />

                            <div className="space-y-6">
                                <div className="rounded-lg bg-white p-6 shadow">
                                    <h3 className="mb-4 text-xl font-semibold text-gray-900">
                                        Información de Contacto
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="mb-1 text-sm font-medium text-gray-600">Dirección</p>
                                            <p className="text-gray-900">
                                                Av. Las Condes 12461, Local 4A
                                                <br />
                                                Las Condes, Santiago - Chile
                                            </p>
                                        </div>
                                        <div>
                                            <p className="mb-1 text-sm font-medium text-gray-600">Teléfonos</p>
                                            <p className="text-gray-900">
                                                (+56 9) 7214-9979
                                                <br />
                                                (+56 2) 4367-0362
                                            </p>
                                        </div>
                                        <div>
                                            <p className="mb-1 text-sm font-medium text-gray-600">Horarios</p>
                                            <p className="text-gray-900">
                                                Lunes a Viernes: 09:30 - 18:00
                                                <br />
                                                Sábado: Previa Cita
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-lg bg-primary-50 p-6">
                                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                                        ¿Prefieres WhatsApp?
                                    </h3>
                                    <p className="mb-4 text-sm text-gray-600">
                                        Contáctanos directamente y te responderemos a la brevedad
                                    </p>
                                    <a
                                        href={`https://wa.me/${siteConfig.contact.whatsapp}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#20BA5A]"
                                    >
                                        Abrir WhatsApp
                                    </a>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
