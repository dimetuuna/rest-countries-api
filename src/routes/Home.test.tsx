import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { RawCountry } from '../types'
import { resetCountriesCache } from '../lib/countries'
import { Home } from './Home'

const fixture: RawCountry[] = [
  {
    name: 'Germany',
    nativeName: 'Deutschland',
    topLevelDomain: ['.de'],
    alpha2Code: 'DE',
    alpha3Code: 'DEU',
    capital: 'Berlin',
    region: 'Europe',
    subregion: 'Western Europe',
    population: 81770900,
    borders: ['FRA'],
    currencies: [{ code: 'EUR', name: 'Euro', symbol: '€' }],
    languages: [{ iso639_1: 'de', iso639_2: 'deu', name: 'German', nativeName: 'Deutsch' }],
    flags: { svg: 'https://flagcdn.com/de.svg', png: 'https://flagcdn.com/w320/de.png' },
  },
  {
    name: 'Belgium',
    nativeName: 'België',
    topLevelDomain: ['.be'],
    alpha2Code: 'BE',
    alpha3Code: 'BEL',
    capital: 'Brussels',
    region: 'Europe',
    subregion: 'Western Europe',
    population: 11319511,
    borders: ['FRA', 'DEU'],
    currencies: [{ code: 'EUR', name: 'Euro', symbol: '€' }],
    languages: [{ iso639_1: 'nl', iso639_2: 'nld', name: 'Dutch', nativeName: 'Nederlands' }],
    flags: { svg: 'https://flagcdn.com/be.svg', png: 'https://flagcdn.com/w320/be.png' },
  },
  {
    name: 'Fiji',
    nativeName: 'Fiji',
    topLevelDomain: ['.fj'],
    alpha2Code: 'FJ',
    alpha3Code: 'FJI',
    capital: 'Suva',
    region: 'Oceania',
    subregion: 'Melanesia',
    population: 896444,
    languages: [{ iso639_1: 'en', iso639_2: 'eng', name: 'English', nativeName: 'English' }],
    flags: { svg: 'https://flagcdn.com/fj.svg', png: 'https://flagcdn.com/w320/fj.png' },
  },
  {
    name: 'Antarctica',
    nativeName: 'Antarctica',
    topLevelDomain: ['.aq'],
    alpha2Code: 'AQ',
    alpha3Code: 'ATA',
    region: 'Polar',
    subregion: 'Antarctica',
    population: 0,
    languages: [{ iso639_1: 'en', iso639_2: 'eng', name: 'English', nativeName: 'English' }],
    flags: { svg: 'https://flagcdn.com/aq.svg', png: 'https://flagcdn.com/w320/aq.png' },
  },
]

function renderHome() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  )
}

function cardNames() {
  return screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)
}

describe('Home', () => {
  beforeEach(() => {
    resetCountriesCache()
    vi.restoreAllMocks()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => fixture,
      } as unknown as Response),
    )
  })

  it('lists every country once loaded', async () => {
    renderHome()

    await waitFor(() => expect(cardNames()).toEqual(['Germany', 'Belgium', 'Fiji', 'Antarctica']))
  })

  it('narrows the grid to names matching the query', async () => {
    const user = userEvent.setup()
    renderHome()
    await waitFor(() => expect(cardNames()).toHaveLength(4))

    await user.type(screen.getByRole('searchbox'), 'ger')

    await waitFor(() => expect(cardNames()).toEqual(['Germany']))
  })

  it('filters by region', async () => {
    const user = userEvent.setup()
    renderHome()
    await waitFor(() => expect(cardNames()).toHaveLength(4))

    await user.selectOptions(screen.getByRole('combobox'), 'Oceania')

    await waitFor(() => expect(cardNames()).toEqual(['Fiji']))
  })

  it('applies query and region together', async () => {
    const user = userEvent.setup()
    renderHome()
    await waitFor(() => expect(cardNames()).toHaveLength(4))

    await user.type(screen.getByRole('searchbox'), 'e')
    await user.selectOptions(screen.getByRole('combobox'), 'Europe')

    await waitFor(() => expect(cardNames()).toEqual(['Germany', 'Belgium']))
  })

  it('announces the result count', async () => {
    const user = userEvent.setup()
    renderHome()
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('4 countries found'))

    await user.type(screen.getByRole('searchbox'), 'ger')

    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('1 country found'))
  })

  it('shows an empty state that clears both filters', async () => {
    const user = userEvent.setup()
    renderHome()
    await waitFor(() => expect(cardNames()).toHaveLength(4))

    await user.type(screen.getByRole('searchbox'), 'zzzz')
    await waitFor(() => expect(screen.getByText('No countries found')).toBeVisible())

    await user.click(screen.getByRole('button', { name: 'Clear filters' }))

    await waitFor(() => expect(cardNames()).toHaveLength(4))
    expect(screen.getByRole('searchbox')).toHaveValue('')
    expect(screen.getByRole('combobox')).toHaveValue('')
  })

  it('links each card to its detail route and keeps flags decorative', async () => {
    renderHome()
    await waitFor(() => expect(cardNames()).toHaveLength(4))

    expect(screen.getByRole('link', { name: /Germany/ })).toHaveAttribute('href', '/country/DEU')

    const images = Array.from(document.querySelectorAll('img'))
    expect(images).toHaveLength(4)
    expect(images.every((image) => image.getAttribute('alt') === '')).toBe(true)
  })

  it('renders a dash for a country with no capital', async () => {
    renderHome()
    await waitFor(() => expect(cardNames()).toHaveLength(4))

    const antarctica = screen.getByRole('link', { name: /Antarctica/ })
    expect(antarctica).toHaveTextContent('Capital:')
    expect(antarctica).toHaveTextContent('—')
  })
})
