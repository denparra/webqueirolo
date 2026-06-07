'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getLeadWhatsAppUrl } from '@/lib/leads'

export function FinancingForm() {
    const [formData, setFormData] = useState({
        name: '',
        rut: '',
        email: '',
        phone: '',
        comuna: '',
        vehicleBrand: '',
        vehicleModel: '',
        vehicleYear: '',
        vehiclePrice: '',
        downPayment: '',
        term: '48',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    // Canal transitorio: la solicitud se entrega vía WhatsApp con todos los datos
    // (incluidos RUT y comuna). Migración futura a n8n documentada en lib/leads.ts.
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        const url = getLeadWhatsAppUrl({
            type: 'financiamiento',
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            rut: formData.rut,
            comuna: formData.comuna,
            vehicle: {
                brand: formData.vehicleBrand,
                model: formData.vehicleModel,
                year: formData.vehicleYear,
                price: formData.vehiclePrice,
            },
            financing: {
                downPayment: formData.downPayment,
                term: formData.term,
            },
        })
        window.open(url, '_blank', 'noopener,noreferrer')

        setIsSubmitting(false)
        setIsSubmitted(true)

        setTimeout(() => {
            setIsSubmitted(false)
            setFormData({
                name: '',
                rut: '',
                email: '',
                phone: '',
                comuna: '',
                vehicleBrand: '',
                vehicleModel: '',
                vehicleYear: '',
                vehiclePrice: '',
                downPayment: '',
                term: '48',
            })
        }, 3000)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle id="financing-form-title">Solicitar Evaluación</CardTitle>
                <CardDescription id="financing-form-desc">
                    Completa el formulario con tus datos.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                    aria-labelledby="financing-form-title"
                    aria-describedby="financing-form-desc"
                    noValidate
                >
                    {/* Status announcements for screen readers */}
                    <div
                        role="status"
                        aria-live="polite"
                        aria-atomic="true"
                        className="sr-only"
                    >
                        {isSubmitting && 'Abriendo WhatsApp...'}
                        {isSubmitted && 'Te abrimos WhatsApp con tu solicitud. Presiona enviar en el chat para que la evaluemos.'}
                    </div>

                    {/* Personal Data */}
                    <fieldset>
                        <legend className="mb-4 text-lg font-semibold text-gray-900">Datos Personales</legend>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label htmlFor="financing-name" className="mb-2 block text-sm font-medium text-gray-700">
                                    Nombre completo <span aria-hidden="true" className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="financing-name"
                                    name="name"
                                    type="text"
                                    required
                                    aria-required="true"
                                    autoComplete="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Ej: Juan Pérez"
                                />
                            </div>
                            <div>
                                <label htmlFor="financing-rut" className="mb-2 block text-sm font-medium text-gray-700">
                                    RUT <span aria-hidden="true" className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="financing-rut"
                                    name="rut"
                                    type="text"
                                    required
                                    aria-required="true"
                                    inputMode="numeric"
                                    value={formData.rut}
                                    onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
                                    placeholder="12.345.678-9"
                                />
                            </div>
                            <div>
                                <label htmlFor="financing-email" className="mb-2 block text-sm font-medium text-gray-700">
                                    Correo electrónico <span aria-hidden="true" className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="financing-email"
                                    name="email"
                                    type="email"
                                    required
                                    aria-required="true"
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="tucorreo@ejemplo.cl"
                                />
                            </div>
                            <div>
                                <label htmlFor="financing-phone" className="mb-2 block text-sm font-medium text-gray-700">
                                    Teléfono <span aria-hidden="true" className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="financing-phone"
                                    name="phone"
                                    type="tel"
                                    required
                                    aria-required="true"
                                    autoComplete="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+56 9 1234 5678"
                                />
                            </div>
                            <div>
                                <label htmlFor="financing-comuna" className="mb-2 block text-sm font-medium text-gray-700">
                                    Comuna <span aria-hidden="true" className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="financing-comuna"
                                    name="comuna"
                                    type="text"
                                    required
                                    aria-required="true"
                                    autoComplete="address-level2"
                                    value={formData.comuna}
                                    onChange={(e) => setFormData({ ...formData, comuna: e.target.value })}
                                    placeholder="Ej: Las Condes"
                                />
                            </div>
                        </div>
                    </fieldset>

                    {/* Vehicle Data */}
                    <fieldset>
                        <legend className="mb-4 text-lg font-semibold text-gray-900">Datos del Vehículo</legend>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label htmlFor="financing-vehicleBrand" className="mb-2 block text-sm font-medium text-gray-700">
                                    Marca
                                </label>
                                <Input
                                    id="financing-vehicleBrand"
                                    name="vehicleBrand"
                                    type="text"
                                    value={formData.vehicleBrand}
                                    onChange={(e) => setFormData({ ...formData, vehicleBrand: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="financing-vehicleModel" className="mb-2 block text-sm font-medium text-gray-700">
                                    Modelo
                                </label>
                                <Input
                                    id="financing-vehicleModel"
                                    name="vehicleModel"
                                    type="text"
                                    value={formData.vehicleModel}
                                    onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="financing-vehicleYear" className="mb-2 block text-sm font-medium text-gray-700">
                                    Año
                                </label>
                                <Input
                                    id="financing-vehicleYear"
                                    name="vehicleYear"
                                    type="number"
                                    inputMode="numeric"
                                    value={formData.vehicleYear}
                                    onChange={(e) => setFormData({ ...formData, vehicleYear: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="financing-vehiclePrice" className="mb-2 block text-sm font-medium text-gray-700">
                                    Precio
                                </label>
                                <Input
                                    id="financing-vehiclePrice"
                                    name="vehiclePrice"
                                    type="number"
                                    inputMode="numeric"
                                    value={formData.vehiclePrice}
                                    onChange={(e) => setFormData({ ...formData, vehiclePrice: e.target.value })}
                                />
                            </div>
                        </div>
                    </fieldset>

                    {/* Credit Data */}
                    <fieldset>
                        <legend className="mb-4 text-lg font-semibold text-gray-900">Datos del Crédito</legend>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label htmlFor="financing-downPayment" className="mb-2 block text-sm font-medium text-gray-700">
                                    Pie (CLP) <span aria-hidden="true" className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="financing-downPayment"
                                    name="downPayment"
                                    type="number"
                                    inputMode="numeric"
                                    required
                                    aria-required="true"
                                    value={formData.downPayment}
                                    onChange={(e) => setFormData({ ...formData, downPayment: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="financing-term" className="mb-2 block text-sm font-medium text-gray-700">
                                    Plazo (meses) <span aria-hidden="true" className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="financing-term"
                                    name="term"
                                    type="number"
                                    inputMode="numeric"
                                    required
                                    aria-required="true"
                                    value={formData.term}
                                    onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                                />
                            </div>
                        </div>
                    </fieldset>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting || isSubmitted}
                        aria-disabled={isSubmitting || isSubmitted}
                    >
                        {isSubmitting ? 'Abriendo WhatsApp...' : isSubmitted ? '¡Abrimos WhatsApp!' : 'Enviar por WhatsApp'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
