/**
 * Shared Sanity env helpers.
 *
 * Keep this file free of required/throwing asserts so it can be imported
 * from both Studio and frontend code paths safely.
 */

export function cleanEnvVar(value: string | undefined): string {
  if (!value) return ''
  // Remove surrounding quotes if present (handles "value" or 'value')
  return value.replace(/^["']|["']$/g, '').trim()
}

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
export const apiVersion =
  cleanEnvVar(process.env.NEXT_PUBLIC_SANITY_API_VERSION) || '2024-01-01'
