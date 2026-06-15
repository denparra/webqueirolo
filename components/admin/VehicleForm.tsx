import Link from 'next/link'
import { saveVehicleAction } from '@/app/admin/vehiculos/actions'
import {
  CATEGORY_OPTIONS,
  FEATURE_GROUPS,
  FUEL_OPTIONS,
  TRANSMISSION_OPTIONS,
  VEHICLE_STATUS_OPTIONS,
} from '@/lib/admin/vehicleOptions'
import type { AdminVehicle } from '@/lib/admin/vehicles'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ExistingImagesManager } from './ExistingImagesManager'
import { deleteVehicleAction } from '@/app/admin/vehiculos/actions'
import { DeleteVehicleSubmitButton } from './DeleteVehicleSubmitButton'

function Field({
  label,
  children,
  required = false,
}: {
  label: string
  children: React.ReactNode
  required?: boolean
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-600">*</span>}
      </span>
      {children}
    </label>
  )
}

function SelectField({
  name,
  defaultValue,
  options,
  placeholder = 'Seleccionar',
}: {
  name: string
  defaultValue?: string
  options: readonly string[] | readonly { value: string; label: string }[]
  placeholder?: string
}) {
  return (
    <select
      name={name}
      defaultValue={defaultValue || ''}
      className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
    >
      <option value="">{placeholder}</option>
      {options.map((option) => {
        const value = typeof option === 'string' ? option : option.value
        const label = typeof option === 'string' ? option : option.label
        return (
          <option key={value} value={value}>
            {label}
          </option>
        )
      })}
    </select>
  )
}

export function VehicleForm({
  vehicle,
  error,
}: {
  vehicle?: AdminVehicle
  error?: string
}) {
  const isEditing = Boolean(vehicle)
  const returnTo = isEditing
    ? `/admin/vehiculos/${encodeURIComponent(vehicle!.id)}/editar`
    : '/admin/vehiculos/nuevo'

  return (
    <>
      <form action={saveVehicleAction} className="space-y-6">
      <input type="hidden" name="returnTo" value={returnTo} />
      {vehicle && <input type="hidden" name="id" value={vehicle.id} />}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Información principal</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Field label="Nombre publicado" required>
            <Input
              name="name"
              defaultValue={vehicle?.name}
              placeholder="Toyota RAV4 2.0 Lujo"
              required
            />
          </Field>
          <Field label="Slug">
            <Input
              name="slug"
              defaultValue={vehicle?.slug}
              placeholder="Se genera automáticamente si queda vacío"
            />
          </Field>
          <Field label="Estado" required>
            <SelectField
              name="status"
              defaultValue={vehicle?.status || 'available'}
              options={VEHICLE_STATUS_OPTIONS}
            />
          </Field>
          <Field label="Precio CLP" required>
            <Input name="price" type="number" min="0" defaultValue={vehicle?.price || ''} required />
          </Field>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input
              name="isFeatured"
              type="checkbox"
              defaultChecked={vehicle?.isFeatured}
              className="h-4 w-4 rounded border-gray-300 text-primary-600"
            />
            Destacado en home
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Especificaciones</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <Field label="Marca" required>
            <Input name="brand" defaultValue={vehicle?.brand} required />
          </Field>
          <Field label="Modelo" required>
            <Input name="model" defaultValue={vehicle?.model} required />
          </Field>
          <Field label="Versión">
            <Input name="version" defaultValue={vehicle?.version} />
          </Field>
          <Field label="Año" required>
            <Input name="year" type="number" min="1990" max="2030" defaultValue={vehicle?.year || ''} required />
          </Field>
          <Field label="Kilometraje">
            <Input name="mileage" type="number" min="0" defaultValue={vehicle?.mileage || ''} />
          </Field>
          <Field label="Puertas">
            <Input name="doors" type="number" min="0" defaultValue={vehicle?.doors || ''} />
          </Field>
          <Field label="Categoría">
            <SelectField name="category" defaultValue={vehicle?.category} options={CATEGORY_OPTIONS} />
          </Field>
          <Field label="Carrocería">
            <Input name="bodyType" defaultValue={vehicle?.bodyType} placeholder="Station Wagon, Pickup..." />
          </Field>
          <Field label="Color">
            <Input name="color" defaultValue={vehicle?.color} />
          </Field>
          <Field label="Combustible">
            <SelectField name="fuel" defaultValue={vehicle?.fuel} options={FUEL_OPTIONS} />
          </Field>
          <Field label="Transmisión">
            <SelectField name="transmission" defaultValue={vehicle?.transmission} options={TRANSMISSION_OPTIONS} />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Descripción</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            name="description"
            defaultValue={vehicle?.descriptionPlain}
            rows={8}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder={'Escribe párrafos separados por saltos de línea.\nUsa "- " al inicio para listas.'}
          />
          <p className="mt-2 text-xs text-gray-500">
            Tip: separa párrafos con Enter. Para bullets, inicia la línea con “- ”.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Imágenes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {vehicle?.images && vehicle.images.length > 0 && (
            <div>
              <ExistingImagesManager images={vehicle.images} />
              <label className="mt-3 flex items-center gap-2 text-sm text-gray-700">
                <input name="replaceImages" type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                Reemplazar galería actual con las imágenes nuevas
              </label>
            </div>
          )}
          <Field label={isEditing ? 'Agregar imágenes nuevas' : 'Subir imágenes'} required={!isEditing}>
            <Input
              name="images"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif,.heic,.heif"
              multiple
              required={!isEditing}
            />
          </Field>
          <p className="text-xs text-gray-500">
            Formatos recomendados: JPG, PNG, WEBP o GIF. Las fotos HEIC/HEIF de iPhone se intentan convertir a JPG
            automáticamente; si fallan, conviértelas antes de subir.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Equipamiento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {FEATURE_GROUPS.map((group) => {
            const selected = (vehicle?.[group.name as keyof AdminVehicle] as string[] | undefined) || []
            return (
              <div key={group.name}>
                <h3 className="mb-3 text-sm font-semibold text-gray-900">{group.title}</h3>
                <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                  {group.options.map((option) => (
                    <label key={option.value} className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        name={group.name}
                        value={option.value}
                        defaultChecked={selected.includes(option.value)}
                        className="h-4 w-4 rounded border-gray-300 text-primary-600"
                      />
                      {option.title}
                    </label>
                  ))}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <div className="sticky bottom-0 flex flex-col gap-3 border-t border-gray-200 bg-white/95 p-4 backdrop-blur md:flex-row md:justify-end">
        <Button variant="outline" asChild>
          <Link href="/admin/vehiculos">Cancelar</Link>
        </Button>
        {vehicle?.slug && (
          <Button variant="secondary" asChild>
            <Link href={`/vehiculos/${vehicle.slug}`} target="_blank">
              Preview público
            </Link>
          </Button>
        )}
        <Button type="submit">{isEditing ? 'Guardar cambios' : 'Crear vehículo'}</Button>
      </div>
      </form>

      {vehicle && (
        <Card className="mt-6 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-900">Zona de eliminación</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-red-800">
              Usa esto solo para duplicados o publicaciones incorrectas. Elimina el documento del inventario; no borra
              los assets de imagen de Sanity.
            </p>
            <form action={deleteVehicleAction}>
              <input type="hidden" name="id" value={vehicle.id} />
              <input type="hidden" name="slug" value={vehicle.slug} />
              <DeleteVehicleSubmitButton label="Eliminar vehículo" />
            </form>
          </CardContent>
        </Card>
      )}
    </>
  )
}
