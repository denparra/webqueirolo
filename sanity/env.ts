import { apiVersion, cleanEnvVar } from './env-utils'

function assertValue(v: string | undefined, errorMessage: string): string {
  const cleaned = cleanEnvVar(v)
  if (!cleaned) {
    throw new Error(errorMessage)
  }
  return cleaned
}

export { apiVersion }

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)
