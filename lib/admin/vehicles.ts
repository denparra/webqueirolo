import { createClient } from 'next-sanity'
import sharp from 'sharp'
import { dataset, projectId, apiVersion } from '@/lib/sanity'
import { cleanEnvVar } from '@/sanity/env-utils'
import { generateSlug } from '@/lib/utils'
import { portableTextToPlainText, textToPortableText, type VehicleDescription } from '@/lib/richText'

export interface AdminVehicleImage {
  assetId: string
  url: string
}

export interface AdminVehicle {
  id: string
  name: string
  slug: string
  status: 'available' | 'reserved' | 'sold'
  price: number
  brand: string
  model: string
  version?: string
  year: number
  category?: string
  bodyType?: string
  mileage?: number
  doors?: number
  fuel?: string
  transmission?: string
  color?: string
  description?: VehicleDescription
  descriptionPlain: string
  comfortFeatures?: string[]
  safetyFeatures?: string[]
  entertainmentFeatures?: string[]
  otherFeatures?: string[]
  isFeatured?: boolean
  images: AdminVehicleImage[]
}

export interface SaveVehicleInput {
  id?: string
  name: string
  slug?: string
  status: 'available' | 'reserved' | 'sold'
  price: number
  brand: string
  model: string
  version?: string
  year: number
  category?: string
  bodyType?: string
  mileage?: number
  doors?: number
  fuel?: string
  transmission?: string
  color?: string
  description?: string
  comfortFeatures: string[]
  safetyFeatures: string[]
  entertainmentFeatures: string[]
  otherFeatures: string[]
  isFeatured: boolean
  existingAssetIds: string[]
  replaceImages: boolean
  imageFiles: File[]
}

const adminReadClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
})

function getSanityWriteToken(): string {
  const token = cleanEnvVar(process.env.SANITY_API_WRITE_TOKEN)
  if (!token) {
    throw new Error('Falta SANITY_API_WRITE_TOKEN para guardar vehículos desde /admin.')
  }
  return token
}

function getAdminWriteClient() {
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: getSanityWriteToken(),
  })
}

function assertSanityConfigured() {
  if (!projectId || !dataset) {
    throw new Error('Sanity no está configurado. Revisa NEXT_PUBLIC_SANITY_PROJECT_ID y NEXT_PUBLIC_SANITY_DATASET.')
  }
}

function toOptionalString(value?: string) {
  const clean = value?.trim()
  return clean || null
}

function toOptionalNumber(value?: number) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : null
}

const DIRECT_UPLOAD_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const CONVERTIBLE_EXTENSIONS = new Set(['.heic', '.heif', '.tif', '.tiff', '.bmp'])

function getFileExtension(filename: string): string {
  const match = filename.toLowerCase().match(/\.[a-z0-9]+$/)
  return match?.[0] || ''
}

function inferImageMimeType(filename: string, mimeType: string): string {
  if (DIRECT_UPLOAD_MIME_TYPES.has(mimeType)) return mimeType

  const extension = getFileExtension(filename)
  if (extension === '.jpg' || extension === '.jpeg') return 'image/jpeg'
  if (extension === '.png') return 'image/png'
  if (extension === '.webp') return 'image/webp'
  if (extension === '.gif') return 'image/gif'

  return mimeType
}

async function prepareImageForSanity(file: File): Promise<{
  buffer: Buffer
  filename: string
  contentType: string
}> {
  const originalBuffer = Buffer.from(await file.arrayBuffer())
  const extension = getFileExtension(file.name)
  const inferredContentType = inferImageMimeType(file.name, file.type)

  if (DIRECT_UPLOAD_MIME_TYPES.has(inferredContentType)) {
    return {
      buffer: originalBuffer,
      filename: file.name,
      contentType: inferredContentType,
    }
  }

  if (CONVERTIBLE_EXTENSIONS.has(extension) || file.type === 'image/heic' || file.type === 'image/heif') {
    try {
      return {
        buffer: await sharp(originalBuffer).rotate().jpeg({ quality: 90 }).toBuffer(),
        filename: file.name.replace(/\.[^.]+$/, '.jpg'),
        contentType: 'image/jpeg',
      }
    } catch {
      throw new Error(
        `No pude convertir "${file.name}". Si es una foto HEIC/iPhone, conviértela a JPG o PNG antes de subirla.`
      )
    }
  }

  throw new Error(
    `Formato no soportado para "${file.name}". Sube imágenes JPG, PNG, WEBP o GIF. Si viene de iPhone en HEIC, conviértela a JPG.`
  )
}

function mapAdminVehicle(raw: any): AdminVehicle {
  return {
    id: raw._id,
    name: raw.name || '',
    slug: raw.slug || '',
    status: raw.status || 'available',
    price: raw.price || 0,
    brand: raw.brand || '',
    model: raw.model || '',
    version: raw.version || undefined,
    year: raw.year || 0,
    category: raw.category || undefined,
    bodyType: raw.bodyType || undefined,
    mileage: raw.mileage || undefined,
    doors: raw.doors || undefined,
    fuel: raw.fuel || undefined,
    transmission: raw.transmission || undefined,
    color: raw.color || undefined,
    description: raw.description,
    descriptionPlain: portableTextToPlainText(raw.description),
    comfortFeatures: raw.comfortFeatures || [],
    safetyFeatures: raw.safetyFeatures || [],
    entertainmentFeatures: raw.entertainmentFeatures || [],
    otherFeatures: raw.otherFeatures || [],
    isFeatured: Boolean(raw.isFeatured),
    images: Array.isArray(raw.images)
      ? raw.images
          .filter((image: any) => image?.asset?._id && image?.asset?.url)
          .map((image: any) => ({
            assetId: image.asset._id,
            url: image.asset.url,
          }))
      : [],
  }
}

const ADMIN_VEHICLE_FIELDS = `
  _id,
  name,
  "slug": slug.current,
  status,
  price,
  brand,
  model,
  version,
  year,
  category,
  bodyType,
  mileage,
  doors,
  fuel,
  transmission,
  color,
  description,
  comfortFeatures,
  safetyFeatures,
  entertainmentFeatures,
  otherFeatures,
  isFeatured,
  images[]{
    asset->{ _id, url }
  }
`

export async function getAdminVehicles(): Promise<AdminVehicle[]> {
  assertSanityConfigured()
  const results = await adminReadClient.fetch<any[]>(
    `*[_type == "vehicle"] | order(_createdAt desc) { ${ADMIN_VEHICLE_FIELDS} }`,
    {},
    { next: { revalidate: 0 } }
  )
  return results.map(mapAdminVehicle)
}

export async function getAdminVehicleById(id: string): Promise<AdminVehicle | null> {
  assertSanityConfigured()
  const result = await adminReadClient.fetch<any | null>(
    `*[_type == "vehicle" && _id == $id][0] { ${ADMIN_VEHICLE_FIELDS} }`,
    { id },
    { next: { revalidate: 0 } }
  )
  return result ? mapAdminVehicle(result) : null
}

async function ensureUniqueSlug(baseSlug: string, currentId?: string): Promise<string> {
  const cleanBaseSlug = baseSlug || 'vehiculo'
  let candidate = cleanBaseSlug
  let suffix = 2

  while (true) {
    const count = await adminReadClient.fetch<number>(
      `count(*[_type == "vehicle" && slug.current == $slug && (!defined($currentId) || _id != $currentId)])`,
      { slug: candidate, currentId: currentId || null },
      { next: { revalidate: 0 } }
    )

    if (count === 0) return candidate

    candidate = `${cleanBaseSlug}-${suffix}`
    suffix += 1
  }
}

async function uploadImages(files: File[]) {
  const client = getAdminWriteClient()
  const imageRefs = []

  for (const file of files) {
    if (!file || file.size === 0) continue

    const image = await prepareImageForSanity(file)
    const asset = await client.assets.upload('image', image.buffer, {
      filename: image.filename,
      contentType: image.contentType,
    })

    imageRefs.push({
      _type: 'image',
      _key: asset._id,
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
    })
  }

  return imageRefs
}

export async function saveAdminVehicle(input: SaveVehicleInput) {
  assertSanityConfigured()
  const client = getAdminWriteClient()

  const generatedSlug = generateSlug(input.brand, `${input.model} ${input.version || ''}`.trim(), input.year)
  const slug = await ensureUniqueSlug(input.slug || generatedSlug, input.id)
  const uploadedImageRefs = await uploadImages(input.imageFiles)
  const existingImageRefs = input.replaceImages
    ? []
    : input.existingAssetIds.map((assetId) => ({
        _type: 'image',
        _key: assetId,
        asset: {
          _type: 'reference',
          _ref: assetId,
        },
      }))

  const images = [...existingImageRefs, ...uploadedImageRefs]

  if (images.length === 0) {
    throw new Error('Debes subir al menos una imagen del vehículo.')
  }

  const vehicleFields = {
    name: input.name.trim(),
    slug: {
      _type: 'slug',
      current: slug,
    },
    status: input.status,
    price: input.price,
    brand: input.brand.trim(),
    model: input.model.trim(),
    version: toOptionalString(input.version),
    year: input.year,
    category: toOptionalString(input.category),
    bodyType: toOptionalString(input.bodyType),
    mileage: toOptionalNumber(input.mileage),
    doors: toOptionalNumber(input.doors),
    fuel: toOptionalString(input.fuel),
    transmission: toOptionalString(input.transmission),
    color: toOptionalString(input.color),
    description: textToPortableText(input.description || '') ?? null,
    comfortFeatures: input.comfortFeatures,
    safetyFeatures: input.safetyFeatures,
    entertainmentFeatures: input.entertainmentFeatures,
    otherFeatures: input.otherFeatures,
    isFeatured: input.isFeatured,
    images,
  }

  if (input.id) {
    await client.patch(input.id).set(vehicleFields).commit()
    return input.id
  }

  const created = await client.create({
    _type: 'vehicle',
    ...vehicleFields,
  })
  return created._id
}

export async function deleteAdminVehicle(id: string) {
  assertSanityConfigured()
  if (!id) {
    throw new Error('Falta el ID del vehículo a eliminar.')
  }

  const client = getAdminWriteClient()
  await client.delete(id)
}
