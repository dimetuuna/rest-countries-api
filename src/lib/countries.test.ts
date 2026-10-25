import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { RawCountry } from '../types'
import { getCountries, resetCountriesCache } from './countries'

const raw: RawCountry[] = [
  {
    name: 'Fiji',
    nativeName: 'Fiji',
    topLevelDomain: ['.fj'],
    alpha2Code: 'FJ',
    alpha3Code: 'FJI',
    region: 'Oceania',
    subregion: 'Melanesia',
    population: 896444,
    languages: [],
    flags: { svg: 'https://flagcdn.com/fj.svg', png: 'https://flagcdn.com/w320/fj.png' },
  },
]

function okResponse() {
  return { ok: true, status: 200, json: async () => raw } as unknown as Response
}

describe('getCountries', () => {
  beforeEach(() => {
    resetCountriesCache()
    vi.restoreAllMocks()
  })

  it('fetches the bundled data file once and normalises it', async () => {
    const fetchMock = vi.fn().mockResolvedValue(okResponse())
    vi.stubGlobal('fetch', fetchMock)

    const countries = await getCountries()

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0][0]).toContain('data.json')
    expect(countries[0].borders).toEqual([])
  })

  it('reuses one in-flight request for concurrent calls', async () => {
    const fetchMock = vi.fn().mockResolvedValue(okResponse())
    vi.stubGlobal('fetch', fetchMock)

    const [first, second] = await Promise.all([getCountries(), getCountries()])

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(first).toBe(second)
  })

  it('reuses the result for sequential calls', async () => {
    const fetchMock = vi.fn().mockResolvedValue(okResponse())
    vi.stubGlobal('fetch', fetchMock)

    await getCountries()
    await getCountries()

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('rejects when the response is not ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 404 } as unknown as Response),
    )

    await expect(getCountries()).rejects.toThrow('HTTP 404')
  })

  it('performs a fresh request after a rejection', async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(okResponse())
    vi.stubGlobal('fetch', fetchMock)

    await expect(getCountries()).rejects.toThrow('offline')
    await expect(getCountries()).resolves.toHaveLength(1)

    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
