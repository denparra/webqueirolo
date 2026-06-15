import type { Metadata } from 'next'
import { loginAction } from '../actions'
import { getAdminConfigStatus } from '@/lib/admin/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export const metadata: Metadata = {
  title: 'Admin | Queirolo Autos',
  robots: { index: false, follow: false },
}

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { error?: string; next?: string }
}) {
  const config = getAdminConfigStatus()
  const hasError = searchParams.error === 'credenciales'

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-950 px-4 py-12">
      <Card className="w-full max-w-md border-gray-800 bg-white">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Queirolo Autos</CardTitle>
          <CardDescription>
            Acceso privado para gestionar el inventario de vehículos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!config.authConfigured && (
            <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              Falta configurar <code>ADMIN_USERNAME</code>, <code>ADMIN_PASSWORD_HASH</code> y{' '}
              <code>ADMIN_SESSION_SECRET</code>.
            </div>
          )}

          {hasError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              Credenciales inválidas. Revisa usuario y contraseña.
            </div>
          )}

          <form action={loginAction} className="space-y-4">
            <input type="hidden" name="next" value={searchParams.next || '/admin/vehiculos'} />
            <div>
              <label htmlFor="username" className="mb-2 block text-sm font-medium text-gray-700">
                Usuario
              </label>
              <Input id="username" name="username" autoComplete="username" required />
            </div>
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={!config.authConfigured}>
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
