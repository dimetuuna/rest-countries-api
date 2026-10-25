import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { BackButton } from '../components/BackButton'
import { BorderLinks } from '../components/BorderLinks'
import { ErrorState } from '../components/ErrorState'
import { Flag } from '../components/Flag'
import { LoadingState } from '../components/LoadingState'
import { useCountries } from '../hooks/useCountries'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { formatPopulation } from '../lib/format'
import { buildCountryIndex, resolveBorders } from '../lib/selectors'
import { NotFound } from './NotFound'
import './CountryDetail.css'

function joinOrDash(values: string[]): string {
  return values.length > 0 ? values.join(', ') : '—'
}

export function CountryDetail() {
  const { code = '' } = useParams()
  const { countries, status, error, retry } = useCountries()

  const index = useMemo(() => buildCountryIndex(countries), [countries])
  const country = index.get(code.trim().toUpperCase())

  const pageTitle =
    status === 'error'
      ? 'Error — Where in the world?'
      : status === 'loading'
        ? 'Loading country — Where in the world?'
        : country
          ? `${country.name} — Where in the world?`
          : 'Country not found — Where in the world?'

  useDocumentTitle(pageTitle)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [code])

  if (status === 'loading') {
    return (
      <main className="country-detail">
        <div className="container">
          <BackButton />
          <h1 className="visually-hidden">Country details</h1>
          <LoadingState />
        </div>
      </main>
    )
  }

  if (status === 'error') {
    return (
      <main className="country-detail">
        <div className="container">
          <BackButton />
          <h1 className="visually-hidden">Country details</h1>
          <ErrorState message={error?.message ?? 'Unknown error'} onRetry={retry} />
        </div>
      </main>
    )
  }

  if (!country) {
    return <NotFound />
  }

  const borders = resolveBorders(country, index)

  return (
    <main className="country-detail">
      <div className="container">
        <BackButton />

        <article className="detail">
          <div className="detail__media">
            <Flag country={country} eager />
          </div>

          <div className="detail__content">
            <h1 className="detail__name">{country.name}</h1>

            <div className="detail__facts">
              <dl className="detail__list">
                <div className="detail__fact">
                  <dt>Native Name:</dt>
                  <dd>{country.nativeName}</dd>
                </div>
                <div className="detail__fact">
                  <dt>Population:</dt>
                  <dd>{formatPopulation(country.population)}</dd>
                </div>
                <div className="detail__fact">
                  <dt>Region:</dt>
                  <dd>{country.region}</dd>
                </div>
                <div className="detail__fact">
                  <dt>Sub Region:</dt>
                  <dd>{country.subregion}</dd>
                </div>
                <div className="detail__fact">
                  <dt>Capital:</dt>
                  <dd>{country.capital || '—'}</dd>
                </div>
              </dl>

              <dl className="detail__list">
                <div className="detail__fact">
                  <dt>Top Level Domain:</dt>
                  <dd>{joinOrDash(country.topLevelDomain)}</dd>
                </div>
                <div className="detail__fact">
                  <dt>Currencies:</dt>
                  <dd>{joinOrDash(country.currencies.map((currency) => currency.name))}</dd>
                </div>
                <div className="detail__fact">
                  <dt>Languages:</dt>
                  <dd>{joinOrDash(country.languages.map((language) => language.name))}</dd>
                </div>
              </dl>
            </div>

            <div className="detail__borders">
              <h2 className="detail__borders-title">Border Countries:</h2>
              <BorderLinks borders={borders} />
            </div>
          </div>
        </article>
      </div>
    </main>
  )
}
