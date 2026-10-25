import { useCallback, useEffect, useState } from 'react'
import type { Country } from '../types'
import { getCountries, resetCountriesCache } from '../lib/countries'

export type CountriesStatus = 'loading' | 'success' | 'error'

export interface UseCountriesResult {
  countries: Country[]
  status: CountriesStatus
  error: Error | null
  retry: () => void
}

export function useCountries(): UseCountriesResult {
  const [countries, setCountries] = useState<Country[]>([])
  const [status, setStatus] = useState<CountriesStatus>('loading')
  const [error, setError] = useState<Error | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false

    setStatus('loading')
    setError(null)

    getCountries()
      .then((result) => {
        if (cancelled) return
        setCountries(result)
        setStatus('success')
      })
      .catch((cause: unknown) => {
        if (cancelled) return
        setError(cause instanceof Error ? cause : new Error(String(cause)))
        setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [attempt])

  const retry = useCallback(() => {
    resetCountriesCache()
    setAttempt((current) => current + 1)
  }, [])

  return { countries, status, error, retry }
}
