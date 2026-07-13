import { Check, ShoppingCart, SlidersHorizontal, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { useMemo, useRef, useState } from 'react'
import TransitionLink from '../components/TransitionLink'
import EmptyState from '../components/ui/EmptyState'
import PageHeader from '../components/ui/PageHeader'
import products from '../data/products'
import { addToCart } from '../lib/cart'
import { cardReveal, staggerGrid } from '../lib/motion'
import { recommendProducts } from '../lib/supabase'

const categories = ['すべて', ...new Set(products.map((product) => product.category))]
const priceRanges = [
  { label: 'すべて', min: 0, max: Infinity },
  { label: '〜2,999円', min: 0, max: 2999 },
  { label: '3,000〜4,999円', min: 3000, max: 4999 },
  { label: '5,000円〜', min: 5000, max: Infinity },
]
const popularTags = [
  '失敗しにくい',
  '高見え',
  '初心者向け',
  'ギフト向け',
  '予算控えめ',
  '香り控えめ',
  'リラックス',
  '実用的',
]

const formatPrice = (price) => new Intl.NumberFormat('ja-JP').format(price)

export default function Products() {
  const imageRefs = useRef(new Map())
  const [category, setCategory] = useState('すべて')
  const [priceRange, setPriceRange] = useState(priceRanges[0].label)
  const [selectedTag, setSelectedTag] = useState('すべて')
  const [keyword, setKeyword] = useState('')
  const [rankedIds, setRankedIds] = useState([])
  const [aiReasons, setAiReasons] = useState({})
  const [aiMessage, setAiMessage] = useState('')
  const [isRanking, setIsRanking] = useState(false)
  const [addedId, setAddedId] = useState(null)

  const filteredProducts = useMemo(() => {
    const selectedRange = priceRanges.find((range) => range.label === priceRange) ?? priceRanges[0]
    const keywordTerms = keyword.trim().toLowerCase().split(/\s+/).filter(Boolean)

    return products.filter((product) => {
      const matchesCategory = category === 'すべて' || product.category === category
      const matchesPrice = product.price >= selectedRange.min && product.price <= selectedRange.max
      const matchesTag = selectedTag === 'すべて' || product.tags.includes(selectedTag)
      const haystack = [product.name, product.category, product.description, product.aiReason, ...product.tags, ...product.giftFor]
        .join(' ')
        .toLowerCase()
      const matchesKeyword = keywordTerms.length === 0 || keywordTerms.every((term) => haystack.includes(term))
      return matchesCategory && matchesPrice && matchesTag && matchesKeyword
    })
  }, [category, priceRange, selectedTag, keyword])

  const displayedProducts = useMemo(() => {
    if (rankedIds.length === 0) return filteredProducts
    const order = new Map(rankedIds.map((id, index) => [id, index]))
    return [...filteredProducts].sort((a, b) => {
      const aRank = order.has(a.id) ? order.get(a.id) : Number.MAX_SAFE_INTEGER
      const bRank = order.has(b.id) ? order.get(b.id) : Number.MAX_SAFE_INTEGER
      return aRank - bRank
    })
  }, [filteredProducts, rankedIds])

  const handleAiRanking = async () => {
    const query = keyword.trim() || [category, priceRange, selectedTag].filter((item) => item !== 'すべて').join(' ')
    const fallbackQuery = query || '失敗しにくいギフトをおすすめ順に並べて'
    const candidates = filteredProducts.slice(0, 15)
    if (candidates.length === 0) return

    setIsRanking(true)
    setAiMessage('')
    try {
      const data = await recommendProducts(fallbackQuery, candidates)
      const ids = Array.isArray(data?.rankedProductIds)
        ? data.rankedProductIds.filter((id) => candidates.some((product) => product.id === id))
        : []
      setRankedIds(ids.length > 0 ? ids : candidates.map((product) => product.id))
      setAiReasons(data?.reasons ?? {})
      setAiMessage(data?.message || 'AIおすすめ順に並べ替えました。')
    } catch (error) {
      setRankedIds([])
      setAiReasons({})
      setAiMessage(error?.name === 'AiLimitExceededError' ? error.message : 'AIが混み合っています。通常検索順で表示します。')
    } finally {
      setIsRanking(false)
    }
  }

  const handleAddToCart = (product, event) => {
    addToCart(product, 1, 'products')
    const sourceEl = imageRefs.current.get(product.id) ?? event.currentTarget
    const rect = sourceEl.getBoundingClientRect()
    window.dispatchEvent(new CustomEvent('cart-fly', {
      detail: { imageUrl: product.imageUrl, category: product.category, startRect: rect },
    }))
    window.dispatchEvent(new Event('cart-updated'))
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1400)
  }

  return (
    <main className="site-page products-page">
      <PageHeader
        eyebrow="Product finder"
        icon={<SlidersHorizontal size={18} aria-hidden="true" />}
        title="商品一覧"
      >
        <p className="lead">
          36 件の固定商品から、カテゴリ・予算・タグ・キーワードで候補を絞り込めます。
        </p>
      </PageHeader>

      <section className="filters" aria-label="商品絞り込み">
        <label>
          キーワード
          <input
            type="search"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="例: 彼女 高見え 保湿"
          />
        </label>
        <label>
          カテゴリ
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            {categories.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          価格帯
          <select value={priceRange} onChange={(event) => setPriceRange(event.target.value)}>
            {priceRanges.map((range) => (
              <option key={range.label} value={range.label}>{range.label}</option>
            ))}
          </select>
        </label>
        <label>
          タグ
          <select value={selectedTag} onChange={(event) => setSelectedTag(event.target.value)}>
            <option value="すべて">すべて</option>
            {popularTags.map((tag) => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </label>
      </section>

      <div className="products-toolbar">
        <p>
          <strong>{filteredProducts.length}</strong> / {products.length} 件
        </p>
        <button type="button" className="button ai-sort" onClick={handleAiRanking} disabled={isRanking}>
          <Sparkles size={18} aria-hidden="true" />
          {isRanking ? 'AI 並べ替え中...' : 'AI でおすすめ順に並べ替え'}
        </button>
      </div>
      {aiMessage && <p className="ai-status">{aiMessage}</p>}

      <motion.section
        className="product-grid"
        aria-label="商品カード一覧"
        variants={staggerGrid}
        initial="hidden"
        animate="show"
      >
        {displayedProducts.map((product) => (
          <motion.article className="product-card" key={product.id} variants={cardReveal} layout>
            <div
              className="product-image"
              data-category={product.category}
              ref={(node) => {
                if (node) imageRefs.current.set(product.id, node)
                else imageRefs.current.delete(product.id)
              }}
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                loading="lazy"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            </div>
            <div className="product-card-body">
              <p className="product-category">{product.category}</p>
              <h2>{product.name}</h2>
              <div className="tag-list" aria-label={`${product.name} のタグ`}>
                {product.tags.slice(0, 2).map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              {aiReasons[product.id] && (
                <p className="ai-reason">{aiReasons[product.id]}</p>
              )}
              <div className="product-card-footer">
                <p className="product-card-price">¥{formatPrice(product.price)}</p>
                <div className="card-actions">
                  <TransitionLink className="card-btn card-btn-detail" to={`/products/${product.id}`}>
                    詳細
                  </TransitionLink>
                  <button
                    type="button"
                    className={`card-btn card-btn-add ${addedId === product.id ? 'added' : ''}`}
                    onClick={(e) => handleAddToCart(product, e)}
                  >
                    {addedId === product.id
                      ? <><Check size={13} aria-hidden="true" /> 追加済</>
                      : <><ShoppingCart size={13} aria-hidden="true" /> 追加</>
                    }
                  </button>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.section>

      {filteredProducts.length === 0 && (
        <EmptyState title="条件に合う商品がありません">
          <p>絞り込みを少し広げてください。</p>
        </EmptyState>
      )}
    </main>
  )
}
