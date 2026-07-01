import { test, expect } from '@playwright/test'

test('トップの相談入力からコンシェルジュへ遷移できる', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('どんな相手に、どんなギフト？').fill('予算内で彼女に喜ばれるギフト')
  await page.getByRole('button', { name: 'AIに相談する' }).click()
  await expect(page).toHaveURL(/\/concierge\?message=/)
})

test('商品一覧は36件表示され、カテゴリで絞り込める', async ({ page }) => {
  await page.goto('/products')
  await expect(page.locator('.product-card')).toHaveCount(36)

  await page.getByLabel('カテゴリ').selectOption('スキンケア')
  await expect(page.locator('.product-card')).toHaveCount(6)
  await expect(page.locator('.products-toolbar')).toContainText('6 / 36 件')
})
