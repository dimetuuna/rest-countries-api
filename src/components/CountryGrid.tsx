import type { Country } from '../types'
import { CountryCard } from './CountryCard'
import './CountryGrid.css'

export function CountryGrid({ countries }: { countries: Country[] }) {
  return (
    <ul className="country-grid" role="list">
      {countries.map((country, index) => (
        <CountryCard key={country.alpha3Code} country={country} eager={index < 8} />
      ))}
    </ul>
  )
}
