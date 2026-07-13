import { test, expect } from '@playwright/test'

const representativeRoutes = ['/', '/products', '/concierge', '/cart', '/checkout', '/admin-demo', '/about']

test('モバイルメニューから主要画面へ移動できる', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  const toggle = page.getByRole('button', { name: 'メニューを開く' })
  await expect(toggle).toBeVisible()
  await toggle.click()

  const navigation = page.getByRole('navigation', { name: 'モバイルサイトナビゲーション' })
  await expect(navigation).toBeVisible()
  await expect(navigation.getByRole('link', { name: '商品を見る' })).toBeVisible()
  await expect(navigation.getByRole('link', { name: '店舗インサイト' })).toBeVisible()
  await expect(navigation.getByRole('link', { name: 'AIに相談' })).toBeVisible()

  await navigation.getByRole('link', { name: '商品を見る' }).click()
  await expect(page).toHaveURL(/\/products$/)
  await expect(navigation).toBeHidden()
})

test('ブラウザがダーク設定でもサイトのライトテーマを維持する', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/')

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  const colorScheme = await page.locator('html').evaluate((element) => getComputedStyle(element).colorScheme)
  expect(colorScheme).toBe('light')
})

for (const width of [390, 820, 1440]) {
  for (const path of representativeRoutes) {
    test(`${width}px の ${path} でページ全体の横はみ出しがない`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(path)
      await expect(page.locator('.site-header')).toBeVisible()
      await expect(page.locator('.site-footer')).toBeVisible()

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      expect(overflow).toBeLessThanOrEqual(1)
    })
  }
}
