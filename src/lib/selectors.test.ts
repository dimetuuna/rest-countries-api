import { describe, expect, it } from 'vitest'
import data from '../../public/data.json'
import type { Country, RawCountry } from '../types'
import {
  buildCountryIndex,
  filterCountries,
  getRegions,
  normalizeText,
  resolveBorders,
} from './selectors'
import { formatPopulation } from './format'
import { normalizeCountries } from './normalize'

const countries = normalizeCountries(data as RawCountry[])

describe('normalizeText', () => {
  it('strips diacritics and lowercases', () => {
    expect(normalizeText("Côte d'Ivoire")).toBe("cote d'ivoire")
  })

  it('normalizes a leading ring accent', () => {
    expect(normalizeText('Åland Islands')).toBe('aland islands')
  })

  it('trims surrounding whitespace', () => {
    expect(normalizeText('  Fiji  ')).toBe('fiji')
  })
})

describe('filterCountries', () => {
  it('matches a diacritic-insensitive substring of the name', () => {
    expect(filterCountries(countries, 'aland islands', null).map((c) => c.name)).toEqual([
      'Åland Islands',
    ])
  })

  it('matches the native name', () => {
    expect(filterCountries(countries, 'belgie', null).map((c) => c.name)).toEqual(['Belgium'])
  })

  it('filters by region only', () => {
    const result = filterCountries(countries, '', 'Europe')
    expect(result.length).toBe(53)
    expect(result.every((c) => c.region === 'Europe')).toBe(true)
  })

  it('applies query and region together', () => {
    expect(filterCountries(countries, 'ger', 'Europe').map((c) => c.name)).toEqual(['Germany'])
  })

  it('returns every country when no criteria are given', () => {
    expect(filterCountries(countries, '', null)).toHaveLength(250)
  })

  it('returns an empty array when nothing matches', () => {
    expect(filterCountries(countries, 'zzzz', null)).toEqual([])
  })
})

describe('getRegions', () => {
  it('returns the eight regions present in the data, alphabetically', () => {
    expect(getRegions(countries)).toEqual([
      'Africa',
      'Americas',
      'Antarctic',
      'Antarctic Ocean',
      'Asia',
      'Europe',
      'Oceania',
      'Polar',
    ])
  })
})

describe('buildCountryIndex', () => {
  it('maps every alpha3 code to its country', () => {
    const index = buildCountryIndex(countries)
    expect(index.size).toBe(250)
    expect(index.get('BEL')?.name).toBe('Belgium')
  })
})

describe('resolveBorders', () => {
  const index = buildCountryIndex(countries)

  it('resolves border codes to names, preserving order', () => {
    const belgium = index.get('BEL')!
    expect(resolveBorders(belgium, index)).toEqual([
      { code: 'FRA', name: 'France' },
      { code: 'DEU', name: 'Germany' },
      { code: 'LUX', name: 'Luxembourg' },
      { code: 'NLD', name: 'Netherlands' },
    ])
  })

  it('returns an empty array for a country with no borders', () => {
    const fiji = index.get('FJI')!
    expect(resolveBorders(fiji, index)).toEqual([])
  })

  it('drops border codes that are missing from the index', () => {
    const orphan: Country = { ...index.get('FJI')!, borders: ['FRA', 'ZZZ'] }
    expect(resolveBorders(orphan, index)).toEqual([{ code: 'FRA', name: 'France' }])
  })
})

describe('formatPopulation', () => {
  it('groups thousands with en-US separators', () => {
    expect(formatPopulation(81770900)).toBe('81,770,900')
  })

  it('formats zero', () => {
    expect(formatPopulation(0)).toBe('0')
  })
})
