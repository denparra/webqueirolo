import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { cleanEnvVar } from '@/sanity/env-utils'
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_TTL_SECONDS,
  createAdminSessionToken,
  verifyAdminSessionToken,
} from './session'

export interface AdminAuthConfig {
  username: string
  passwordHash: string
  sessionSecret: string
  isConfigured: boolean
}

function getAdminAuthConfig(): AdminAuthConfig {
  const username = cleanEnvVar(process.env.ADMIN_USERNAME)
  const passwordHash = cleanEnvVar(process.env.ADMIN_PASSWORD_HASH)
  const sessionSecret = cleanEnvVar(process.env.ADMIN_SESSION_SECRET)

  return {
    username,
    passwordHash,
    sessionSecret,
    isConfigured: Boolean(username && passwordHash && sessionSecret),
  }
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false

  let mismatch = 0
  for (let index = 0; index < a.length; index += 1) {
    mismatch |= a.charCodeAt(index) ^ b.charCodeAt(index)
  }

  return mismatch === 0
}

export function getAdminConfigStatus() {
  const auth = getAdminAuthConfig()
  return {
    authConfigured: auth.isConfigured,
    writeTokenConfigured: Boolean(cleanEnvVar(process.env.SANITY_API_WRITE_TOKEN)),
  }
}

export async function validateAdminCredentials(username: string, password: string): Promise<boolean> {
  const config = getAdminAuthConfig()
  if (!config.isConfigured) return false
  if (!timingSafeEqual(username, config.username)) return false

  const passwordHash = await sha256Hex(password)
  return timingSafeEqual(passwordHash, config.passwordHash)
}

export async function setAdminSession(username: string) {
  const config = getAdminAuthConfig()
  if (!config.isConfigured) {
    throw new Error('Admin auth no está configurado.')
  }

  const token = await createAdminSessionToken(username, config.sessionSecret)
  cookies().set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: ADMIN_SESSION_TTL_SECONDS,
  })
}

export function clearAdminSession() {
  cookies().delete(ADMIN_SESSION_COOKIE)
}

export async function getAdminSession() {
  const config = getAdminAuthConfig()
  const token = cookies().get(ADMIN_SESSION_COOKIE)?.value
  return verifyAdminSessionToken(token, config.sessionSecret)
}

export async function requireAdminSession() {
  const session = await getAdminSession()
  if (!session) {
    redirect('/admin/login')
  }
  return session
}
