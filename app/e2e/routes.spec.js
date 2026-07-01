import { test, expect } from '@playwright/test'

// 全 9 ルートが 404 にならず開くことを確認するスモークテスト
const routes = [
  { path: '/',                         label: /3つのギフト/ },
  { path: '/products',                 label: '商品一覧' },
  { path: '/products/skincare-001',    label: 'モイストバランス ローション' },
  { path: '/concierge',                label: 'Concierge' },
  { path: '/cart',                     label: 'カートを確認' },
  { path: '/checkout',                 label: 'お客様情報の入力' },
  { path: '/complete',                 label: 'ご注文ありがとうございます' },
  { path: '/orders',                   label: 'Orders' },
  { path: '/admin-demo',               label: '店舗インサイト' },
]

for (const { path, label } of routes) {
  test(`${label} (${path}) が開く`, async ({ page }) => {
    await page.goto(path)
    await expect(page.locator('h1')).toHaveText(label)
  })
}
