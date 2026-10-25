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

interface State {
  countries: Country[]
  status: CountriesStatus
  error: Error | null
}

const initialState: State = { countries: [], status: 'loading', error: null }

export function useCountries(): UseCountriesResult {
  const [state, setState] = useState<State>(initialState)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false

    getCountries()
      .then((countries) => {
        if (cancelled) return
        setState({ countries, status: 'success', error: null })
      })
      .catch((cause: unknown) => {
        if (cancelled) return
        const error = cause instanceof Error ? cause : new Error(String(cause))
        setState({ countries: [], status: 'error', error })
      })

    return () => {
      cancelled = true
    }
  }, [attempt])

  const retry = useCallback(() => {
    resetCountriesCache()
    setState(initialState)
    setAttempt((current) => current + 1)
  }, [])

  return { ...state, retry }
}
