import { describe, expect, it } from 'vitest'
import type { RawCountry } from '../types'
import { normalizeCountry } from './normalize'

const base: RawCountry = {
  name: 'Fiji',
  nativeName: 'Fiji',
  topLevelDomain: ['.fj'],
  alpha2Code: 'FJ',
  alpha3Code: 'fji ',
  region: 'Oceania',
  subregion: 'Melanesia',
  population: 896444,
  languages: [],
  flags: { svg: 'https://flagcdn.com/fj.svg', png: 'https://flagcdn.com/w320/fj.png' },
}

describe('normalizeCountry', () => {
  it('fills absent borders with an empty array', () => {
    expect(normalizeCountry(base).borders).toEqual([])
  })

  it('fills an absent capital with an empty string', () => {
    expect(normalizeCountry(base).capital).toBe('')
  })

  it('fills absent currencies with an empty array', () => {
    expect(normalizeCountry(base).currencies).toEqual([])
  })

  it('uppercases and trims the alpha3 code', () => {
    expect(normalizeCountry(base).alpha3Code).toBe('FJI')
  })

  it('keeps present values untouched', () => {
    const withData = normalizeCountry({ ...base, capital: 'Suva', borders: ['FRA'] })
    expect(withData.capital).toBe('Suva')
    expect(withData.borders).toEqual(['FRA'])
  })
})
