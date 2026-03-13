# Guia de Implementacion: Sistema de Reservas / Agendar Visita

**Proyecto**: Queirolo Autos - Next.js 14 + Sanity CMS
**Fecha**: Marzo 2026
**Feature**: Zona de reserva para que clientes agenden visitas a autos especificos

---

## 1. Vision General del Feature

El cliente quiere agendar una visita presencial para ver un auto especifico del catalogo. La reserva debe:

- Estar vinculada a un vehiculo del catalogo
- Capturar datos del cliente (nombre, telefono, email)
- Elegir fecha y horario disponible (segun horario de negocio)
- Notificar al equipo de ventas (email y/o WhatsApp)
- Confirmar al cliente su reserva

**Horario disponible** (segun `config.ts`):
- Lunes a Viernes: 09:30 - 18:00
- Sabado: Con cita previa

---

## 2. Analisis de Opciones

### Opcion A - Cal.com Embed (recomendado para comenzar rapido)

| Aspecto | Detalle |
|---------|---------|
| Tiempo | 1-2 dias |
| Costo | Gratis (tier basico) |
| Complejidad | Baja |
| Control | Limitado (UI de Cal.com) |
| Emails | Automaticos incluidos |

**Ideal si**: Quieres lanzar rapido y validar que los clientes usan el sistema.

### Opcion B - Formulario Custom + API Route (recomendado largo plazo)

| Aspecto | Detalle |
|---------|---------|
| Tiempo | 3-5 dias |
| Costo | ~0 USD (Resend tiene tier gratis) |
| Complejidad | Media |
| Control | Total (UI propia, datos propios) |
| Emails | Configurados via Resend |

**Ideal si**: Quieres que la experiencia sea consistente con el sitio y tener control total.

### Opcion C - Full Custom con Sanity + Panel Admin (largo plazo)

| Aspecto | Detalle |
|---------|---------|
| Tiempo | 1-2 semanas |
| Costo | 0 (dentro de tu Sanity existente) |
| Complejidad | Alta |
| Control | Total |
| Emails | Configurados |

**Ideal si**: Quieres un panel de administracion de reservas dentro de Sanity Studio.

---

## 3. Recomendacion

**Fase 1**: Implementar Opcion B (formulario custom + API route + Resend para emails).
**Fase 2**: Almacenar reservas en Sanity (Opcion C) para tener historial y admin panel.

Esta guia cubre ambas fases con detalle.

---

## 4. Arquitectura del Sistema (Opcion B + C)

```
Cliente ve vehiculo (/vehiculos/[slug])
    |
    v
Boton "Agendar Visita" abre Modal/Sheet
    |
    v
Formulario de Reserva
  - Nombre completo *
  - Telefono *
  - Email *
  - Fecha deseada (DatePicker) *
  - Horario deseado (Select) *
  - Comentario (opcional)
  - Auto pre-seleccionado (readonly)
    |
    v
POST /api/agendar-visita
    |
    +----> Guardar en Sanity (coleccion "reserva")
    |
    +----> Enviar email al vendedor via Resend
    |
    +----> Enviar email de confirmacion al cliente via Resend
    |
    +----> (Opcional) Mensaje WhatsApp via WhatsApp API
    |
    v
Respuesta al cliente: "Tu visita fue agendada! Te contactaremos para confirmar."
```

---

## 5. Implementacion Paso a Paso

### Fase 1: Formulario + API Route + Emails

#### 5.1 Instalar dependencias

```bash
npm install resend @hookform/resolvers zod react-hook-form
```

- `resend` - Servicio de emails (tier gratis: 3000 emails/mes)
- `react-hook-form` - Ya deberia estar, verificar
- `zod` - Validacion de schema

#### 5.2 Variables de entorno

Agregar en `.env.local`:

```env
# Resend (obtener en resend.com - gratis)
RESEND_API_KEY=re_xxxxxxxxxxxx

# Email del vendedor/admin que recibe notificaciones
ADMIN_EMAIL=ventas@queiroloautos.cl

# Email desde el que se envian los correos (debe estar verificado en Resend)
FROM_EMAIL=reservas@queiroloautos.cl
```

#### 5.3 Schema de Sanity: Tipo "reserva"

Crear archivo `sanity/schemaTypes/reserva.ts`:

```typescript
import { defineField, defineType } from 'sanity'

export const reservaType = defineType({
  name: 'reserva',
  title: 'Reservas / Visitas Agendadas',
  type: 'document',
  fields: [
    defineField({
      name: 'vehiculo',
      title: 'Vehiculo',
      type: 'reference',
      to: [{ type: 'vehicle' }],
    }),
    defineField({
      name: 'nombreCliente',
      title: 'Nombre del Cliente',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'telefono',
      title: 'Telefono',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (rule) => rule.email().required(),
    }),
    defineField({
      name: 'fechaVisita',
      title: 'Fecha de Visita',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'horario',
      title: 'Horario',
      type: 'string',
      options: {
        list: [
          { title: '09:30', value: '09:30' },
          { title: '10:00', value: '10:00' },
          { title: '10:30', value: '10:30' },
          { title: '11:00', value: '11:00' },
          { title: '11:30', value: '11:30' },
          { title: '12:00', value: '12:00' },
          { title: '12:30', value: '12:30' },
          { title: '14:00', value: '14:00' },
          { title: '14:30', value: '14:30' },
          { title: '15:00', value: '15:00' },
          { title: '15:30', value: '15:30' },
          { title: '16:00', value: '16:00' },
          { title: '16:30', value: '16:30' },
          { title: '17:00', value: '17:00' },
          { title: '17:30', value: '17:30' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'comentario',
      title: 'Comentario del Cliente',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'estado',
      title: 'Estado de la Reserva',
      type: 'string',
      options: {
        list: [
          { title: 'Pendiente', value: 'pendiente' },
          { title: 'Confirmada', value: 'confirmada' },
          { title: 'Cancelada', value: 'cancelada' },
          { title: 'Completada', value: 'completada' },
        ],
        layout: 'radio',
      },
      initialValue: 'pendiente',
    }),
    defineField({
      name: 'creadoEn',
      title: 'Fecha de Solicitud',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      nombre: 'nombreCliente',
      fecha: 'fechaVisita',
      horario: 'horario',
      estado: 'estado',
      vehiculo: 'vehiculo.name',
    },
    prepare({ nombre, fecha, horario, estado, vehiculo }) {
      return {
        title: `${nombre} - ${fecha} ${horario}`,
        subtitle: `${vehiculo ?? 'Sin vehiculo'} | ${estado}`,
      }
    },
  },
})
```

Luego en `sanity/schemaTypes/index.ts`, agregar:

```typescript
import { reservaType } from './reserva'

export const schemaTypes = [
  vehicleType,
  reservaType, // <-- agregar aqui
]
```

#### 5.4 API Route: `/app/api/agendar-visita/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@sanity/client'

const resend = new Resend(process.env.RESEND_API_KEY)

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2026-01-16',
  token: process.env.SANITY_API_TOKEN, // Token con permisos de escritura
  useCdn: false,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombreCliente, telefono, email, fechaVisita, horario, comentario, vehiculoId, vehiculoNombre } = body

    // Validacion basica
    if (!nombreCliente || !telefono || !email || !fechaVisita || !horario) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    // 1. Guardar en Sanity
    await sanityClient.create({
      _type: 'reserva',
      nombreCliente,
      telefono,
      email,
      fechaVisita,
      horario,
      comentario: comentario ?? '',
      estado: 'pendiente',
      creadoEn: new Date().toISOString(),
      ...(vehiculoId && {
        vehiculo: { _type: 'reference', _ref: vehiculoId },
      }),
    })

    // 2. Email al vendedor/admin
    await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to: process.env.ADMIN_EMAIL!,
      subject: `Nueva visita agendada: ${nombreCliente} - ${fechaVisita} ${horario}`,
      html: `
        <h2>Nueva solicitud de visita</h2>
        <table>
          <tr><td><strong>Cliente:</strong></td><td>${nombreCliente}</td></tr>
          <tr><td><strong>Telefono:</strong></td><td>${telefono}</td></tr>
          <tr><td><strong>Email:</strong></td><td>${email}</td></tr>
          <tr><td><strong>Fecha:</strong></td><td>${fechaVisita}</td></tr>
          <tr><td><strong>Horario:</strong></td><td>${horario}</td></tr>
          <tr><td><strong>Vehiculo:</strong></td><td>${vehiculoNombre ?? 'No especificado'}</td></tr>
          ${comentario ? `<tr><td><strong>Comentario:</strong></td><td>${comentario}</td></tr>` : ''}
        </table>
        <p><a href="https://queirolo.cl/studio">Ver en Sanity Studio</a></p>
      `,
    })

    // 3. Email de confirmacion al cliente
    await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to: email,
      subject: 'Queirolo Autos - Tu visita fue agendada',
      html: `
        <h2>Hola ${nombreCliente},</h2>
        <p>Recibimos tu solicitud de visita. Te contactaremos a la brevedad para confirmar el horario.</p>
        <h3>Detalle de tu solicitud:</h3>
        <table>
          <tr><td><strong>Fecha:</strong></td><td>${fechaVisita}</td></tr>
          <tr><td><strong>Horario:</strong></td><td>${horario}</td></tr>
          ${vehiculoNombre ? `<tr><td><strong>Vehiculo:</strong></td><td>${vehiculoNombre}</td></tr>` : ''}
        </table>
        <h3>Donde encontrarnos:</h3>
        <p>Av. Las Condes 12461, Local 4A, Las Condes, Santiago</p>
        <p>Lun-Vie 09:30 - 18:00 | Sabado con cita previa</p>
        <p>WhatsApp: +56 9 7214-9979</p>
        <br/>
        <p>Equipo Queirolo Autos</p>
      `,
    })

    return NextResponse.json({ success: true, message: 'Visita agendada correctamente' })
  } catch (error) {
    console.error('Error al agendar visita:', error)
    return NextResponse.json({ error: 'Error interno al procesar la solicitud' }, { status: 500 })
  }
}
```

**Nota importante**: Para escribir en Sanity desde una API route necesitas un token con permisos de escritura. Agregarlo en `.env.local`:

```env
SANITY_API_TOKEN=skxxxxxxxxxxxxxxxx
```

Obtenerlo en: `manage.sanity.io` → Tu proyecto → API → Tokens → "Add API token" con rol "Editor".

#### 5.5 Componente: `components/forms/ReservaForm.tsx`

```typescript
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

interface ReservaFormProps {
  vehiculoId?: string
  vehiculoNombre?: string
  onSuccess?: () => void
}

const HORARIOS = [
  '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
]

export function ReservaForm({ vehiculoId, vehiculoNombre, onSuccess }: ReservaFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm()

  // Calcular fecha minima (manana)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  // Calcular fecha maxima (30 dias desde hoy)
  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + 30)
  const maxDateStr = maxDate.toISOString().split('T')[0]

  const onSubmit = async (data: any) => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/agendar-visita', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, vehiculoId, vehiculoNombre }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error ?? 'Error al agendar')
      }

      setSubmitted(true)
      onSuccess?.()
    } catch (err: any) {
      setError(err.message ?? 'Ocurrio un error. Intentalo nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="text-green-500 text-5xl mb-4">✓</div>
        <h3 className="text-xl font-semibold mb-2">Visita Agendada</h3>
        <p className="text-gray-600">
          Te enviaremos un email de confirmacion. Tambien puedes contactarnos
          por WhatsApp si necesitas modificar el horario.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {vehiculoNombre && (
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm text-gray-600">Vehiculo de interes:</p>
          <p className="font-semibold">{vehiculoNombre}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Nombre completo *</label>
        <input
          {...register('nombreCliente', { required: 'Campo requerido' })}
          className="w-full border rounded-md px-3 py-2"
          placeholder="Juan Perez"
        />
        {errors.nombreCliente && (
          <p className="text-red-500 text-sm">{errors.nombreCliente.message as string}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Telefono *</label>
        <input
          {...register('telefono', { required: 'Campo requerido' })}
          className="w-full border rounded-md px-3 py-2"
          placeholder="+56 9 1234 5678"
          type="tel"
        />
        {errors.telefono && (
          <p className="text-red-500 text-sm">{errors.telefono.message as string}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email *</label>
        <input
          {...register('email', {
            required: 'Campo requerido',
            pattern: { value: /\S+@\S+\.\S+/, message: 'Email invalido' },
          })}
          className="w-full border rounded-md px-3 py-2"
          placeholder="juan@email.com"
          type="email"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message as string}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Fecha *</label>
          <input
            {...register('fechaVisita', { required: 'Campo requerido' })}
            className="w-full border rounded-md px-3 py-2"
            type="date"
            min={minDate}
            max={maxDateStr}
          />
          {errors.fechaVisita && (
            <p className="text-red-500 text-sm">{errors.fechaVisita.message as string}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Horario *</label>
          <select
            {...register('horario', { required: 'Campo requerido' })}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="">Seleccionar</option>
            {HORARIOS.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
          {errors.horario && (
            <p className="text-red-500 text-sm">{errors.horario.message as string}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Comentario (opcional)</label>
        <textarea
          {...register('comentario')}
          className="w-full border rounded-md px-3 py-2"
          rows={3}
          placeholder="Alguna consulta especifica sobre el vehiculo?"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Agendando...' : 'Agendar Visita'}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Lun-Vie 09:30-18:00 | Sabado con cita previa
      </p>
    </form>
  )
}
```

#### 5.6 Integracion en la pagina de detalle del vehiculo

En `app/vehiculos/[slug]/page.tsx`, agregar el boton que abre el formulario usando el componente `Dialog` de shadcn/ui que ya existe:

```tsx
// Importar Dialog existente
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ReservaForm } from '@/components/forms/ReservaForm'

// Dentro del JSX, al lado del boton de WhatsApp:
<Dialog>
  <DialogTrigger asChild>
    <button className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700">
      Agendar Visita
    </button>
  </DialogTrigger>
  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle>Agendar Visita</DialogTitle>
    </DialogHeader>
    <ReservaForm
      vehiculoId={vehicle._id}
      vehiculoNombre={vehicle.name}
    />
  </DialogContent>
</Dialog>
```

---

### Fase 2: Zona de Reservas en la Home (seccion dedicada)

Agregar una seccion en la homepage (`app/page.tsx`) con un CTA para agendar visita independiente de un vehiculo especifico:

```tsx
// Seccion "Agenda tu Visita" en la homepage
<section className="py-16 bg-gray-900 text-white">
  <div className="container mx-auto px-4 text-center">
    <h2 className="text-3xl font-bold mb-4">Agenda tu Visita</h2>
    <p className="text-gray-300 mb-8">
      Ven a conocer nuestros vehiculos. Te esperamos de lunes a viernes de 09:30 a 18:00.
    </p>
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-white text-gray-900 px-8 py-3 rounded-md font-semibold hover:bg-gray-100">
          Agendar Visita Ahora
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Agendar Visita</DialogTitle>
        </DialogHeader>
        <ReservaForm />
      </DialogContent>
    </Dialog>
  </div>
</section>
```

---

## 6. Configuracion de Resend

1. Crear cuenta en [resend.com](https://resend.com) (gratis)
2. Verificar tu dominio en Resend (DNS records)
3. Crear API key
4. Agregar al `.env.local`

**Tier gratuito de Resend**: 3.000 emails/mes, 100/dia. Mas que suficiente para comenzar.

---

## 7. Variables de entorno completas

```env
# Existentes
NEXT_PUBLIC_SANITY_PROJECT_ID=tu_project_id
NEXT_PUBLIC_SANITY_DATASET=production

# Nuevas para el sistema de reservas
RESEND_API_KEY=re_xxxxxxxxxxxx
ADMIN_EMAIL=ventas@queiroloautos.cl
FROM_EMAIL=reservas@queiroloautos.cl

# Para escritura en Sanity (nuevo token con permisos de Editor)
SANITY_API_TOKEN=skxxxxxxxxxxxxxxxx
```

---

## 8. Checklist de implementacion

### Fase 1 (minimo funcional)
- [ ] Instalar `resend`
- [ ] Crear cuenta y obtener API key de Resend
- [ ] Verificar dominio en Resend
- [ ] Agregar variables de entorno
- [ ] Crear `sanity/schemaTypes/reserva.ts`
- [ ] Registrar schema en `sanity/schemaTypes/index.ts`
- [ ] Crear `app/api/agendar-visita/route.ts`
- [ ] Crear `components/forms/ReservaForm.tsx`
- [ ] Integrar boton en `app/vehiculos/[slug]/page.tsx`
- [ ] Crear token de Sanity con permisos de Editor
- [ ] Agregar `SANITY_API_TOKEN` al `.env.local`
- [ ] Probar flujo completo en desarrollo
- [ ] Deploy y verificar en produccion

### Fase 2 (mejoras)
- [ ] Agregar seccion CTA en homepage
- [ ] Crear ruta `/reservas` con formulario full-page (opcional)
- [ ] Panel de admin en Sanity Studio para ver/gestionar reservas
- [ ] Bloquear horarios ya ocupados (consulta a Sanity antes de mostrar slots)
- [ ] Notificacion por WhatsApp (via whapi.cloud o WABA)
- [ ] Recordatorio automatico al cliente 24h antes

---

## 9. Consideraciones importantes

### Dias inhabiles
El selector de fecha no bloquea automaticamente fines de semana (excepto sabado que es "con cita"). Dos opciones:
1. **Simple**: Agregar nota en el formulario: "Sabados con disponibilidad limitada"
2. **Completo**: Agregar logica JS para deshabilitar domingos en el DatePicker

```typescript
// Deshabilitar domingos en el input date con JS
// Requiere reemplazar <input type="date"> por un DatePicker de react-day-picker
// que soporte la prop `disabled`
```

### Control de capacidad
Si quieres limitar cuantas visitas por horario, antes de aceptar la reserva puedes consultar Sanity:

```groq
// Cuantas reservas hay para esa fecha y horario?
count(*[_type == "reserva" && fechaVisita == $fecha && horario == $horario && estado != "cancelada"])
```

Si el resultado es >= maxPerSlot (ej: 2), rechazar la solicitud.

### Rate limiting
Para evitar spam en la API route, agregar rate limiting con `@upstash/ratelimit` (tiene tier gratuito):

```bash
npm install @upstash/ratelimit @upstash/redis
```

### SEO
Agregar la pagina `/reservas` al `sitemap.ts` si se crea como ruta publica.

---

## 10. Alternativa rapida: Cal.com Embed

Si necesitas lanzar en menos de 1 dia:

1. Crear cuenta en [cal.com](https://cal.com) (gratis)
2. Configurar tipo de evento "Visita a Auto" con duracion 30min
3. Configurar disponibilidad (Lun-Vie 09:30-18:00)
4. Copiar el embed code
5. Agregar a la pagina:

```tsx
// En cualquier pagina
<iframe
  src="https://cal.com/queiroloautos/visita-auto"
  width="100%"
  height="600"
  frameBorder="0"
/>
```

**Ventaja**: Listo en horas, manejo de disponibilidad automatico, emails de confirmacion incluidos.
**Desventaja**: UI de Cal.com, dependencia externa, menos integracion con Sanity.

---

## 11. Costos estimados

| Servicio | Tier gratuito | Cuando pagar |
|---------|---------------|--------------|
| Resend | 3.000 emails/mes | +$20 USD/mes si superas |
| Sanity | 200k API requests/mes | Probable que no lo superes |
| Cal.com | Basico gratis | $12/mes para features avanzados |
| Vercel | Gratis para Next.js | Solo si superas limites |

Para el volumen inicial de Queirolo Autos: **costo $0 USD/mes**.

---

*Guia creada como parte del desarrollo de Queirolo Autos. Ver `claudedocs/CLAUDE.md` para contexto completo del proyecto.*
