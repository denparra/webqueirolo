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

// Validation schema
const leadSchema = z.object({
    name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres').max(100),
    email: z.string().email('Email inválido'),
    phone: z.string().min(8, 'Teléfono inválido').max(20),
    message: z.string().min(10, 'Mensaje debe tener al menos 10 caracteres').max(1000),
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

        // Log the lead (in production, save to database or send to CRM)
        console.log('[submit-lead] New lead received:', {
            name: validatedData.name,
            email: validatedData.email,
            phone: validatedData.phone,
            vehicleSlug: validatedData.vehicleSlug,
            timestamp: new Date().toISOString(),
            ip,
        })

        // TODO: In production, integrate with:
        // - Sanity CMS (create a 'lead' document)
        // - Email service (SendGrid, Resend, etc.)
        // - CRM (HubSpot, Salesforce, etc.)
        // - Webhook (n8n, Zapier, etc.)

        // For now, just log and return success
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
