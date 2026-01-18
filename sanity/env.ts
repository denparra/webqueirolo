/**
 * Helper to clean env vars that might have quotes from misconfigured panels.
 * Some deployment environments (VPS, Docker) may include literal quotes in values.
 */
function cleanEnvVar(value: string | undefined): string {
  if (!value) return ''
  // Remove surrounding quotes if present (handles "value" or 'value')
  return value.replace(/^["']|["']$/g, '').trim()
}

function assertValue(v: string | undefined, errorMessage: string): string {
  const cleaned = cleanEnvVar(v)
  if (!cleaned) {
    throw new Error(errorMessage)
  }
  return cleaned
}

export const apiVersion =
  cleanEnvVar(process.env.NEXT_PUBLIC_SANITY_API_VERSION) || '2026-01-16'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)
