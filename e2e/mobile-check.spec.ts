import { expect, test } from '@playwright/test'

test.use({ viewport: { width: 390, height: 844 }, colorScheme: 'dark', isMobile: true, hasTouch: true })

test('mobile light mode is actually light', async ({ page }) => {
  await page.goto('http://localhost:4173/')
  await page.getByRole('button', { name: 'Light Mode' }).click()
  await page.waitForTimeout(200)
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
  const htmlBg = await page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor)
  const meta = await page.evaluate(() => (document.querySelector('meta[name="color-scheme"]') as HTMLMetaElement | null)?.content)
  console.log('bg:', bg, 'htmlBg:', htmlBg, 'meta:', meta)
  expect(bg).toBe('rgb(252, 252, 252)')
  expect(htmlBg).toBe('rgb(252, 252, 252)')
})