export function trackPlausibleEvent(eventName: string) {
  if (typeof window === "undefined") return
  const plausible = (window as Window & { plausible?: (n: string, o?: object) => void })
    .plausible
  if (typeof plausible !== "function") return
  try {
    plausible(eventName, {})
  } catch {
    return
  }
}
