import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

import { apiVersion, cleanEnvVar } from '@/sanity/env-utils'

export const projectId = cleanEnvVar(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)
export const dataset = cleanEnvVar(process.env.NEXT_PUBLIC_SANITY_DATASET) || 'production'
export { apiVersion }

// Solo se advierte cuando falta configuración (señal útil). El log de éxito se
// quitó porque se imprimía en cada render server-side y solo generaba ruido.
if (typeof window === 'undefined' && !projectId) {
    console.warn('[Sanity] WARNING: Sanity projectId not configured - will use mock data')
}

export const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
})

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
    return builder.image(source)
}
