import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { RawCountry } from '../types'
import { resetCountriesCache } from '../lib/countries'
import { CountryDetail } from './CountryDetail'

const fixture: RawCountry[] = [
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
    borders: ['FRA', 'DEU', 'NLD'],
    currencies: [{ code: 'EUR', name: 'Euro', symbol: '€' }],
    languages: [
      { iso639_1: 'nl', iso639_2: 'nld', name: 'Dutch', nativeName: 'Nederlands' },
      { iso639_1: 'fr', iso639_2: 'fra', name: 'French', nativeName: 'Français' },
      { iso639_1: 'de', iso639_2: 'deu', name: 'German', nativeName: 'Deutsch' },
    ],
    flags: { svg: 'https://flagcdn.com/be.svg', png: 'https://flagcdn.com/w320/be.png' },
  },
  {
    name: 'France',
    nativeName: 'France',
    topLevelDomain: ['.fr'],
    alpha2Code: 'FR',
    alpha3Code: 'FRA',
    capital: 'Paris',
    region: 'Europe',
    subregion: 'Western Europe',
    population: 67391582,
    borders: ['BEL', 'DEU'],
    currencies: [{ code: 'EUR', name: 'Euro', symbol: '€' }],
    languages: [{ iso639_1: 'fr', iso639_2: 'fra', name: 'French', nativeName: 'Français' }],
    flags: { svg: 'https://flagcdn.com/fr.svg', png: 'https://flagcdn.com/w320/fr.png' },
  },
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
    borders: ['BEL', 'FRA'],
    currencies: [{ code: 'EUR', name: 'Euro', symbol: '€' }],
    languages: [{ iso639_1: 'de', iso639_2: 'deu', name: 'German', nativeName: 'Deutsch' }],
    flags: { svg: 'https://flagcdn.com/de.svg', png: 'https://flagcdn.com/w320/de.png' },
  },
  {
    name: 'Netherlands',
    nativeName: 'Nederland',
    topLevelDomain: ['.nl'],
    alpha2Code: 'NL',
    alpha3Code: 'NLD',
    capital: 'Amsterdam',
    region: 'Europe',
    subregion: 'Western Europe',
    population: 17441139,
    borders: ['BEL', 'DEU'],
    currencies: [{ code: 'EUR', name: 'Euro', symbol: '€' }],
    languages: [{ iso639_1: 'nl', iso639_2: 'nld', name: 'Dutch', nativeName: 'Nederlands' }],
    flags: { svg: 'https://flagcdn.com/nl.svg', png: 'https://flagcdn.com/w320/nl.png' },
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

function renderDetail(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/" element={<p>home stub</p>} />
        <Route path="/country/:code" element={<CountryDetail />} />
        <Route path="*" element={<p>not found stub</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('CountryDetail', () => {
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

  it('renders every field of the country in the URL', async () => {
    renderDetail('/country/BEL')

    expect(await screen.findByRole('heading', { level: 1, name: 'Belgium' })).toBeVisible()
    expect(screen.getByText('België')).toBeVisible()
    expect(screen.getByText('11,319,511')).toBeVisible()
    expect(screen.getByText('Western Europe')).toBeVisible()
    expect(screen.getByText('Brussels')).toBeVisible()
    expect(screen.getByText('.be')).toBeVisible()
    expect(screen.getByText('Euro')).toBeVisible()
    expect(screen.getByText('Dutch, French, German')).toBeVisible()
  })

  it('matches the code case-insensitively', async () => {
    renderDetail('/country/bel')

    expect(await screen.findByRole('heading', { level: 1, name: 'Belgium' })).toBeVisible()
  })

  it('lists border countries as links', async () => {
    renderDetail('/country/BEL')

    expect(await screen.findByRole('link', { name: 'France' })).toHaveAttribute(
      'href',
      '/country/FRA',
    )
    expect(screen.getByRole('link', { name: 'Germany' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Netherlands' })).toBeVisible()
  })

  it('shows None when a country has no borders', async () => {
    renderDetail('/country/FJI')

    expect(await screen.findByRole('heading', { level: 1, name: 'Fiji' })).toBeVisible()
    expect(screen.getByText('None')).toBeVisible()
  })

  it('renders dashes for a country without capital or currencies', async () => {
    renderDetail('/country/ATA')

    expect(await screen.findByRole('heading', { level: 1, name: 'Antarctica' })).toBeVisible()
    expect(screen.getAllByText('—')).toHaveLength(2)
  })

  it('navigates to a bordering country when its link is clicked', async () => {
    const user = userEvent.setup()
    renderDetail('/country/BEL')
    await screen.findByRole('heading', { level: 1, name: 'Belgium' })

    await user.click(screen.getByRole('link', { name: 'France' }))

    await waitFor(() =>
      expect(screen.getByRole('heading', { level: 1, name: 'France' })).toBeVisible(),
    )
  })

  it('shows a not-found message for an unknown code', async () => {
    renderDetail('/country/XXX')

    expect(await screen.findByText('Country not found')).toBeVisible()
    expect(screen.getByRole('link', { name: 'Back to all countries' })).toHaveAttribute('href', '/')
  })

  it('scrolls to the top when opened', async () => {
    renderDetail('/country/BEL')

    await screen.findByRole('heading', { level: 1, name: 'Belgium' })
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
  })

  it('names the document after the country', async () => {
    renderDetail('/country/BEL')

    await screen.findByRole('heading', { level: 1, name: 'Belgium' })
    expect(document.title).toBe('Belgium — Where in the world?')
  })

  it('keeps a heading while the request is failing', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))

    renderDetail('/country/BEL')

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Country details' }),
    ).toBeVisible()
    expect(screen.getByRole('alert')).toBeVisible()
  })

  it('goes home when Back is pressed on a directly loaded detail page', async () => {
    const user = userEvent.setup()
    renderDetail('/country/FJI')
    await screen.findByRole('heading', { level: 1, name: 'Fiji' })

    await user.click(screen.getByRole('button', { name: 'Back' }))

    expect(await screen.findByText('home stub')).toBeVisible()
  })
})
