import { renderHook, waitFor } from '@testing-library/react'
import { act } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { RawCountry } from '../types'
import { resetCountriesCache } from '../lib/countries'
import { useCountries } from './useCountries'

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

describe('useCountries', () => {
  beforeEach(() => {
    resetCountriesCache()
    vi.restoreAllMocks()
  })

  it('starts in loading and resolves with the countries', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(okResponse()))

    const { result } = renderHook(() => useCountries())

    expect(result.current.status).toBe('loading')
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current.countries).toHaveLength(1)
    expect(result.current.error).toBeNull()
  })

  it('exposes the error and recovers on retry', async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(okResponse())
    vi.stubGlobal('fetch', fetchMock)

    const { result } = renderHook(() => useCountries())
    await waitFor(() => expect(result.current.status).toBe('error'))
    expect(result.current.error?.message).toBe('offline')

    act(() => result.current.retry())

    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
