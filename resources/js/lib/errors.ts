export function errorMessage(error: unknown, fallback = "تعذر إكمال العملية"): string {
  return error instanceof Error && error.message ? error.message : fallback
}
