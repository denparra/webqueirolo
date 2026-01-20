'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const response = await fetch('/api/submit-lead', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Error al enviar el formulario')
            }

            setIsSubmitting(false)
            setIsSubmitted(true)

            // Reset form after 3 seconds
            setTimeout(() => {
                setIsSubmitted(false)
                setFormData({ name: '', email: '', phone: '', message: '' })
            }, 3000)
        } catch (error) {
            console.error('Error submitting form:', error)
            setIsSubmitting(false)
            // Error handling UI could be added here
            alert('Hubo un error al enviar el mensaje. Por favor intenta nuevamente.')
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle id="contact-form-title">Contáctanos</CardTitle>
                <CardDescription id="contact-form-desc">
                    Déjanos tus datos y te contactaremos a la brevedad
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
                        {isSubmitting && 'Enviando formulario, por favor espere.'}
                        {isSubmitted && 'Formulario enviado exitosamente. Gracias por contactarnos.'}
                    </div>

                    <div>
                        <label htmlFor="contact-name" className="mb-2 block text-sm font-medium text-gray-700">
                            Nombre Completo <span aria-hidden="true" className="text-red-500">*</span>
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
                            placeholder="Juan Pérez"
                        />
                    </div>

                    <div>
                        <label htmlFor="contact-email" className="mb-2 block text-sm font-medium text-gray-700">
                            Email <span aria-hidden="true" className="text-red-500">*</span>
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
                            placeholder="juan@ejemplo.cl"
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
                        {isSubmitting ? 'Enviando...' : isSubmitted ? '¡Enviado!' : 'Enviar Mensaje'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
