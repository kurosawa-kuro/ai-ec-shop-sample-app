const labelRules = [
  { label: '失敗しにくい', tags: ['失敗しにくい', '定番', '実用的', '初心者向け'] },
  { label: '高見え', tags: ['高見え', 'ギフト向け', '記念日', 'セット'] },
  { label: '香り控えめ', tags: ['香り控えめ', '低刺激感'] },
  { label: '好みが分かれにくい', tags: ['定番', '実用的', '予算控えめ', 'カジュアル'] },
  { label: '美容初心者にも渡しやすい', tags: ['初心者向け', 'AI相談向け'] },
  { label: '気軽に渡しやすい', tags: ['カジュアル', '予算控えめ', '携帯しやすい'] },
]

export function getGiftLabels(product, limit = 4) {
  const tags = product?.tags ?? []
  const labels = labelRules
    .filter((rule) => rule.tags.some((tag) => tags.includes(tag)))
    .map((rule) => rule.label)

  if (product?.price <= 3000) labels.push('重くなりにくい')
  if (product?.giftFor?.includes('友人') || product?.giftFor?.includes('同僚')) labels.push('相手を選びにくい')
  if (product?.category === 'リラックス') labels.push('美容品が苦手でも選びやすい')

  return [...new Set(labels)].slice(0, limit)
}

export function getGiftFitProfile(product) {
  const tags = product?.tags ?? []
  const labels = getGiftLabels(product, 6)
  const has = (items) => items.some((item) => tags.includes(item) || labels.includes(item))

  return {
    price: formatPriceBand(product?.price),
    safety: has(['失敗しにくい', '定番', '実用的', '初心者向け']) ? '高め' : '普通',
    premium: has(['高見え', 'ギフト向け', '記念日', 'セット']) ? '高め' : '控えめ',
    scent: has(['香り控えめ', '低刺激感']) ? '控えめ' : '確認したい',
    broadFit: product?.giftFor?.length >= 3 || labels.includes('相手を選びにくい') ? '広め' : 'やや絞る',
    dailyUse: has(['実用的', '定番', '朝ケア', '日中ケア', '初心者向け']) ? 'しやすい' : '特別寄り',
  }
}

export function getComparisonRows(recommendations) {
  const products = recommendations.map((item) => item.product)
  const profiles = products.map(getGiftFitProfile)
  return [
    { key: 'price', label: '価格帯', values: profiles.map((profile) => profile.price) },
    { key: 'safety', label: '失敗しにくさ', values: profiles.map((profile) => profile.safety), highlight: '高め' },
    { key: 'premium', label: '高見え', values: profiles.map((profile) => profile.premium), highlight: '高め' },
    { key: 'scent', label: '香りの強さ', values: profiles.map((profile) => profile.scent), highlight: '控えめ' },
    { key: 'broadFit', label: '相手を選びにくい', values: profiles.map((profile) => profile.broadFit), highlight: '広め' },
    { key: 'dailyUse', label: '普段使い', values: profiles.map((profile) => profile.dailyUse), highlight: 'しやすい' },
  ]
}

function formatPriceBand(price = 0) {
  if (price <= 3000) return '軽め'
  if (price <= 5000) return '標準'
  return '特別感'
}
