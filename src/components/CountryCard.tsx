import { Link } from 'react-router-dom'
import type { Country } from '../types'
import { formatPopulation } from '../lib/format'
import { Flag } from './Flag'
import './CountryCard.css'

interface CountryCardProps {
  country: Country
  eager?: boolean
}

export function CountryCard({ country, eager = false }: CountryCardProps) {
  return (
    <li className="country-card">
      <Link className="country-card__link" to={`/country/${country.alpha3Code}`}>
        <Flag country={country} eager={eager} />
        <div className="country-card__body">
          <h2 className="country-card__name">{country.name}</h2>
          <dl className="country-card__facts">
            <div className="country-card__fact">
              <dt>Population:</dt>
              <dd>{formatPopulation(country.population)}</dd>
            </div>
            <div className="country-card__fact">
              <dt>Region:</dt>
              <dd>{country.region}</dd>
            </div>
            <div className="country-card__fact">
              <dt>Capital:</dt>
              <dd>{country.capital || '—'}</dd>
            </div>
          </dl>
        </div>
      </Link>
    </li>
  )
}
