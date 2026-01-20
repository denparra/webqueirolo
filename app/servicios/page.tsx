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
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Servicios - Financiamiento y Consignación - Queirolo Autos',
    description: 'Financiamiento con financieras, consignación de vehículos y recepción en parte de pago. Conoce todos nuestros servicios.',
}

export default function ServiciosPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-12 text-center">
                    <h1 className="mb-4 text-4xl font-bold text-gray-900 lg:text-5xl">
                        Servicios
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-gray-600">
                        Conoce cómo podemos ayudarte
                    </p>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="financiamiento" className="mx-auto max-w-6xl">
                    <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
                        <TabsTrigger value="financiamiento">Financiamiento</TabsTrigger>
                        <TabsTrigger value="consignacion">Consignación</TabsTrigger>
                        <TabsTrigger value="parte-de-pago">Parte de Pago</TabsTrigger>
                    </TabsList>

                    {/* Financiamiento Tab */}
                    <TabsContent value="financiamiento" className="mt-8 space-y-8">
                        {/* Benefits Section */}
                        <div className="rounded-lg bg-white p-8 shadow">
                            <h2 className="mb-6 text-2xl font-bold text-gray-900">
                                Financiamiento con Financieras
                            </h2>
                            <p className="mb-6 text-gray-600">
                                Te ayudamos a encontrar la mejor opción de crédito para tu próximo auto.
                            </p>
                            <div className="grid gap-6 md:grid-cols-3">
                                <div className="flex gap-4">
                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100">
                                        <ClockIcon className="h-6 w-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <h3 className="mb-1 font-semibold text-gray-900">Evaluación Rápida</h3>
                                        <p className="text-sm text-gray-600">
                                            Respuesta en 24 a 48 horas aproximadamente
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100">
                                        <ShieldCheckIcon className="h-6 w-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <h3 className="mb-1 font-semibold text-gray-900">Plazos de 12 a 60 Meses</h3>
                                        <p className="text-sm text-gray-600">
                                            Elige el plazo que mejor se adapte a ti
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100">
                                        <CurrencyDollarIcon className="h-6 w-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <h3 className="mb-1 font-semibold text-gray-900">Pie desde 20%</h3>
                                        <p className="text-sm text-gray-600">
                                            Flexibilidad en el monto inicial
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100">
                                        <TruckIcon className="h-6 w-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <h3 className="mb-1 font-semibold text-gray-900">Casos Especiales</h3>
                                        <p className="text-sm text-gray-600">
                                            Evaluamos cada situación de forma particular
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg bg-primary-50 p-6">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                Pasos
                            </h3>
                            <ol className="space-y-3">
                                <li className="flex gap-3">
                                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-semibold text-white">
                                        1
                                    </span>
                                    <span className="text-gray-700">
                                        Completa el formulario con tus datos
                                    </span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-semibold text-white">
                                        2
                                    </span>
                                    <span className="text-gray-700">
                                        Evaluamos tu perfil con nuestras financieras
                                    </span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-semibold text-white">
                                        3
                                    </span>
                                    <span className="text-gray-700">
                                        Te contactamos con las opciones disponibles
                                    </span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-semibold text-white">
                                        4
                                    </span>
                                    <span className="text-gray-700">
                                        Elige la mejor y retira tu vehículo
                                    </span>
                                </li>
                            </ol>
                            <p className="mt-4 text-sm text-gray-600">
                                El financiamiento está sujeto a evaluación crediticia. Los plazos, tasas y condiciones dependen del perfil del cliente y de la financiera seleccionada.
                            </p>
                        </div>

                        {/* Calculator */}
                        <div id="financiamiento">
                            <LoanCalculator />
                        </div>

                        {/* Form */}
                        <FinancingForm />
                    </TabsContent>

                    {/* Consignación Tab */}
                    <TabsContent value="consignacion" id="consignacion" className="mt-8 space-y-8">
                        <div className="rounded-lg bg-white p-8 shadow">
                            <h2 className="mb-6 text-2xl font-bold text-gray-900">
                                Consignación de Vehículos
                            </h2>
                            <p className="mb-8 text-gray-600">
                                Vendemos tu auto por ti, sin que tengas que preocuparte por nada.
                            </p>
                            <div className="mb-8 grid gap-6 md:grid-cols-2">
                                <div className="flex gap-4">
                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100">
                                        <TruckIcon className="h-6 w-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <h3 className="mb-1 font-semibold text-gray-900">Sin Prendas</h3>
                                        <p className="text-sm text-gray-600">
                                            Solo recibimos vehículos sin gravámenes
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100">
                                        <ShieldCheckIcon className="h-6 w-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <h3 className="mb-1 font-semibold text-gray-900">Retiro Cuando Desees</h3>
                                        <p className="text-sm text-gray-600">
                                            Tu auto es tuyo hasta que se venda
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100">
                                        <ClockIcon className="h-6 w-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <h3 className="mb-1 font-semibold text-gray-900">Evaluación Personalizada</h3>
                                        <p className="text-sm text-gray-600">
                                            Cada caso se analiza individualmente
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100">
                                        <CurrencyDollarIcon className="h-6 w-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <h3 className="mb-1 font-semibold text-gray-900">Gestión Completa</h3>
                                        <p className="text-sm text-gray-600">
                                            Nos encargamos de todo el proceso de venta
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-lg bg-primary-50 p-6">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                    Requisitos
                                </h3>
                                <ol className="space-y-3">
                                    <li className="flex gap-3">
                                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-semibold text-white">
                                            1
                                        </span>
                                        <span className="text-gray-700">
                                            Vehículo sin prendas ni gravámenes
                                        </span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-semibold text-white">
                                            2
                                        </span>
                                        <span className="text-gray-700">
                                            Documentación al día
                                        </span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-semibold text-white">
                                            3
                                        </span>
                                        <span className="text-gray-700">
                                            Evaluación previa del vehículo
                                        </span>
                                    </li>
                                </ol>
                            </div>
                        </div>

                        <ConsignmentForm />
                    </TabsContent>

                    {/* Parte de Pago Tab */}
                    <TabsContent value="parte-de-pago" id="parte-de-pago" className="mt-8">
                        <div className="grid gap-8 md:grid-cols-2">
                            <ContactForm />

                            <div className="space-y-6">
                                <div className="rounded-lg bg-white p-6 shadow">
                                    <h3 className="mb-4 text-xl font-semibold text-gray-900">
                                        Recibimos tu Auto en Parte de Pago
                                    </h3>
                                    <p className="mb-6 text-gray-600">
                                        ¿Tienes un auto que quieres dar en parte de pago? Lo evaluamos y te entregamos un valor justo.
                                    </p>
                                    <div className="rounded-lg bg-primary-50 p-6">
                                        <h4 className="mb-4 text-lg font-semibold text-gray-900">Proceso</h4>
                                        <ol className="space-y-3">
                                            <li className="flex gap-3">
                                                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-semibold text-white">
                                                    1
                                                </span>
                                                <span className="text-gray-700">
                                                    Traes tu vehículo para evaluación
                                                </span>
                                            </li>
                                            <li className="flex gap-3">
                                                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-semibold text-white">
                                                    2
                                                </span>
                                                <span className="text-gray-700">
                                                    Descontamos cualquier deuda pendiente
                                                </span>
                                            </li>
                                            <li className="flex gap-3">
                                                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-semibold text-white">
                                                    3
                                                </span>
                                                <span className="text-gray-700">
                                                    El saldo restante se aplica a tu nuevo auto
                                                </span>
                                            </li>
                                        </ol>
                                    </div>
                                    <p className="mt-4 text-sm text-gray-600">
                                        Si tu auto tiene deuda, la descontamos del valor y realizamos todos los trámites de transferencia.
                                    </p>
                                </div>

                                <div className="rounded-lg bg-primary-50 p-6">
                                    <a
                                        href={`https://wa.me/${siteConfig.contact.whatsapp}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#20BA5A]"
                                    >
                                        Consultar Evaluación
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
