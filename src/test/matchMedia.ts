import { vi } from 'vitest'

interface MatchMediaController {
  setMatches: (matches: boolean) => void
  listenerCount: () => number
}

/** jsdom has no matchMedia; this gives tests a controllable one. */
export function installMatchMedia(initialMatches: boolean): MatchMediaController {
  const listeners = new Set<(event: MediaQueryListEvent) => void>()
  const state = { matches: initialMatches }

  const mediaQueryList = {
    get matches() {
      return state.matches
    },
    media: '(prefers-color-scheme: dark)',
    onchange: null,
    addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
      listeners.add(listener)
    },
    removeEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
      listeners.delete(listener)
    },
    addListener: (listener: (event: MediaQueryListEvent) => void) => listeners.add(listener),
    removeListener: (listener: (event: MediaQueryListEvent) => void) => listeners.delete(listener),
    dispatchEvent: () => false,
  }

  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => mediaQueryList as unknown as MediaQueryList),
  )

  return {
    setMatches(matches: boolean) {
      state.matches = matches
      listeners.forEach((listener) => listener({ matches } as MediaQueryListEvent))
    },
    listenerCount: () => listeners.size,
  }
}
