export const isValidEmail = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) {
    return false
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
}
