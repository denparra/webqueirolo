import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Rate limiting store (in-memory, simple implementation)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Clean up old entries every 5 minutes
setInterval(() => {
    const now = Date.now()
    for (const [key, value] of rateLimitStore.entries()) {
        if (now > value.resetTime) {
            rateLimitStore.delete(key)
        }
    }
}, 5 * 60 * 1000)

// Rate limit: 5 requests per 15 minutes per IP
function checkRateLimit(ip: string): boolean {
    const now = Date.now()
    const limit = 5
    const windowMs = 15 * 60 * 1000 // 15 minutes

    const record = rateLimitStore.get(ip)

    if (!record || now > record.resetTime) {
        rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs })
        return true
    }

    if (record.count >= limit) {
        return false
    }

    record.count++
    return true
}

// Validation schema — refleja el contrato `Lead` de `lib/leads.ts` para que el
// canal futuro (n8n) capture TODOS los campos (incluidos RUT y comuna).
const leadSchema = z.object({
    type: z.enum(['contacto', 'financiamiento', 'consignacion']).optional(),
    name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres').max(100),
    email: z.string().email('Email inválido'),
    phone: z.string().min(8, 'Teléfono inválido').max(20),
    rut: z.string().max(20).optional(),
    comuna: z.string().max(100).optional(),
    vehicle: z
        .object({
            brand: z.string().max(60).optional(),
            model: z.string().max(60).optional(),
            year: z.string().max(10).optional(),
            price: z.string().max(20).optional(),
            km: z.string().max(20).optional(),
        })
        .optional(),
    financing: z
        .object({
            downPayment: z.string().max(20).optional(),
            term: z.string().max(10).optional(),
        })
        .optional(),
    message: z.string().max(2000).optional(),
    vehicleSlug: z.string().optional(),
    honeypot: z.string().optional(), // Anti-spam honeypot field
})

export async function POST(request: NextRequest) {
    try {
        // Get client IP for rate limiting
        const ip = request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            'unknown'

        // Check rate limit
        if (!checkRateLimit(ip)) {
            return NextResponse.json(
                { error: 'Demasiadas solicitudes. Por favor intenta más tarde.' },
                { status: 429 }
            )
        }

        // Parse and validate request body
        const body = await request.json()

        // Honeypot check (if filled, it's likely a bot)
        if (body.honeypot && body.honeypot.length > 0) {
            console.log('[submit-lead] Honeypot triggered, likely spam')
            // Return success to not alert the bot
            return NextResponse.json({ success: true })
        }

        // Validate data
        const validatedData = leadSchema.parse(body)

        // Entrega del lead.
        //
        // CANAL ACTIVO HOY: WhatsApp (client-side, ver lib/leads.ts). Este endpoint
        // NO es el canal de entrega en producción todavía — queda PREPARADO para la
        // integración futura con n8n.
        //
        // MIGRACIÓN A n8n (solo configuración, sin reescribir código):
        //   1. Setear la env var `N8N_LEAD_WEBHOOK_URL` con la URL del webhook.
        //   2. Volver los formularios a `POST /api/submit-lead` (en lugar de abrir WhatsApp).
        // Con la env var presente, cada lead se reenvía al webhook; si falla, no se
        // rompe la respuesta al usuario. Sin la env var, se registra en logs como respaldo.
        const webhookUrl = process.env.N8N_LEAD_WEBHOOK_URL

        if (webhookUrl) {
            try {
                await fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...validatedData,
                        receivedAt: new Date().toISOString(),
                        ip,
                    }),
                })
            } catch (webhookError) {
                // Un fallo del webhook no debe impactar la experiencia del usuario.
                console.error('[submit-lead] Error reenviando a n8n:', webhookError)
            }
        } else {
            console.log('[submit-lead] Lead recibido (sin webhook configurado):', {
                type: validatedData.type,
                name: validatedData.name,
                email: validatedData.email,
                phone: validatedData.phone,
                vehicleSlug: validatedData.vehicleSlug,
                timestamp: new Date().toISOString(),
                ip,
            })
        }

        return NextResponse.json({
            success: true,
            message: 'Gracias por tu consulta. Te contactaremos pronto.',
        })

    } catch (error) {
        console.error('[submit-lead] Error processing lead:', error)

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Datos inválidos', details: error.errors },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: 'Error al procesar la solicitud' },
            { status: 500 }
        )
    }
}
