import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import './NotFound.css'

interface NotFoundProps {
  /** True for an unmatched route, false for an unknown country code. */
  generic?: boolean
}

export function NotFound({ generic = false }: NotFoundProps) {
  const title = generic ? 'Page not found' : 'Country not found'
  const detail = generic
    ? 'That page does not exist.'
    : 'That country code is not in the dataset.'

  useDocumentTitle(`${title} — Where in the world?`)

  return (
    <main className="not-found">
      <div className="container">
        <h1>{title}</h1>
        <p>{detail}</p>
        <Link className="not-found__link" to="/">
          Back to all countries
        </Link>
      </div>
    </main>
  )
}
