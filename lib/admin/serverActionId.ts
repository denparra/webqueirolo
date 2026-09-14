const SERVER_ACTION_ID_PATTERN = /^[0-9a-f]{40,}$/i

export function isValidServerActionId(value: string | null): boolean {
  return value !== null && SERVER_ACTION_ID_PATTERN.test(value)
}
