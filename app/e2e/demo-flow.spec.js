import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => {
    localStorage.clear()
    sessionStorage.clear()
  })
})

test('コンシェルジュで推薦3件とフォールバック文言が表示される', async ({ page }) => {
  await page.route('**/functions/v1/concierge', (route) => route.abort())
  await page.goto('/concierge')
  await page.getByLabel('相談文').fill('予算5,000円以内で彼女に喜ばれるギフト')
  await page.getByRole('button', { name: 'AIに相談する' }).click()

  await expect(page.getByText('AIが混み合っています。定番ギフト候補を表示します。')).toBeVisible()
  await expect(page.locator('.recommendation-card')).toHaveCount(3)
  await expect(page.getByText('AIが選んだ理由：').first()).toBeVisible()
  await expect(page.getByText('渡しやすいポイント：').first()).toBeVisible()
  await expect(page.getByText('注意したい点：').first()).toBeVisible()
})

test('商品詳細からカート、注文完了、注文履歴まで通る', async ({ page }) => {
  await page.goto('/products/skincare-001')
  await page.getByRole('button', { name: 'カートに入れる' }).click()

  await expect(page).toHaveURL(/\/cart/)
  await expect(page.getByText('モイストバランス ローション')).toBeVisible()
  await page.getByRole('link', { name: /お客様情報/ }).click()

  await page.getByLabel('お名前').fill('山田 太郎')
  await page.getByLabel('メールアドレス').fill('demo@example.com')
  await page.getByRole('button', { name: /注文を確定する/ }).click()

  await expect(page).toHaveURL(/\/complete/)
  await expect(page.getByText(/DEMO-\d{8}-\d{3}/)).toBeVisible()

  await page.getByRole('link', { name: '注文履歴を見る' }).click()
  await expect(page.getByText('モイストバランス ローション × 1')).toBeVisible()
})

test('商品一覧でAI並べ替えボタンがフォールバックしても表示を維持する', async ({ page }) => {
  await page.route('**/functions/v1/recommend-products', (route) => route.abort())
  await page.goto('/products')
  await page.getByPlaceholder('例: 彼女 高見え 保湿').fill('彼女 高見え')
  await page.getByRole('button', { name: 'AI でおすすめ順に並べ替え' }).click()

  await expect(page.getByText('AIが混み合っています。通常検索順で表示します。')).toBeVisible()
  await expect(page.locator('.product-card').first()).toBeVisible()
})

test('admin-demo に相談と注文の集計が反映される', async ({ page }) => {
  await page.route('**/functions/v1/concierge', (route) => route.abort())
  await page.goto('/concierge')
  await page.getByLabel('相談文').fill('彼女への誕生日プレゼント 予算5,000円以内')
  await page.getByRole('button', { name: 'AIに相談する' }).click()
  await expect(page.locator('.recommendation-card')).toHaveCount(3)
  await page.locator('.recommendation-card').first().getByRole('button', { name: '追加' }).click()

  await page.goto('/checkout')
  await page.getByLabel('お名前').fill('管理画面 確認')
  await page.getByLabel('メールアドレス').fill('admin-demo@example.com')
  await page.getByRole('button', { name: /注文を確定する/ }).click()

  await page.goto('/admin-demo')
  await expect(page.getByText('今日の相談件数')).toBeVisible()
  await expect(page.getByText('AI 経由注文数')).toBeVisible()
  await expect(page.getByText('1件').first()).toBeVisible()
  await expect(page.getByText('彼女')).toBeVisible()
  await expect(page.getByText('AI 改善提案')).toBeVisible()
})
