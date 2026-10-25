import type { BorderCountry, Country } from '../types'

export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
}

export function filterCountries(all: Country[], query: string, region: string | null): Country[] {
  const needle = normalizeText(query)

  return all.filter((country) => {
    const matchesQuery =
      needle === '' ||
      normalizeText(country.name).includes(needle) ||
      normalizeText(country.nativeName).includes(needle)
    const matchesRegion = region === null || country.region === region

    return matchesQuery && matchesRegion
  })
}

export function getRegions(all: Country[]): string[] {
  return [...new Set(all.map((country) => country.region))].sort()
}

export function buildCountryIndex(all: Country[]): Map<string, Country> {
  return new Map(all.map((country) => [country.alpha3Code, country]))
}

export function resolveBorders(country: Country, index: Map<string, Country>): BorderCountry[] {
  return country.borders.flatMap((code) => {
    const neighbour = index.get(code)
    return neighbour ? [{ code: neighbour.alpha3Code, name: neighbour.name }] : []
  })
}
