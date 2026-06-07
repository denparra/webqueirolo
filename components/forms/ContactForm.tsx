'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getLeadWhatsAppUrl } from '@/lib/leads'

export function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    // Canal transitorio: la solicitud se entrega vía WhatsApp con el mensaje
    // pre-cargado. Migración futura a n8n documentada en lib/leads.ts.
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        const url = getLeadWhatsAppUrl({
            type: 'contacto',
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
        })
        window.open(url, '_blank', 'noopener,noreferrer')

        setIsSubmitting(false)
        setIsSubmitted(true)

        // Reset form after 3 seconds
        setTimeout(() => {
            setIsSubmitted(false)
            setFormData({ name: '', email: '', phone: '', message: '' })
        }, 3000)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle id="contact-form-title">Contáctanos</CardTitle>
                <CardDescription id="contact-form-desc">
                    Déjanos tus datos y te contactaremos pronto.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                    aria-labelledby="contact-form-title"
                    aria-describedby="contact-form-desc"
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
                        {isSubmitted && 'Te abrimos WhatsApp para enviar tu consulta. Presiona enviar en el chat.'}
                    </div>

                    <div>
                        <label htmlFor="contact-name" className="mb-2 block text-sm font-medium text-gray-700">
                            Nombre completo <span aria-hidden="true" className="text-red-500">*</span>
                        </label>
                        <Input
                            id="contact-name"
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
                        <label htmlFor="contact-email" className="mb-2 block text-sm font-medium text-gray-700">
                            Correo electrónico <span aria-hidden="true" className="text-red-500">*</span>
                        </label>
                        <Input
                            id="contact-email"
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
                        <label htmlFor="contact-phone" className="mb-2 block text-sm font-medium text-gray-700">
                            Teléfono <span aria-hidden="true" className="text-red-500">*</span>
                        </label>
                        <Input
                            id="contact-phone"
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
                        <label htmlFor="contact-message" className="mb-2 block text-sm font-medium text-gray-700">
                            Mensaje <span aria-hidden="true" className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="contact-message"
                            name="message"
                            required
                            aria-required="true"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder="¿En qué podemos ayudarte?"
                            rows={4}
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
