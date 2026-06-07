'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getLeadWhatsAppUrl } from '@/lib/leads'

export function ConsignmentForm() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        brand: '',
        model: '',
        year: '',
        km: '',
        price: '',
        message: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    // Canal transitorio: la solicitud se entrega vía WhatsApp con todos los datos
    // del vehículo. Migración futura a n8n documentada en lib/leads.ts.
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        const url = getLeadWhatsAppUrl({
            type: 'consignacion',
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            vehicle: {
                brand: formData.brand,
                model: formData.model,
                year: formData.year,
                km: formData.km,
                price: formData.price,
            },
            message: formData.message,
        })
        window.open(url, '_blank', 'noopener,noreferrer')

        setIsSubmitting(false)
        setIsSubmitted(true)

        setTimeout(() => {
            setIsSubmitted(false)
            setFormData({
                name: '',
                phone: '',
                email: '',
                brand: '',
                model: '',
                year: '',
                km: '',
                price: '',
                message: '',
            })
        }, 3000)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle id="consignment-form-title">Solicitar Evaluación para Consignación</CardTitle>
                <CardDescription id="consignment-form-desc">
                    Déjanos los datos de tu vehículo y te contactaremos para coordinar la evaluación.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                    aria-labelledby="consignment-form-title"
                    aria-describedby="consignment-form-desc"
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
                        {isSubmitted && 'Te abrimos WhatsApp con los datos de tu vehículo. Presiona enviar en el chat para coordinar la evaluación.'}
                    </div>

                    {/* Contact Information */}
                    <fieldset>
                        <legend className="sr-only">Información de contacto</legend>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label htmlFor="consignment-name" className="mb-2 block text-sm font-medium text-gray-700">
                                    Nombre completo <span aria-hidden="true" className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="consignment-name"
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
                                <label htmlFor="consignment-phone" className="mb-2 block text-sm font-medium text-gray-700">
                                    Teléfono <span aria-hidden="true" className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="consignment-phone"
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
                        </div>
                    </fieldset>

                    <div>
                        <label htmlFor="consignment-email" className="mb-2 block text-sm font-medium text-gray-700">
                            Correo electrónico <span aria-hidden="true" className="text-red-500">*</span>
                        </label>
                        <Input
                            id="consignment-email"
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

                    {/* Vehicle Information */}
                    <fieldset>
                        <legend className="sr-only">Información del vehículo</legend>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label htmlFor="consignment-brand" className="mb-2 block text-sm font-medium text-gray-700">
                                    Marca <span aria-hidden="true" className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="consignment-brand"
                                    name="brand"
                                    type="text"
                                    required
                                    aria-required="true"
                                    value={formData.brand}
                                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="consignment-model" className="mb-2 block text-sm font-medium text-gray-700">
                                    Modelo <span aria-hidden="true" className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="consignment-model"
                                    name="model"
                                    type="text"
                                    required
                                    aria-required="true"
                                    value={formData.model}
                                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                />
                            </div>
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend className="sr-only">Detalles del vehículo</legend>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div>
                                <label htmlFor="consignment-year" className="mb-2 block text-sm font-medium text-gray-700">
                                    Año <span aria-hidden="true" className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="consignment-year"
                                    name="year"
                                    type="number"
                                    inputMode="numeric"
                                    required
                                    aria-required="true"
                                    value={formData.year}
                                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="consignment-km" className="mb-2 block text-sm font-medium text-gray-700">
                                    Kilometraje <span aria-hidden="true" className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="consignment-km"
                                    name="km"
                                    type="number"
                                    inputMode="numeric"
                                    required
                                    aria-required="true"
                                    value={formData.km}
                                    onChange={(e) => setFormData({ ...formData, km: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="consignment-price" className="mb-2 block text-sm font-medium text-gray-700">
                                    Precio Esperado <span aria-hidden="true" className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="consignment-price"
                                    name="price"
                                    type="number"
                                    inputMode="numeric"
                                    required
                                    aria-required="true"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                        </div>
                    </fieldset>

                    <div>
                        <label htmlFor="consignment-message" className="mb-2 block text-sm font-medium text-gray-700">
                            Mensaje
                        </label>
                        <textarea
                            id="consignment-message"
                            name="message"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder="¿En qué podemos ayudarte?"
                            rows={3}
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

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
