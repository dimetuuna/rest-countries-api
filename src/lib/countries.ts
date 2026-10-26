import type { Country, RawCountry } from '../types'
import { normalizeCountries } from './normalize'

let cache: Promise<Country[]> | null = null

// The build inlines the dataset into index.html so the first render already has
// countries: the `load` event otherwise fires before the fetch even starts, and
// anything that captures the page at `load` sees the loading state.
function readInlineCountries(): Country[] | null {
  const element = typeof document === 'undefined' ? null : document.getElementById('countries-data')
  const payload = element?.textContent
  if (!payload) return null
  try {
    return normalizeCountries(JSON.parse(payload) as RawCountry[])
  } catch {
    // A corrupt build artefact must not take the app down: fall back to the request.
    return null
  }
}

export function getCountries(): Promise<Country[]> {
  if (!cache) {
    const inlined = readInlineCountries()
    if (inlined) {
      cache = Promise.resolve(inlined)
      return cache
    }

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
