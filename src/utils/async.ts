export function simulateDelay(ms = 500) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}
