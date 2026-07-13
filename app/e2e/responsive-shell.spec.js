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

test('モバイルのカート商品が読みやすいレイアウトで収まる', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.addInitScript(() => {
    localStorage.setItem('lumiere-cart', JSON.stringify([
      { productId: 'skincare-003', quantity: 1, source: 'browse' },
    ]))
  })
  await page.goto('/cart')

  const line = page.locator('.cart-line')
  const title = line.getByRole('heading', { name: 'ナイトリペア クリーム' })
  await expect(line).toBeVisible()
  await expect(title).toBeVisible()

  const [lineBox, titleBox, imageBox] = await Promise.all([
    line.boundingBox(),
    title.boundingBox(),
    line.locator('.cart-line-image').boundingBox(),
  ])

  expect(lineBox.x + lineBox.width).toBeLessThanOrEqual(390)
  expect(titleBox.width).toBeGreaterThan(100)
  expect(imageBox.width).toBe(88)
  expect(imageBox.height).toBe(88)
})

test('モバイルの注文履歴が1列で読みやすく収まる', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.addInitScript(() => {
    localStorage.setItem('lumiere-orders', JSON.stringify([{
      id: 'DEMO-20260714-504',
      orderedAt: '2026-07-14T00:01:41+09:00',
      items: [
        { productId: 'skincare-003', name: 'ナイトリペア クリーム', quantity: 1 },
        { productId: 'skincare-002', name: 'クリアコンフォート ジェル', quantity: 1 },
      ],
      total: 7400,
      fromAi: false,
    }]))
  })
  await page.goto('/orders')

  const card = page.locator('.order-card')
  const item = card.getByText('ナイトリペア クリーム × 1')
  await expect(card).toBeVisible()
  await expect(item).toBeVisible()

  const [cardBox, itemBox] = await Promise.all([card.boundingBox(), item.boundingBox()])
  expect(cardBox.x + cardBox.width).toBeLessThanOrEqual(390)
  expect(itemBox.width).toBeGreaterThan(150)
  expect(itemBox.height).toBeLessThan(80)
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
