import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Currency formatter for Chilean Pesos
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Kilometers formatter
export function formatKilometers(km: number): string {
  return new Intl.NumberFormat('es-CL').format(km) + ' km'
}

// Phone formatter for Chilean numbers
export function formatPhone(phone: string): string {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '')

  // Format as +56 9 XXXX XXXX
  if (cleaned.length === 11 && cleaned.startsWith('56')) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 3)} ${cleaned.slice(3, 7)} ${cleaned.slice(7)}`
  }

  // Format as 9 XXXX XXXX
  if (cleaned.length === 9 && cleaned.startsWith('9')) {
    return `${cleaned.slice(0, 1)} ${cleaned.slice(1, 5)} ${cleaned.slice(5)}`
  }

  return phone
}

// Generate WhatsApp URL
export function getWhatsAppUrl(phone: string, message?: string): string {
  const cleanPhone = (() => {
    const trimmed = phone.trim()

    // Support common formats:
    // - E.164: "+569..."
    // - wa.me URLs: "https://wa.me/569..." / "wa.me/569..."
    // - api.whatsapp.com URLs: "https://api.whatsapp.com/send?phone=569..."
    const hasScheme = /^https?:\/\//i.test(trimmed)
    const looksLikeUrl =
      hasScheme || trimmed.startsWith('wa.me/') || trimmed.startsWith('api.whatsapp.com/')

    if (looksLikeUrl) {
      try {
        const url = new URL(hasScheme ? trimmed : `https://${trimmed}`)

        if (url.hostname === 'wa.me') {
          const fromPath = url.pathname.replace(/\D/g, '')
          if (fromPath) return fromPath
        }

        const phoneParam = url.searchParams.get('phone')
        if (phoneParam) {
          const fromParam = phoneParam.replace(/\D/g, '')
          if (fromParam) return fromParam
        }

        const fallback = url.pathname.replace(/\D/g, '')
        if (fallback) return fallback
      } catch {
        // fall through
      }
    }

    return trimmed.replace(/\D/g, '')
  })()

  const encodedMessage = message ? encodeURIComponent(message) : ''
  return `https://wa.me/${cleanPhone}${encodedMessage ? `?text=${encodedMessage}` : ''}`
}

// Generate vehicle slug from brand and model
export function generateSlug(brand: string, model: string, year: number): string {
  const combined = `${brand} ${model} ${year}`
  return combined
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
