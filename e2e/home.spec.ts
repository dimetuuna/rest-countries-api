import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('lists all 250 countries', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('.country-card')).toHaveCount(250)
  await expect(page.getByRole('heading', { level: 2 }).first()).toBeVisible()
})

test('search and region filter narrow the grid together', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.country-card')).toHaveCount(250)

  await page.getByRole('searchbox').fill('ger')
  await page.getByRole('combobox').selectOption('Europe')

  await expect(page.locator('.country-card')).toHaveCount(1)
  await expect(page.getByRole('heading', { level: 2 })).toHaveText('Germany')
})

test('search ignores diacritics', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('searchbox').fill('aland islands')

  await expect(page.locator('.country-card')).toHaveCount(1)
  await expect(page.getByRole('heading', { level: 2 })).toHaveText('Åland Islands')
})

test('empty state clears both filters', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('searchbox').fill('zzzz')
  await page.getByRole('combobox').selectOption('Europe')
  await expect(page.getByText('No countries found')).toBeVisible()

  await page.getByRole('button', { name: 'Clear filters' }).click()

  await expect(page.locator('.country-card')).toHaveCount(250)
  await expect(page.getByRole('searchbox')).toHaveValue('')
  await expect(page.getByRole('combobox')).toHaveValue('')
})

test('home has no accessibility violations in either theme', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.country-card')).toHaveCount(250)

  const light = await new AxeBuilder({ page }).analyze()
  expect(light.violations).toEqual([])

  await page.getByRole('button', { name: 'Dark Mode' }).click()
  const dark = await new AxeBuilder({ page }).analyze()
  expect(dark.violations).toEqual([])
})

test('serves a meta description and a valid robots.txt', async ({ page, request }) => {
  await page.goto('/')

  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /250 countries/)

  const robots = await request.get('/robots.txt')
  expect(robots.status()).toBe(200)
  expect(await robots.text()).toContain('User-agent: *')
})

test('grid survives an unreachable flag CDN', async ({ page }) => {
  await page.route('**flagcdn.com/**', (route) => route.abort())

  await page.goto('/')

  await expect(page.locator('.country-card')).toHaveCount(250)
  const flagBox = await page.locator('.flag').first().boundingBox()
  expect(flagBox?.height ?? 0).toBeGreaterThan(100)
})

test('error state is accessible and retries successfully', async ({ page }) => {
  let offline = true
  await page.route('**/data.json', (route) => (offline ? route.abort() : route.continue()))

  await page.goto('/')
  await expect(page.getByRole('alert')).toBeVisible()

  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])

  offline = false
  await page.getByRole('button', { name: 'Retry' }).click()

  await expect(page.locator('.country-card')).toHaveCount(250)
})
