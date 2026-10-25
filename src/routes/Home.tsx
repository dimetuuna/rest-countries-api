import { useDeferredValue, useMemo, useState } from 'react'
import { CountryGrid } from '../components/CountryGrid'
import { EmptyState } from '../components/EmptyState'
import { ErrorState } from '../components/ErrorState'
import { LoadingState } from '../components/LoadingState'
import { RegionFilter } from '../components/RegionFilter'
import { SearchField } from '../components/SearchField'
import { useCountries } from '../hooks/useCountries'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { filterCountries, getRegions } from '../lib/selectors'
import './Home.css'

export function Home() {
  const { countries, status, error, retry } = useCountries()
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState<string | null>(null)

  useDocumentTitle('Where in the world?')

  const deferredQuery = useDeferredValue(query)
  const regions = useMemo(() => getRegions(countries), [countries])
  const visible = useMemo(
    () => filterCountries(countries, deferredQuery, region),
    [countries, deferredQuery, region],
  )

  const clearFilters = () => {
    setQuery('')
    setRegion(null)
  }

  return (
    <main className="home">
      <div className="container">
        <h1 className="visually-hidden">All countries</h1>

        <div className="home__controls">
          <SearchField value={query} onChange={setQuery} />
          <RegionFilter regions={regions} value={region} onChange={setRegion} />
        </div>

        {status === 'loading' && <LoadingState />}

        {status === 'error' && (
          <ErrorState message={error?.message ?? 'Unknown error'} onRetry={retry} />
        )}

        {status === 'success' &&
          (visible.length > 0 ? (
            <CountryGrid countries={visible} />
          ) : (
            <EmptyState onClear={clearFilters} />
          ))}

        {status === 'success' && (
          <p className="visually-hidden" role="status">
            {visible.length} {visible.length === 1 ? 'country' : 'countries'} found
          </p>
        )}
      </div>
    </main>
  )
}
