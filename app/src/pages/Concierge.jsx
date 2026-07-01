import { Send, ShoppingCart, Sparkles } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import TransitionLink from '../components/TransitionLink'
import products from '../data/products'
import { addToCart, recordConsultation, saveAiContext } from '../lib/cart'
import { fadeUp } from '../lib/motion'
import { askConcierge } from '../lib/supabase'

const chips = [
  '彼女への誕生日プレゼント',
  '予算5,000円以内',
  '肌が弱い人向け',
  '美容初心者向け',
  '自分へのご褒美',
]

const fallbackResponse = {
  summary: 'AIが混み合っています。定番ギフト候補を表示します。',
  recommendedProductIds: ['gift-001', 'skincare-001', 'relax-001'],
  reasons: [
    '複数アイテム入りで見栄えがよく、好みが分からない相手にも贈りやすいです。',
    '軽い使い心地で初めてのスキンケアギフトにも選びやすいです。',
    '美容品ほど好みを選ばず、休息を気遣うギフトとして渡しやすいです。',
  ],
  followUpQuestion: '香りあり・香り控えめのどちらが好みに近そうですか？',
}

// Spring "deal" animation — each card slides in from left with spring bounce
const dealCard = {
  hidden: { opacity: 0, x: -52, scale: 0.9 },
  show: (i) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 220, damping: 22, delay: i * 0.16 },
  }),
}

export default function Concierge() {
  const imageRefs = useRef(new Map())
  const location = useLocation()
  const initialMessage = useMemo(
    () => new URLSearchParams(location.search).get('message') ?? '',
    [location.search],
  )
  const [message, setMessage] = useState(initialMessage)
  const [response, setResponse] = useState(null)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [cartMessage, setCartMessage] = useState('')

  const activeResponse = response ?? fallbackResponse
  const recommendations = useMemo(() => {
    return activeResponse.recommendedProductIds
      .map((id, index) => ({
        product: products.find((item) => item.id === id),
        reason: activeResponse.reasons?.[index],
      }))
      .filter((item) => item.product)
  }, [activeResponse])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const query = message.trim()
    if (!query) return

    setHasSubmitted(true)
    setIsLoading(true)
    setCartMessage('')
    try {
      const data = await askConcierge(
        query,
        products.map((product) => product.id),
      )
      const normalized = normalizeConciergeResponse(data)
      setResponse(normalized)
      saveAiContext(normalized.recommendedProductIds, query)
      recordConsultation(query, normalized.recommendedProductIds)
    } catch (error) {
      const summary = error?.name === 'AiLimitExceededError' ? error.message : fallbackResponse.summary
      setResponse({ ...fallbackResponse, summary })
      saveAiContext(fallbackResponse.recommendedProductIds, query)
      recordConsultation(query, fallbackResponse.recommendedProductIds)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdd = (product, event) => {
    addToCart(product, 1, 'concierge')
    const sourceEl = imageRefs.current.get(product.id) ?? event.currentTarget
    const rect = sourceEl.getBoundingClientRect()
    window.dispatchEvent(new CustomEvent('cart-fly', {
      detail: { imageUrl: product.imageUrl, category: product.category, startRect: rect },
    }))
    window.dispatchEvent(new Event('cart-updated'))
    setCartMessage(`${product.name} をカートに追加しました。`)
  }

  return (
    <main className="site-page concierge-page">
      <section className="page-heading">
        <p className="eyebrow">
          <Sparkles size={18} aria-hidden="true" />
          AI concierge
        </p>
        <h1>Concierge</h1>
        <p className="lead">
          相手、予算、避けたい好みをそのまま入力してください。2ターン以内におすすめ商品まで案内します。
        </p>
      </section>

      <section className="concierge-layout">
        <form className="chat-panel" onSubmit={handleSubmit}>
          <label htmlFor="concierge-message">相談文</label>
          <textarea
            id="concierge-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="例: 肌が弱い女友達に贈るギフト。予算は5,000円くらいです。"
            rows="5"
            maxLength="200"
          />
          <div className="chip-row">
            {chips.map((chip) => (
              <motion.button
                key={chip}
                type="button"
                className="chip"
                whileTap={{ scale: 0.91 }}
                onClick={() => setMessage((current) => [current, chip].filter(Boolean).join(' / '))}
              >
                {chip}
              </motion.button>
            ))}
          </div>
          <motion.button
            type="submit"
            className="button primary"
            disabled={isLoading}
            whileTap={{ scale: 0.96 }}
          >
            <motion.span
              style={{ display: 'inline-flex' }}
              animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
              transition={isLoading
                ? { repeat: Infinity, duration: 1.1, ease: 'linear' }
                : { duration: 0.3 }
              }
            >
              <Send size={18} aria-hidden="true" />
            </motion.span>
            {isLoading ? 'AIが選考中...' : 'AIに相談する'}
          </motion.button>
        </form>

        {hasSubmitted ? (
          <section className="result-panel" aria-live="polite">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="thinking"
                  className="thinking-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                >
                  <div className="thinking-header-row">
                    <motion.span
                      style={{ display: 'inline-flex' }}
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
                    >
                      <Sparkles size={18} aria-hidden="true" />
                    </motion.span>
                    <span>AIが最適な3品を選んでいます</span>
                    <motion.span
                      animate={{ opacity: [1, 0.25, 1] }}
                      transition={{ repeat: Infinity, duration: 1.2 }}
                      style={{ letterSpacing: '0.12em' }}
                    >
                      ...
                    </motion.span>
                  </div>
                  <div className="thinking-scan-bar">
                    <motion.div
                      className="thinking-scan-fill"
                      animate={{ x: ['-100%', '230%'] }}
                      transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut', repeatDelay: 0.15 }}
                    />
                  </div>
                  <div className="skeleton-list">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="skeleton-card"
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.11, duration: 0.28 }}
                      >
                        <div className="skeleton-image shimmer" />
                        <div className="skeleton-body">
                          <div className="skeleton-line shimmer" style={{ width: '32%' }} />
                          <div className="skeleton-line shimmer" style={{ width: '78%' }} />
                          <div className="skeleton-line shimmer" style={{ width: '56%' }} />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial="hidden"
                  animate="show"
                  variants={{ hidden: {}, show: {} }}
                >
                  <motion.p className="result-summary" variants={fadeUp} initial="hidden" animate="show">
                    {activeResponse.summary}
                  </motion.p>
                  <div className="recommendation-list">
                    {recommendations.map(({ product, reason }, i) => (
                      <motion.article
                        key={product.id}
                        className="recommendation-card"
                        custom={i}
                        variants={dealCard}
                        initial="hidden"
                        animate="show"
                        whileHover={{ y: -4, boxShadow: 'var(--shadow-hover)', transition: { duration: 0.18 } }}
                      >
                        <div
                          className="product-image small"
                          data-category={product.category}
                          ref={(node) => {
                            if (node) imageRefs.current.set(product.id, node)
                            else imageRefs.current.delete(product.id)
                          }}
                        >
                          <img src={product.imageUrl} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                        </div>
                        <div>
                          <p className="product-category">{product.category}</p>
                          <h2>{product.name}</h2>
                          <p>{reason ?? product.aiReason}</p>
                          <div className="recommendation-actions">
                            <TransitionLink to={`/products/${product.id}`}>詳細を見る</TransitionLink>
                            <button type="button" onClick={(e) => handleAdd(product, e)}>
                              <ShoppingCart size={16} aria-hidden="true" />
                              追加
                            </button>
                          </div>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                  {activeResponse.followUpQuestion && (
                    <motion.p
                      className="follow-up"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: recommendations.length * 0.16 + 0.2, duration: 0.35 }}
                    >
                      {activeResponse.followUpQuestion}
                    </motion.p>
                  )}
                  <AnimatePresence>
                    {cartMessage && (
                      <motion.p
                        className="success-message"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        {cartMessage}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        ) : (
          <section className="result-panel result-panel--empty" aria-live="polite">
            <p className="result-hint">
              相談文を入力して「AIに相談する」を押すと、
              <br />
              あなたの状況に合ったおすすめ商品が表示されます。
            </p>
          </section>
        )}
      </section>
    </main>
  )
}

function normalizeConciergeResponse(data) {
  const ids = Array.isArray(data?.recommendedProductIds)
    ? data.recommendedProductIds.filter((id) => products.some((product) => product.id === id))
    : []
  const recommendedProductIds = [...ids, ...fallbackResponse.recommendedProductIds]
    .filter((id, index, array) => array.indexOf(id) === index)
    .slice(0, 3)

  return {
    summary: data?.summary || fallbackResponse.summary,
    recommendedProductIds,
    reasons: Array.isArray(data?.reasons) ? data.reasons : fallbackResponse.reasons,
    followUpQuestion: data?.followUpQuestion ?? fallbackResponse.followUpQuestion,
  }
}
