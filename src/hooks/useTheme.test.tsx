import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { installMatchMedia } from '../test/matchMedia'
import { ThemeProvider, useTheme } from './useTheme'

const wrapper = ({ children }: { children: ReactNode }) => <ThemeProvider>{children}</ThemeProvider>

function renderTheme() {
  return renderHook(() => useTheme(), { wrapper })
}

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    delete document.documentElement.dataset.theme
    vi.restoreAllMocks()
    installMatchMedia(false)
  })

  it('toggles the document theme and persists the choice', () => {
    const { result } = renderTheme()

    expect(result.current.theme).toBe('light')

    act(() => result.current.toggleTheme())

    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('adopts the theme the inline script already applied', () => {
    document.documentElement.dataset.theme = 'dark'
    localStorage.setItem('theme', 'dark')

    const { result } = renderTheme()

    expect(result.current.theme).toBe('dark')
  })

  it('follows the system preference when the user never chose', () => {
    const media = installMatchMedia(false)
    const { result } = renderTheme()

    expect(result.current.theme).toBe('light')

    act(() => media.setMatches(true))

    expect(result.current.theme).toBe('dark')
  })

  it('stops following the system after an explicit toggle', () => {
    const media = installMatchMedia(false)
    const { result } = renderTheme()

    act(() => result.current.toggleTheme())
    expect(result.current.theme).toBe('dark')

    act(() => media.setMatches(false))

    expect(result.current.theme).toBe('dark')
    expect(media.listenerCount()).toBe(0)
  })
})
