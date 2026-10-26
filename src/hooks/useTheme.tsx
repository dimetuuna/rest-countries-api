import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

const STORAGE_KEY = 'theme'
const DARK_QUERY = '(prefers-color-scheme: dark)'

const ThemeContext = createContext<ThemeContextValue | null>(null)

function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'dark' || stored === 'light' ? stored : null
  } catch {
    return null
  }
}

function readDocumentTheme(): Theme | null {
  const attribute = document.documentElement.dataset.theme
  return attribute === 'dark' || attribute === 'light' ? attribute : null
}

function systemTheme(): Theme {
  return window.matchMedia?.(DARK_QUERY).matches ? 'dark' : 'light'
}

function initialTheme(): Theme {
  // The inline script in index.html has already resolved this before first paint.
  return readDocumentTheme() ?? readStoredTheme() ?? systemTheme()
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(initialTheme)
  const [hasExplicitChoice, setHasExplicitChoice] = useState(() => readStoredTheme() !== null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme

    // Keep the browser's own chrome (address bar, overscroll canvas, native
    // form controls) in sync with the app theme. On mobile browsers the
    // static `light dark` meta can otherwise leave the canvas dark when the
    // OS is in dark mode, even though the page itself is light.
    const colorScheme = theme === 'dark' ? 'dark' : 'light'
    const colorSchemeMeta = document.querySelector('meta[name="color-scheme"]')
    if (colorSchemeMeta) colorSchemeMeta.setAttribute('content', colorScheme)

    let themeColorMeta = document.querySelector('meta[name="theme-color"]')
    if (!themeColorMeta) {
      themeColorMeta = document.createElement('meta')
      themeColorMeta.setAttribute('name', 'theme-color')
      document.head.appendChild(themeColorMeta)
    }
    themeColorMeta.setAttribute('content', theme === 'dark' ? 'hsl(207, 26%, 17%)' : 'hsl(0, 0%, 99%)')
  }, [theme])

  useEffect(() => {
    if (hasExplicitChoice) return

    const query = window.matchMedia?.(DARK_QUERY)
    if (!query) return

    const handleChange = (event: MediaQueryListEvent) => {
      setTheme(event.matches ? 'dark' : 'light')
    }

    query.addEventListener('change', handleChange)
    return () => query.removeEventListener('change', handleChange)
  }, [hasExplicitChoice])

  const toggleTheme = useCallback(() => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    setHasExplicitChoice(true)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Storage can be unavailable (private mode, sandboxed iframe); the theme still applies.
    }
  }, [theme])

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used inside a ThemeProvider')
  }
  return context
}
