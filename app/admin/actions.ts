'use server'

import { redirect } from 'next/navigation'
import { clearAdminSession, setAdminSession, validateAdminCredentials } from '@/lib/admin/auth'

export async function loginAction(formData: FormData) {
  const username = String(formData.get('username') || '')
  const password = String(formData.get('password') || '')
  const next = String(formData.get('next') || '/admin/vehiculos')

  const valid = await validateAdminCredentials(username, password)
  if (!valid) {
    redirect('/admin/login?error=credenciales')
  }

  await setAdminSession(username)
  redirect(next.startsWith('/admin') ? next : '/admin/vehiculos')
}

export async function logoutAction() {
  clearAdminSession()
  redirect('/admin/login')
}
