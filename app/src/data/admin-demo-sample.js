// 店舗インサイト（/admin-demo）のサンプルデータ。
// このセッションで相談・注文がまだ無いとき「すべて 0」で崩れて見えるのを防ぎ、
// 営業デモでダッシュボードが機能して見えるようにするための表示専用データ。
// localStorage には一切書き込まない（実際のカート・注文履歴は汚さない）。

const iso = (daysAgo, hour = 11) => {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  d.setHours(hour, 0, 0, 0)
  return d.toISOString()
}

// 本日 6 件 + 過去 8 件 = 14 件
export const sampleConsultations = [
  { query: '予算5,000円で彼女に喜ばれる誕生日プレゼント', createdAt: iso(0, 9) },
  { query: '美容に詳しくない友人へのプチギフト', createdAt: iso(0, 10) },
  { query: '香り控えめでリラックスできるもの', createdAt: iso(0, 12) },
  { query: '母の日に贈る高見えするギフト', createdAt: iso(0, 13) },
  { query: '敏感肌の妻へ贈る保湿ケア', createdAt: iso(0, 15) },
  { query: '予算3,000円以内の記念日プレゼント', createdAt: iso(0, 18) },
  { query: '彼女への誕生日プレゼントを探しています', createdAt: iso(1, 11) },
  { query: 'コスパ重視で職場の同僚へ配るギフト', createdAt: iso(1, 14) },
  { query: '香りが強すぎない癒しのギフト', createdAt: iso(2, 10) },
  { query: '美容初心者の後輩へのプレゼント', createdAt: iso(2, 16) },
  { query: '予算内で失敗しない定番ギフト', createdAt: iso(3, 12) },
  { query: '彼女とパートナーに人気の保湿アイテム', createdAt: iso(3, 19) },
  { query: '自分へのご褒美スキンケア', createdAt: iso(4, 13) },
  { query: '記念日に高見えするプレゼント', createdAt: iso(5, 15) },
].map((c) => ({ ...c, recommendedProductIds: [] }))

export const sampleCartEvents = [
  { productId: 'gift-001', quantity: 2, source: 'concierge', createdAt: iso(0, 9) },
  { productId: 'skincare-001', quantity: 2, source: 'browse', createdAt: iso(0, 12) },
  { productId: 'relax-001', quantity: 1, source: 'concierge', createdAt: iso(1, 14) },
  { productId: 'bodycare-001', quantity: 1, source: 'concierge', createdAt: iso(1, 16) },
  { productId: 'skincare-003', quantity: 1, source: 'browse', createdAt: iso(2, 11) },
  { productId: 'gift-005', quantity: 1, source: 'browse', createdAt: iso(3, 13) },
  { productId: 'haircare-005', quantity: 1, source: 'concierge', createdAt: iso(4, 10) },
]

export const sampleOrders = [
  { total: 5000, fromAi: true, createdAt: iso(0, 10), items: [{ productId: 'gift-001', quantity: 1 }] },
  { total: 5500, fromAi: true, createdAt: iso(0, 15), items: [{ productId: 'skincare-001', quantity: 1 }, { productId: 'relax-001', quantity: 1 }] },
  { total: 4600, fromAi: true, createdAt: iso(1, 12), items: [{ productId: 'skincare-003', quantity: 1 }] },
  { total: 7700, fromAi: true, createdAt: iso(1, 18), items: [{ productId: 'gift-001', quantity: 1 }, { productId: 'bodycare-001', quantity: 1 }] },
  { total: 2300, fromAi: true, createdAt: iso(2, 14), items: [{ productId: 'relax-001', quantity: 1 }] },
  { total: 5400, fromAi: true, createdAt: iso(3, 11), items: [{ productId: 'bodycare-001', quantity: 2 }] },
  { total: 3200, fromAi: false, createdAt: iso(3, 16), items: [{ productId: 'skincare-001', quantity: 1 }] },
  { total: 5000, fromAi: false, createdAt: iso(4, 13), items: [{ productId: 'gift-001', quantity: 1 }] },
  { total: 6900, fromAi: false, createdAt: iso(5, 17), items: [{ productId: 'gift-005', quantity: 1 }, { productId: 'haircare-005', quantity: 1 }] },
]

export const sampleAiUsageToday = 12
