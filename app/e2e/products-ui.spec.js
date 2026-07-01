import { test, expect } from '@playwright/test'

test('トップの相談入力からコンシェルジュへ遷移できる', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('どんな相手に、どんなギフト？').fill('予算内で彼女に喜ばれるギフト')
  await page.getByRole('button', { name: 'AIに相談する' }).click()
  await expect(page).toHaveURL(/\/concierge\?message=/)
})

test('トップの困りごと選択だけでコンシェルジュ提案まで進める', async ({ page }) => {
  await page.route('**/functions/v1/concierge', (route) => route.abort())
  await page.goto('/')
  await page.getByRole('button', { name: '母' }).click()
  await page.getByRole('button', { name: '香りが苦手' }).click()
  await page.getByRole('button', { name: '3,000円以内' }).click()
  await page.getByRole('button', { name: 'この条件で相談する' }).click()

  await expect(page).toHaveURL(/\/concierge\?message=.*auto=1/)
  await expect(page.getByLabel('相談文')).toHaveValue(/母に贈るギフト/)
  await expect(page.getByText('AIが混み合っています。定番ギフト候補を表示します。')).toBeVisible()
  await expect(page.locator('.recommendation-card')).toHaveCount(3)
})

test('商品一覧は36件表示され、カテゴリで絞り込める', async ({ page }) => {
  await page.goto('/products')
  await expect(page.locator('.product-card')).toHaveCount(36)

  await page.getByLabel('カテゴリ').selectOption('スキンケア')
  await expect(page.locator('.product-card')).toHaveCount(6)
  await expect(page.locator('.products-toolbar')).toContainText('6 / 36 件')
})
