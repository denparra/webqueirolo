import { notFound } from 'next/navigation'
import { getVehicles, getVehicleBySlug } from '@/lib/vehicles'
import { formatCurrency, formatKilometers, getWhatsAppUrl } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LoanCalculator } from '@/components/forms/LoanCalculator'
import { VehicleDetailGallery } from '@/components/vehicles/VehicleDetailGallery'
import {
    CalendarIcon,
    CogIcon,
    TruckIcon,
    FireIcon,
    UserGroupIcon,
    PaintBrushIcon,
    CheckCircleIcon,
} from '@heroicons/react/24/outline'
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid'
import siteConfig from '@/config'

export async function generateStaticParams() {
    const vehicles = await getVehicles()
    return vehicles.map((vehicle) => ({
        slug: vehicle.slug,
    }))
}

export default async function VehicleDetailPage({ params }: { params: { slug: string } }) {
    const vehicle = await getVehicleBySlug(params.slug)

    if (!vehicle) {
        notFound()
    }

    const whatsappMessage = `Hola, me interesa el ${vehicle.brand} ${vehicle.model} ${vehicle.year}`
    const whatsappUrl = getWhatsAppUrl(siteConfig.contact.whatsapp, whatsappMessage)

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* Breadcrumb */}
                <nav className="mb-6 text-sm text-gray-600">
                    <a href="/vehiculos" className="hover:text-primary-600">
                        Vehículos
                    </a>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900">
                        {vehicle.brand} {vehicle.model}
                    </span>
                </nav>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Gallery */}
                        <VehicleDetailGallery vehicle={vehicle} />

                        {/* Title and Price */}
                        <div className="mb-6 rounded-lg bg-white p-6 shadow">
                            <div className="mb-4 flex items-start justify-between">
                                <div>
                                    <p className="mb-1 text-sm font-medium uppercase text-gray-600">
                                        {vehicle.brand}
                                    </p>
                                    <h1 className="text-3xl font-bold text-gray-900">{vehicle.model}</h1>
                                    <p className="mt-2 text-lg text-gray-600">{vehicle.year}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold text-primary-600">
                                        {formatCurrency(vehicle.price)}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        o desde {formatCurrency(vehicle.monthlyPayment)}/mes
                                    </p>
                                </div>
                            </div>

                            {/* Quick Specs */}
                            <div className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-4 md:grid-cols-4">
                                <div className="flex items-center gap-2">
                                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-xs text-gray-600">Año</p>
                                        <p className="font-semibold text-gray-900">{vehicle.year}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <TruckIcon className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-xs text-gray-600">Kilometraje</p>
                                        <p className="font-semibold text-gray-900">{formatKilometers(vehicle.km)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CogIcon className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-xs text-gray-600">Transmisión</p>
                                        <p className="font-semibold text-gray-900">{vehicle.transmission}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FireIcon className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-xs text-gray-600">Combustible</p>
                                        <p className="font-semibold text-gray-900">{vehicle.fuelType}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs: Specs & Features */}
                        <Tabs defaultValue="specs" className="rounded-lg bg-white shadow">
                            <TabsList className="w-full justify-start rounded-t-lg border-b">
                                <TabsTrigger value="specs">Especificaciones</TabsTrigger>
                                <TabsTrigger value="features">Características</TabsTrigger>
                            </TabsList>

                            <TabsContent value="specs" className="p-6">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="flex items-center gap-3">
                                        <CogIcon className="h-6 w-6 text-primary-600" />
                                        <div>
                                            <p className="text-sm text-gray-600">Motor</p>
                                            <p className="font-semibold text-gray-900">{vehicle.specs.engine}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <FireIcon className="h-6 w-6 text-primary-600" />
                                        <div>
                                            <p className="text-sm text-gray-600">Potencia</p>
                                            <p className="font-semibold text-gray-900">{vehicle.specs.power}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CogIcon className="h-6 w-6 text-primary-600" />
                                        <div>
                                            <p className="text-sm text-gray-600">Torque</p>
                                            <p className="font-semibold text-gray-900">{vehicle.specs.torque}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <TruckIcon className="h-6 w-6 text-primary-600" />
                                        <div>
                                            <p className="text-sm text-gray-600">Tracción</p>
                                            <p className="font-semibold text-gray-900">{vehicle.specs.drivetrain}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <UserGroupIcon className="h-6 w-6 text-primary-600" />
                                        <div>
                                            <p className="text-sm text-gray-600">Asientos</p>
                                            <p className="font-semibold text-gray-900">{vehicle.specs.seating}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <PaintBrushIcon className="h-6 w-6 text-primary-600" />
                                        <div>
                                            <p className="text-sm text-gray-600">Color</p>
                                            <p className="font-semibold text-gray-900">{vehicle.specs.color}</p>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="features" className="p-6">
                                <div className="grid gap-3 md:grid-cols-2">
                                    {vehicle.features && vehicle.features.length > 0 ? (
                                        vehicle.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <CheckCircleIcon className="h-5 w-5 text-green-600" />
                                                <span className="text-gray-900">{feature}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500">No hay características registradas</p>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-4 space-y-6">
                            {/* Contact Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>¿Interesado en este vehículo?</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button variant="secondary" className="w-full border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white" asChild>
                                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                                            <ChatBubbleLeftRightIcon className="mr-2 h-5 w-5" />
                                            Consultar por WhatsApp
                                        </a>
                                    </Button>
                                    <Button variant="outline" className="w-full">
                                        Agendar Visita
                                    </Button>
                                    <Button variant="outline" className="w-full">
                                        Solicitar Financiamiento
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Mini Calculator */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Simula tu Cuota</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="mb-4 text-sm text-gray-600">
                                        Calcula tu cuota mensual aproximada
                                    </p>
                                    <Button variant="secondary" className="w-full" asChild>
                                        <a href="#calculadora">Ver Calculadora Completa</a>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Loan Calculator Section */}
                <div id="calculadora" className="mt-12">
                    <LoanCalculator initialPrice={vehicle.price} />
                </div>
            </div>
        </div>
    )
}
