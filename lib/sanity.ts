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

// Cliente de LECTURA PÚBLICA.
//
// `useCdn: true` enruta a apicdn.sanity.io, cacheado en borde: menos latencia y
// muchos menos round-trips al origen. Las páginas públicas revalidan cada 60s
// (`/vehiculos`, `app/sitemap.ts`), así que la frescura no se degrada de forma
// perceptible. El admin usa sus propios clientes con `useCdn: false` porque sí
// necesita lectura fresca inmediatamente después de escribir.
//
// `maxRetries`/`timeout`: antes se dependía del default (5 reintentos con
// backoff). Cuando la red del VPS se degrada, eso deja una request colgada ~100s
// ocupando slots del threadpool de libuv y arrastra al resto del proceso.
// Preferimos fallar rápido y que la página muestre su estado de error.
export const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
    maxRetries: 2,
    timeout: 15000,
})

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
    return builder.image(source)
}
