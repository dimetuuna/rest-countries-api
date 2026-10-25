import type { Country, RawCountry } from '../types'

export function normalizeCountry(raw: RawCountry): Country {
  return {
    ...raw,
    alpha3Code: raw.alpha3Code.trim().toUpperCase(),
    capital: raw.capital ?? '',
    borders: raw.borders ?? [],
    currencies: raw.currencies ?? [],
  }
}

export function normalizeCountries(raw: RawCountry[]): Country[] {
  return raw.map(normalizeCountry)
}
