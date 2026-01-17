import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

// Helper to clean env vars that might have quotes from misconfigured panels
function cleanEnvVar(value: string | undefined): string {
    if (!value) return ''
    // Remove surrounding quotes if present (handles "value" or 'value')
    return value.replace(/^["']|["']$/g, '').trim()
}

export const projectId = cleanEnvVar(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)
export const dataset = cleanEnvVar(process.env.NEXT_PUBLIC_SANITY_DATASET) || 'production'
export const apiVersion = '2024-01-01'

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
