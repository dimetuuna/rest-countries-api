import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { NotFound } from './NotFound'

describe('NotFound', () => {
  it('uses generic copy for an unmatched route', () => {
    render(
      <MemoryRouter>
        <NotFound generic />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Back to all countries' })).toHaveAttribute('href', '/')
  })

  it('uses country copy for an unknown country code', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { level: 1, name: 'Country not found' })).toBeVisible()
  })
})
