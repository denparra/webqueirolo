import { getWhatsAppUrl } from '@/lib/utils'
import config from '@/config'

/**
 * Captura de leads — canal TRANSITORIO vía WhatsApp.
 *
 * Hoy los formularios entregan cada lead abriendo WhatsApp con el mensaje
 * pre-cargado (deep link `wa.me`, client-side, sin backend). Es la solución
 * inmediata para el lanzamiento; garantiza que la solicitud llegue al negocio.
 *
 * MIGRACIÓN FUTURA (n8n → correo):
 * Cuando la integración server-side esté lista, los formularios deben dejar de
 * llamar a `getLeadWhatsAppUrl` y volver a hacer `POST /api/submit-lead`, que ya
 * está preparado para reenviar el lead a `N8N_LEAD_WEBHOOK_URL`. El tipo `Lead`
 * de este archivo es el mismo contrato que valida ese endpoint, así que sirve
 * para ambos canales sin reescribir el formateo.
 *
 * Ver: docs/implementation/IMP-20260606-001/IMP.md y docs/logbook.md (LOG-20260606-001).
 */

export type LeadType = 'contacto' | 'financiamiento' | 'consignacion'

/** Datos de un vehículo asociado a un lead (todos opcionales según el origen). */
export interface LeadVehicle {
    brand?: string
    model?: string
    year?: string
    price?: string
    km?: string
}

/** Datos de crédito de un lead de financiamiento. */
export interface LeadFinancing {
    downPayment?: string
    term?: string
}

/**
 * Contrato común de un lead. Los formularios completan los campos que aplican
 * a su contexto; el resto queda undefined. Es el mismo shape que acepta
 * `/api/submit-lead` para el canal futuro.
 */
export interface Lead {
    type: LeadType
    name: string
    email: string
    phone: string
    rut?: string
    comuna?: string
    vehicle?: LeadVehicle
    financing?: LeadFinancing
    message?: string
    /** Slug del vehículo si el lead nace desde una ficha. */
    vehicleSlug?: string
}

const TYPE_LABEL: Record<LeadType, string> = {
    contacto: 'Consulta de contacto',
    financiamiento: 'Solicitud de financiamiento',
    consignacion: 'Solicitud de consignación',
}

/**
 * Formatea un lead como texto legible para WhatsApp, incluyendo TODOS los campos
 * presentes (resuelve la pérdida de RUT/comuna del flujo anterior).
 */
export function formatLeadMessage(lead: Lead): string {
    const lines: string[] = [`*${TYPE_LABEL[lead.type]} — ${config.company.name}*`, '']

    lines.push(`*Nombre:* ${lead.name}`)
    lines.push(`*Teléfono:* ${lead.phone}`)
    lines.push(`*Email:* ${lead.email}`)
    if (lead.rut) lines.push(`*RUT:* ${lead.rut}`)
    if (lead.comuna) lines.push(`*Comuna:* ${lead.comuna}`)

    const v = lead.vehicle
    if (v && (v.brand || v.model || v.year || v.price || v.km)) {
        lines.push('', '*Vehículo:*')
        const nameLine = [v.brand, v.model].filter(Boolean).join(' ')
        if (nameLine) lines.push(`• ${nameLine}`)
        if (v.year) lines.push(`• Año: ${v.year}`)
        if (v.km) lines.push(`• Kilometraje: ${v.km} km`)
        if (v.price) lines.push(`• Precio: $${v.price}`)
    }

    const f = lead.financing
    if (f && (f.downPayment || f.term)) {
        lines.push('', '*Crédito:*')
        if (f.downPayment) lines.push(`• Pie: $${f.downPayment}`)
        if (f.term) lines.push(`• Plazo: ${f.term} meses`)
    }

    if (lead.message && lead.message.trim()) {
        lines.push('', `*Mensaje:* ${lead.message.trim()}`)
    }

    return lines.join('\n')
}

/**
 * Construye la URL de WhatsApp (`wa.me`) con el lead pre-cargado, apuntando al
 * número del negocio. Reusa `getWhatsAppUrl` (limpia el teléfono y codifica el texto).
 */
export function getLeadWhatsAppUrl(lead: Lead): string {
    return getWhatsAppUrl(config.contact.whatsapp, formatLeadMessage(lead))
}
