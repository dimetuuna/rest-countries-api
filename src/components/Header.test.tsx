import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { ThemeProvider } from '../hooks/useTheme'
import { Header } from './Header'
import { installMatchMedia } from '../test/matchMedia'

describe('Header', () => {
  it('shows the site title as a link home and the theme toggle', () => {
    installMatchMedia(false)
    document.documentElement.dataset.theme = 'light'

    render(
      <MemoryRouter>
        <ThemeProvider>
          <Header />
        </ThemeProvider>
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Where in the world?' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('banner')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Dark Mode' })).toBeVisible()
  })
})
