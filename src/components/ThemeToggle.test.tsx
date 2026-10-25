import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { installMatchMedia } from '../test/matchMedia'
import { ThemeProvider } from '../hooks/useTheme'
import { ThemeToggle } from './ThemeToggle'

const wrapper = ({ children }: { children: ReactNode }) => <ThemeProvider>{children}</ThemeProvider>

describe('ThemeToggle', () => {
  it('renders a toggle button labelled Dark Mode, unpressed in light theme', () => {
    installMatchMedia(false)
    document.documentElement.dataset.theme = 'light'

    render(<ThemeToggle />, { wrapper })

    const button = screen.getByRole('button', { name: 'Dark Mode' })
    expect(button).toHaveAttribute('aria-pressed', 'false')
  })

  it('presses the toggle and applies the dark theme when clicked', async () => {
    installMatchMedia(false)
    document.documentElement.dataset.theme = 'light'
    const user = userEvent.setup()

    render(<ThemeToggle />, { wrapper })
    const button = screen.getByRole('button', { name: 'Dark Mode' })

    await user.click(button)

    expect(button).toHaveAttribute('aria-pressed', 'true')
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(button).toHaveAccessibleName('Dark Mode')
  })

  it('keeps the same accessible name as the visible text', () => {
    installMatchMedia(false)
    document.documentElement.dataset.theme = 'light'
    render(<ThemeToggle />, { wrapper })

    expect(screen.getByRole('button', { name: 'Dark Mode' })).toHaveTextContent('Dark Mode')
  })
})
