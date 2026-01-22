import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

import { apiVersion, cleanEnvVar } from '@/sanity/env-utils'

export const projectId = cleanEnvVar(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)
export const dataset = cleanEnvVar(process.env.NEXT_PUBLIC_SANITY_DATASET) || 'production'
export { apiVersion }

// Log configuration on server startup (only in development or when debugging)
if (typeof window === 'undefined') {
    const configStatus = projectId
        ? `Sanity configured: projectId=${projectId}, dataset=${dataset}`
        : 'WARNING: Sanity projectId not configured - will use mock data'
    console.log(`[Sanity] ${configStatus}`)
}

export const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: process.env.NODE_ENV === 'production',
})

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
    return builder.image(source)
}
