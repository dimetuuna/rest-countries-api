import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// jsdom does not implement scrolling; scroll behaviour is asserted where it matters.
Object.defineProperty(window, 'scrollTo', { value: vi.fn(), writable: true })
