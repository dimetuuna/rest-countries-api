import { Link } from 'react-router-dom'
import type { BorderCountry } from '../types'
import './BorderLinks.css'

export function BorderLinks({ borders }: { borders: BorderCountry[] }) {
  if (borders.length === 0) {
    return <p className="border-links__none">None</p>
  }

  return (
    <ul className="border-links" role="list">
      {borders.map((border) => (
        <li key={border.code}>
          <Link className="border-links__item" to={`/country/${border.code}`}>
            {border.name}
          </Link>
        </li>
      ))}
    </ul>
  )
}
