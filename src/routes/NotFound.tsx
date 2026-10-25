import { Link } from 'react-router-dom'
import './NotFound.css'

export function NotFound() {
  return (
    <main className="not-found">
      <div className="container">
        <h1>Country not found</h1>
        <p>That page does not exist or the country code is unknown.</p>
        <Link className="not-found__link" to="/">
          Back to all countries
        </Link>
      </div>
    </main>
  )
}
