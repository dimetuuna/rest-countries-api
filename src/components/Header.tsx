import { Link } from 'react-router-dom'
import { ThemeToggle } from './ThemeToggle'
import './Header.css'

export function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <p className="site-header__title">
          <Link to="/">Where in the world?</Link>
        </p>
        <ThemeToggle />
      </div>
    </header>
  )
}
