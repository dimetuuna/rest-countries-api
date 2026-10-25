import type { Country, RawCountry } from '../types'
import { normalizeCountries } from './normalize'

let cache: Promise<Country[]> | null = null

export function getCountries(): Promise<Country[]> {
  if (!cache) {
    cache = fetch(`${import.meta.env.BASE_URL}data.json`, {
      // A hung request must reach the error state so Retry stays reachable.
      signal: AbortSignal.timeout(10_000),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load countries (HTTP ${response.status})`)
        }
        return response.json() as Promise<RawCountry[]>
      })
      .then(normalizeCountries)
      .catch((error: unknown) => {
        // A rejected promise must not poison the cache, or retry is a no-op.
        cache = null
        throw error
      })
  }

  return cache
}

export function resetCountriesCache(): void {
  cache = null
}
