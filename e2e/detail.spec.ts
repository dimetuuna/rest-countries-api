import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('home card opens the country detail page', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('link', { name: /Germany/ }).click()

  await expect(page).toHaveURL(/\/country\/DEU$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Germany')
  await expect(page.getByRole('link', { name: 'France' })).toBeVisible()
})

test('border chip navigates to the neighbouring country', async ({ page }) => {
  await page.goto('/country/BEL')

  await page.getByRole('link', { name: 'France' }).click()

  await expect(page).toHaveURL(/\/country\/FRA$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('France')
})

test('country without borders shows None', async ({ page }) => {
  await page.goto('/country/FJI')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Fiji')
  await expect(page.getByText('None')).toBeVisible()
})

test('directly loaded detail page returns home on Back', async ({ page }) => {
  await page.goto('/country/FJI')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Fiji')

  await page.getByRole('button', { name: 'Back' }).click()

  await expect(page).toHaveURL(/\/$/)
  await expect(page.locator('.country-card')).toHaveCount(250)
})

test('unknown code shows the not found page', async ({ page }) => {
  await page.goto('/country/XXX')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Country not found')
  await expect(page.getByRole('link', { name: 'Back to all countries' })).toBeVisible()
})

test('detail page has no accessibility violations', async ({ page }) => {
  await page.goto('/country/BEL')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Belgium')

  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})

test('detail page without borders has no accessibility violations', async ({ page }) => {
  await page.goto('/country/FJI')
  await expect(page.getByText('None')).toBeVisible()

  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})

test('not found page has no accessibility violations', async ({ page }) => {
  await page.goto('/country/XXX')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Country not found')

  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})

test('unknown route renders the generic not found page', async ({ page }) => {
  await page.goto('/not-a-route')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found')
})
