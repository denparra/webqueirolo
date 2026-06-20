'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdminSession } from '@/lib/admin/auth'
import { deleteAdminVehicle, saveAdminVehicle, type SaveVehicleInput } from '@/lib/admin/vehicles'

function getString(formData: FormData, key: string): string {
  return String(formData.get(key) || '').trim()
}

function getNumber(formData: FormData, key: string): number {
  const value = Number(formData.get(key))
  return Number.isFinite(value) ? value : 0
}

function getStringArray(formData: FormData, key: string): string[] {
  return formData.getAll(key).map(String).filter(Boolean)
}

function isFileLike(value: unknown): value is File {
  return (
    typeof value === 'object' &&
    value !== null &&
    'arrayBuffer' in value &&
    'size' in value &&
    (value as { size: number }).size > 0
  )
}

function getFiles(formData: FormData, key: string): File[] {
  return formData.getAll(key).filter(isFileLike) as File[]
}

function errorRedirectPath(formData: FormData, message: string): string {
  const fallback = '/admin/vehiculos/nuevo'
  const returnTo = getString(formData, 'returnTo') || fallback
  const separator = returnTo.includes('?') ? '&' : '?'
  return `${returnTo}${separator}error=${encodeURIComponent(message)}`
}

export async function saveVehicleAction(formData: FormData) {
  await requireAdminSession()

  const id = getString(formData, 'id') || undefined
  const input: SaveVehicleInput = {
    id,
    name: getString(formData, 'name'),
    slug: getString(formData, 'slug') || undefined,
    status: getString(formData, 'status') as SaveVehicleInput['status'],
    price: getNumber(formData, 'price'),
    brand: getString(formData, 'brand'),
    model: getString(formData, 'model'),
    version: getString(formData, 'version') || undefined,
    year: getNumber(formData, 'year'),
    category: getString(formData, 'category') || undefined,
    bodyType: getString(formData, 'bodyType') || undefined,
    mileage: getNumber(formData, 'mileage'),
    doors: getNumber(formData, 'doors'),
    fuel: getString(formData, 'fuel') || undefined,
    transmission: getString(formData, 'transmission') || undefined,
    color: getString(formData, 'color') || undefined,
    description: getString(formData, 'description'),
    comfortFeatures: getStringArray(formData, 'comfortFeatures'),
    safetyFeatures: getStringArray(formData, 'safetyFeatures'),
    entertainmentFeatures: getStringArray(formData, 'entertainmentFeatures'),
    otherFeatures: getStringArray(formData, 'otherFeatures'),
    isFeatured: formData.get('isFeatured') === 'on',
    existingAssetIds: getStringArray(formData, 'existingAssetIds'),
    replaceImages: formData.get('replaceImages') === 'on',
    imageFiles: getFiles(formData, 'images'),
    originalSlug: getString(formData, 'originalSlug') || undefined,
    imagesOrderChanged: formData.get('imagesOrderChanged') === 'true',
  }

  if (!input.name || !input.brand || !input.model || !input.year || !input.price) {
    redirect(errorRedirectPath(formData, 'Completa nombre, marca, modelo, año y precio.'))
  }

  try {
    await saveAdminVehicle(input)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo guardar el vehículo.'
    redirect(errorRedirectPath(formData, message))
  }

  revalidatePath('/vehiculos')
  revalidatePath('/admin/vehiculos')
  redirect('/admin/vehiculos?saved=1')
}

export async function deleteVehicleAction(formData: FormData) {
  await requireAdminSession()

  const id = getString(formData, 'id')
  const slug = getString(formData, 'slug')

  try {
    await deleteAdminVehicle(id)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo eliminar el vehículo.'
    redirect(`/admin/vehiculos?error=${encodeURIComponent(message)}`)
  }

  revalidatePath('/vehiculos')
  revalidatePath('/admin/vehiculos')
  if (slug) {
    revalidatePath(`/vehiculos/${slug}`)
  }
  redirect('/admin/vehiculos?deleted=1')
}
