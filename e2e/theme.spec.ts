import { expect, test } from '@playwright/test'

test('theme toggle persists across reloads', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')

  await page.getByRole('button', { name: 'Dark Mode' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

  await page.reload()

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await expect(page.getByRole('button', { name: 'Dark Mode' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
})

test('stored theme is applied before the app bundle executes', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('theme', 'dark')
  })

  let release: () => void = () => {}
  const gate = new Promise<void>((resolve) => {
    release = resolve
  })
  await page.route('**/assets/*.js', async (route) => {
    await gate
    await route.continue()
  })

  await page.goto('/', { waitUntil: 'commit' })
  await page.waitForFunction(() => document.documentElement.dataset.theme !== undefined)

  // React has not run yet: this proves the inline head script did the work.
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await expect(page.locator('#root')).toBeEmpty()

  release()
  await expect(page.locator('.country-card').first()).toBeVisible()
})
