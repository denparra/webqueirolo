export const ADMIN_SESSION_COOKIE = 'qa_admin_session'
export const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 8

interface AdminSessionPayload {
  sub: string
  exp: number
}

function base64UrlEncode(value: string): string {
  return btoa(value)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

function base64UrlDecode(value: string): string {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=')
  return atob(padded)
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false

  let mismatch = 0
  for (let index = 0; index < a.length; index += 1) {
    mismatch |= a.charCodeAt(index) ^ b.charCodeAt(index)
  }

  return mismatch === 0
}

async function hmacSha256(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message))
  const bytes = Array.from(new Uint8Array(signature))
  return base64UrlEncode(String.fromCharCode(...bytes))
}

export async function createAdminSessionToken(username: string, secret: string): Promise<string> {
  const payload: AdminSessionPayload = {
    sub: username,
    exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_TTL_SECONDS,
  }
  const encodedPayload = base64UrlEncode(JSON.stringify(payload))
  const signature = await hmacSha256(encodedPayload, secret)
  return `${encodedPayload}.${signature}`
}

export async function verifyAdminSessionToken(
  token: string | undefined,
  secret: string
): Promise<AdminSessionPayload | null> {
  if (!token || !secret) return null

  const [encodedPayload, receivedSignature] = token.split('.')
  if (!encodedPayload || !receivedSignature) return null

  const expectedSignature = await hmacSha256(encodedPayload, secret)
  if (!timingSafeEqual(receivedSignature, expectedSignature)) return null

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as AdminSessionPayload
    if (!payload.sub || !payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }
    return payload
  } catch {
    return null
  }
}
