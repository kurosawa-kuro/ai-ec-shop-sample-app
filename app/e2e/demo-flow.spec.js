import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => {
    localStorage.clear()
    sessionStorage.clear()
  })
})

test('コンシェルジュで推薦3件とフォールバック文言が表示される', async ({ page }) => {
  let requestBody
  await page.route('**/functions/v1/concierge', (route) => {
    requestBody = route.request().postDataJSON()
    return route.abort()
  })
  await page.goto('/concierge')
  await page.getByLabel('相談文').fill('予算5,000円以内で彼女に喜ばれるギフト')
  await page.getByRole('button', { name: 'AIに相談する' }).click()

  await expect(page.getByText('AIが混み合っています。定番ギフト候補を表示します。')).toBeVisible()
  await expect(page.locator('.recommendation-card')).toHaveCount(3)
  await expect(page.getByText('AIが選んだ理由：').first()).toBeVisible()
  await expect(page.getByText('渡しやすいポイント：').first()).toBeVisible()
  await expect(page.getByText('注意したい点：').first()).toBeVisible()
  expect(requestBody.candidates[0]).toEqual(expect.objectContaining({
    id: 'skincare-001',
    name: 'モイストバランス ローション',
    category: 'スキンケア',
    price: 3200,
    tags: expect.arrayContaining(['敏感肌向け']),
    giftFor: expect.arrayContaining(['友人']),
  }))
})

test('コンシェルジュ応答に無効IDが混ざっても理由を商品に対応させる', async ({ page }) => {
  await page.route('**/functions/v1/concierge', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      summary: 'テスト提案です',
      recommendations: [
        {
          productId: 'missing-999',
          reason: '無効IDの商品理由です',
          easyToGive: '無効IDの渡しやすさです',
          caution: '無効IDの注意点です',
          fitFor: '無効IDの相手条件です',
        },
        {
          productId: 'skincare-001',
          reason: '敏感肌向けタグがあり、肌が弱い相手にも検討しやすいです。',
          easyToGive: '軽い日常ケアとして渡しやすいです。',
          caution: '肌に合うかは個人差があるため、成分を確認すると安心です。',
          fitFor: 'スキンケア初心者の友人に合います。',
        },
        {
          productId: 'relax-001',
          reason: '休息を気遣うギフトとして選びやすいです。',
          easyToGive: '美容品ほど好みを選びにくいです。',
          caution: '香りに敏感な方には控えめタイプを確認すると安心です。',
          fitFor: 'リラックス時間を大切にする相手に合います。',
        },
      ],
      followUpQuestion: null,
    }),
  }))

  await page.goto('/concierge')
  await page.getByLabel('相談文').fill('肌が弱い女友達に贈るギフト')
  await page.getByRole('button', { name: 'AIに相談する' }).click()

  await expect(page.locator('.recommendation-card')).toHaveCount(3)
  await expect(page.getByText('無効IDの商品理由です')).toHaveCount(0)
  await expect(page.locator('.recommendation-card').first()).toContainText('モイストバランス ローション')
  await expect(page.locator('.recommendation-card').first()).toContainText('敏感肌向けタグがあり')
})

test('追加質問に答えると回答を踏まえて再提案される', async ({ page }) => {
  const requests = []
  await page.route('**/functions/v1/concierge', (route) => {
    requests.push(route.request().postDataJSON())
    const isSecondTurn = requests.length === 2
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        summary: isSecondTurn
          ? '香り控えめの条件を反映して選び直しました。'
          : 'まずは渡しやすい3品を選びました。',
        recommendations: [
          {
            productId: isSecondTurn ? 'mensgift-005' : 'gift-001',
            reason: isSecondTurn ? '香り控えめタグがあり、苦手そうな相手にも検討しやすいです。' : '見栄えのよい定番ギフトです。',
            easyToGive: '相手に気を遣わせにくい価格帯です。',
            caution: '香りや成分の好みは事前に確認すると安心です。',
            fitFor: '友人へのギフトに合います。',
          },
          {
            productId: 'skincare-001',
            reason: '日常で使いやすいケア用品です。',
            easyToGive: '軽めのギフトとして渡しやすいです。',
            caution: '肌に合うかは個人差があります。',
            fitFor: '美容初心者に合います。',
          },
          {
            productId: 'relax-001',
            reason: '休息を気遣う候補です。',
            easyToGive: '重くなりにくい消えものです。',
            caution: '香りの好みを確認すると安心です。',
            fitFor: '忙しい相手に合います。',
          },
        ],
        followUpQuestion: isSecondTurn ? null : '相手の方は香りのあるアイテムが好きそうですか？',
      }),
    })
  })

  await page.goto('/concierge')
  await page.getByLabel('相談文').fill('友人に贈るギフト')
  await page.getByRole('button', { name: 'AIに相談する' }).click()

  await expect(page.getByText('相手の方は香りのあるアイテムが好きそうですか？')).toBeVisible()
  await page.getByRole('button', { name: '苦手そう' }).click()

  await expect(page.getByText('香り控えめの条件を反映して選び直しました。')).toBeVisible()
  expect(requests).toHaveLength(2)
  expect(requests[1].query).toContain('追加質問: 相手の方は香りのあるアイテムが好きそうですか？')
  expect(requests[1].query).toContain('回答: 苦手そう')
})

test('コンシェルジュ提案をギフト選定軸で比較できる', async ({ page }) => {
  await page.route('**/functions/v1/concierge', (route) => route.abort())
  await page.goto('/concierge')
  await page.getByLabel('相談文').fill('友人に失敗しにくいギフト')
  await page.getByRole('button', { name: 'AIに相談する' }).click()

  await expect(page.locator('.recommendation-card')).toHaveCount(3)
  await expect(page.getByText('美容初心者にも渡しやすい')).toBeVisible()
  await page.getByRole('button', { name: '3品を比較する' }).click()

  const comparison = page.getByLabel('3品のギフト比較')
  await expect(comparison.getByText('3品をギフト選定軸で比較')).toBeVisible()
  await expect(comparison.getByText('失敗しにくさ')).toBeVisible()
  await expect(comparison.getByText('高見え')).toBeVisible()
  await expect(comparison.getByText('香りの強さ')).toBeVisible()
})

test('相談から商品詳細へ進むと相談文脈が引き継がれる', async ({ page }) => {
  await page.route('**/functions/v1/concierge', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      summary: '敏感肌向けの候補を選びました。',
      recommendations: [
        {
          productId: 'skincare-001',
          reason: '敏感肌向けタグがあり、肌が弱い友人にも検討しやすいです。',
          easyToGive: '日常で使いやすい保湿ケアとして渡しやすいです。',
          caution: '肌に合うかは個人差があるため、成分を確認すると安心です。',
          fitFor: 'スキンケア初心者の友人に合います。',
        },
        {
          productId: 'relax-001',
          reason: '休息を気遣う候補です。',
          easyToGive: '重くなりにくいギフトです。',
          caution: '香りの好みを確認すると安心です。',
          fitFor: '忙しい相手に合います。',
        },
        {
          productId: 'gift-001',
          reason: '見栄えのよいセットです。',
          easyToGive: 'そのまま渡しやすいです。',
          caution: 'セット内容を確認すると安心です。',
          fitFor: '好みが分からない相手に合います。',
        },
      ],
      followUpQuestion: null,
    }),
  }))

  await page.goto('/concierge')
  await page.getByLabel('相談文').fill('肌が弱い友人に贈るギフト')
  await page.getByRole('button', { name: 'AIに相談する' }).click()
  await page.locator('.recommendation-card').first().getByRole('link', { name: '詳細を見る' }).click()

  await expect(page).toHaveURL(/\/products\/skincare-001/)
  await expect(page.getByText('あなたの相談から選ばれました')).toBeVisible()
  await expect(page.getByText('「肌が弱い友人に贈るギフト」')).toBeVisible()
  await expect(page.getByText('敏感肌向けタグがあり')).toBeVisible()
  await expect(page.getByText('AI相談でよく選ばれる理由')).toBeVisible()
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
