import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Country, RawCountry } from '../types'
import { normalizeCountry } from '../lib/normalize'
import { Flag } from './Flag'

function makeCountry(alpha3Code: string, name: string, svg: string): Country {
  const raw: RawCountry = {
    name,
    nativeName: name,
    topLevelDomain: ['.xx'],
    alpha2Code: alpha3Code.slice(0, 2),
    alpha3Code,
    region: 'Europe',
    subregion: 'Western Europe',
    population: 1,
    languages: [],
    flags: { svg, png: svg },
  }
  return normalizeCountry(raw)
}

describe('Flag', () => {
  it('stays hidden after a failed load, but recovers on a new country', () => {
    const belgium = makeCountry('BEL', 'Belgium', 'https://flagcdn.com/be.svg')
    const france = makeCountry('FRA', 'France', 'https://flagcdn.com/fr.svg')

    const { container, rerender } = render(<Flag country={belgium} />)
    const firstImage = container.querySelector('img')!

    firstImage.dispatchEvent(new Event('error'))
    expect(firstImage.dataset.failed).toBe('true')

    rerender(<Flag country={france} />)
    const secondImage = container.querySelector('img')!

    expect(secondImage).not.toBe(firstImage)
    expect(secondImage.dataset.failed).toBeUndefined()
    expect(secondImage.getAttribute('src')).toBe('https://flagcdn.com/fr.svg')
  })
})
