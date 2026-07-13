import { Send, ShieldCheck, ShoppingCart, Sparkles } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import TransitionLink from '../components/TransitionLink'
import PageHeader from '../components/ui/PageHeader'
import products from '../data/products'
import { addToCart, recordConsultation, saveAiContext } from '../lib/cart'
import { getComparisonRows, getGiftLabels } from '../lib/giftLabels'
import { fadeUp } from '../lib/motion'
import { askConcierge } from '../lib/supabase'

const chips = [
  '彼女への誕生日プレゼント',
  '予算5,000円以内',
  '肌が弱い人向け',
  '美容初心者向け',
  '自分へのご褒美',
]

const MAX_CONCIERGE_TURNS = 2

const fallbackRecommendations = [
  {
    productId: 'gift-001',
    reason: '複数アイテム入りで見栄えがよく、好みが分からない相手にも贈りやすいです。',
    easyToGive: '箱を開けた時のギフト感があり、誕生日やお礼の場面でもきちんと選んだ印象を作れます。',
    caution: '香りや使用感に敏感な方には、セット内容を事前に確認すると安心です。',
    fitFor: '相手の好みがまだ詳しく分からない時や、見栄えを重視したい相手に合います。',
  },
  {
    productId: 'skincare-001',
    reason: '軽い使い心地で初めてのスキンケアギフトにも選びやすいです。',
    easyToGive: '日常使いしやすい保湿ケアなので、特別すぎず気遣いとして渡しやすいです。',
    caution: '肌に合うかは個人差があるため、敏感肌の方には成分や使い方を確認すると安心です。',
    fitFor: '美容初心者や、シンプルなケアを好む相手に合います。',
  },
  {
    productId: 'relax-001',
    reason: '美容品ほど好みを選ばず、休息を気遣うギフトとして渡しやすいです。',
    easyToGive: '相手を労わる気持ちが伝わりやすく、関係性が浅くても重くなりにくいです。',
    caution: '香りに敏感な方には、無香料・控えめタイプを確認すると安心です。',
    fitFor: '仕事や日常で疲れがたまりやすい相手、リラックス時間を大切にする相手に合います。',
  },
]

const fallbackResponse = {
  summary: 'AIが混み合っています。定番ギフト候補を表示します。',
  recommendedProductIds: fallbackRecommendations.map((item) => item.productId),
  recommendations: fallbackRecommendations,
  reasons: fallbackRecommendations.map((item) => item.reason),
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
  const autoSubmitRef = useRef(false)
  const location = useLocation()
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search])
  const initialMessage = useMemo(() => searchParams.get('message') ?? '', [searchParams])
  const shouldAutoSubmit = searchParams.get('auto') === '1'
  const [message, setMessage] = useState(initialMessage)
  const [response, setResponse] = useState(null)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [cartMessage, setCartMessage] = useState('')
  const [conversationQuery, setConversationQuery] = useState('')
  const [turnCount, setTurnCount] = useState(0)
  const [followUpAnswer, setFollowUpAnswer] = useState('')
  const [isComparisonOpen, setIsComparisonOpen] = useState(false)

  const activeResponse = response ?? fallbackResponse
  const recommendations = useMemo(() => {
    return activeResponse.recommendations
      .map((recommendation) => ({
        ...recommendation,
        product: products.find((item) => item.id === recommendation.productId),
      }))
      .filter((item) => item.product)
  }, [activeResponse])

  useEffect(() => {
    if (!shouldAutoSubmit || autoSubmitRef.current || !initialMessage.trim()) return
    autoSubmitRef.current = true
    submitQuery(initialMessage)
  }, [initialMessage, shouldAutoSubmit])

  const submitQuery = async (rawQuery, options = {}) => {
    const query = rawQuery.trim()
    if (!query) return

    setHasSubmitted(true)
    setIsLoading(true)
    setCartMessage('')
    setFollowUpAnswer('')
    try {
      const data = await askConcierge(
        query,
        products.map(toConciergeCandidate),
      )
      const normalized = normalizeConciergeResponse(data)
      setResponse(normalized)
      setConversationQuery(query)
      setTurnCount(options.turn ?? 1)
      setIsComparisonOpen(false)
      saveAiContext(normalized.recommendedProductIds, query, normalized.recommendations)
      recordConsultation(query, normalized.recommendedProductIds)
    } catch (error) {
      const summary = error?.name === 'AiLimitExceededError' ? error.message : fallbackResponse.summary
      setResponse({ ...fallbackResponse, summary })
      setConversationQuery(query)
      setTurnCount(options.turn ?? 1)
      setIsComparisonOpen(false)
      saveAiContext(fallbackResponse.recommendedProductIds, query, fallbackResponse.recommendations)
      recordConsultation(query, fallbackResponse.recommendedProductIds)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    submitQuery(message, { turn: 1 })
  }

  const handleFollowUpSubmit = (answer) => {
    const trimmedAnswer = answer.trim()
    if (!trimmedAnswer || !activeResponse.followUpQuestion || turnCount >= MAX_CONCIERGE_TURNS) return
    const baseQuery = conversationQuery || message
    const nextQuery = [
      baseQuery,
      `追加質問: ${activeResponse.followUpQuestion}`,
      `回答: ${trimmedAnswer}`,
    ].join('\n')
    submitQuery(nextQuery, { turn: turnCount + 1 })
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
      <PageHeader
        eyebrow="AI concierge"
        icon={<Sparkles size={18} aria-hidden="true" />}
        title="Concierge"
      >
        <p className="lead">
          相手、予算、避けたい好みをそのまま入力してください。2ターン以内におすすめ商品まで案内します。
        </p>
      </PageHeader>

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
              className="motion-icon"
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
                      className="motion-icon"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
                    >
                      <Sparkles size={18} aria-hidden="true" />
                    </motion.span>
                    <span>AIが最適な3品を選んでいます</span>
                    <motion.span
                      className="thinking-dots"
                      animate={{ opacity: [1, 0.25, 1] }}
                      transition={{ repeat: Infinity, duration: 1.2 }}
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
                          <div className="skeleton-line skeleton-line-short shimmer" />
                          <div className="skeleton-line skeleton-line-long shimmer" />
                          <div className="skeleton-line skeleton-line-medium shimmer" />
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
                  <motion.p className="turn-status" variants={fadeUp} initial="hidden" animate="show">
                    相談ターン {Math.max(turnCount, 1)} / {MAX_CONCIERGE_TURNS}
                  </motion.p>
                  <motion.p className="ai-trust-note" variants={fadeUp} initial="hidden" animate="show">
                    <ShieldCheck size={15} aria-hidden="true" />
                    カタログの商品情報に基づく提案です。効能は断定せず、AI 混雑時は定番候補にフォールバックします。
                  </motion.p>
                  <div className="recommendation-list">
                    {recommendations.map(({ product, reason, easyToGive, caution, fitFor }, i) => (
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
                          <GiftLabelList labels={getGiftLabels(product)} />
                          <div className="reason-breakdown">
                            <ReasonItem label="AIが選んだ理由" text={reason ?? product.aiReason} />
                            <ReasonItem label="渡しやすいポイント" text={easyToGive} />
                            <ReasonItem label="注意したい点" text={caution} />
                            {fitFor && <ReasonItem label="合いそうな相手" text={fitFor} />}
                          </div>
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
                  {recommendations.length === 3 && (
                    <motion.div
                      className="comparison-toggle-row"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: recommendations.length * 0.16 + 0.12, duration: 0.3 }}
                    >
                      <button
                        type="button"
                        className="button secondary"
                        onClick={() => setIsComparisonOpen((current) => !current)}
                      >
                        {isComparisonOpen ? '比較を閉じる' : '3品を比較する'}
                      </button>
                    </motion.div>
                  )}
                  {isComparisonOpen && (
                    <GiftComparison recommendations={recommendations} />
                  )}
                  {activeResponse.followUpQuestion && (
                    <motion.div
                      className="follow-up-panel"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: recommendations.length * 0.16 + 0.2, duration: 0.35 }}
                    >
                      <p className="follow-up">{activeResponse.followUpQuestion}</p>
                      {turnCount < MAX_CONCIERGE_TURNS ? (
                        <div className="follow-up-answer">
                          <div className="chip-row" aria-label="追加質問の回答候補">
                            {getFollowUpOptions(activeResponse.followUpQuestion).map((option) => (
                              <button
                                key={option}
                                type="button"
                                className="chip"
                                onClick={() => handleFollowUpSubmit(option)}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                          <form
                            className="follow-up-form"
                            onSubmit={(event) => {
                              event.preventDefault()
                              handleFollowUpSubmit(followUpAnswer)
                            }}
                          >
                            <label htmlFor="follow-up-answer">追加で伝えること</label>
                            <div>
                              <input
                                id="follow-up-answer"
                                type="text"
                                value={followUpAnswer}
                                onChange={(event) => setFollowUpAnswer(event.target.value)}
                                placeholder="例: 香りは控えめがよさそう"
                              />
                              <button type="submit" disabled={!followUpAnswer.trim() || isLoading}>
                                再提案
                              </button>
                            </div>
                          </form>
                        </div>
                      ) : (
                        <p className="follow-up-limit">追加条件を反映した提案です。</p>
                      )}
                    </motion.div>
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

function GiftLabelList({ labels }) {
  if (!labels.length) return null
  return (
    <div className="gift-label-list" aria-label="ギフト適合ラベル">
      {labels.map((label) => (
        <span key={label}>{label}</span>
      ))}
    </div>
  )
}

function GiftComparison({ recommendations }) {
  const rows = getComparisonRows(recommendations)
  return (
    <section className="comparison-panel" aria-label="3品のギフト比較">
      <div className="comparison-head">
        <h2>3品をギフト選定軸で比較</h2>
        <p>価格やスペックではなく、渡しやすさの違いで見比べられます。</p>
      </div>
      <div className="comparison-table">
        <div className="comparison-row comparison-row--head">
          <span>選定軸</span>
          {recommendations.map(({ product }) => (
            <strong key={product.id}>{product.name}</strong>
          ))}
        </div>
        {rows.map((row) => (
          <div className="comparison-row" key={row.key}>
            <span>{row.label}</span>
            {row.values.map((value, index) => (
              <b
                key={`${row.key}-${recommendations[index].product.id}`}
                className={value === row.highlight ? 'comparison-best' : ''}
              >
                {value}
              </b>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

function ReasonItem({ label, text }) {
  return (
    <p className="reason-item">
      <span>{label}</span>
      {text}
    </p>
  )
}

function toConciergeCandidate(product) {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    price: product.price,
    tags: product.tags,
    giftFor: product.giftFor,
    description: product.description,
  }
}

function getFollowUpOptions(question) {
  if (/香り|匂い/.test(question)) return ['好きそう', '苦手そう', '分からない']
  if (/関係|相手|どなた|誰/.test(question)) return ['友人', '彼女', '職場', '家族']
  if (/予算|価格|金額/.test(question)) return ['3,000円以内', '5,000円くらい', '7,000円くらい']
  if (/肌|敏感/.test(question)) return ['敏感肌かも', 'そこまで気にしない', '分からない']
  return ['使いやすさ重視', '特別感重視', '分からない']
}

function normalizeConciergeResponse(data) {
  const aiRecommendations = Array.isArray(data?.recommendations)
    ? data.recommendations
    : Array.isArray(data?.recommendedProductIds)
      ? data.recommendedProductIds.map((productId, index) => ({
        productId,
        reason: data?.reasons?.[index],
      }))
      : []

  const validRecommendations = aiRecommendations
    .map((item, index) => normalizeRecommendation(item, index))
    .filter(Boolean)

  const recommendations = [...validRecommendations, ...fallbackResponse.recommendations]
    .filter((item, index, array) => array.findIndex((candidate) => candidate.productId === item.productId) === index)
    .slice(0, 3)

  return {
    summary: data?.summary || fallbackResponse.summary,
    recommendedProductIds: recommendations.map((item) => item.productId),
    recommendations,
    reasons: recommendations.map((item) => item.reason),
    followUpQuestion: data?.followUpQuestion ?? fallbackResponse.followUpQuestion,
  }
}

function normalizeRecommendation(item, index) {
  const product = products.find((candidate) => candidate.id === item?.productId)
  if (!product) return null

  const fallback = fallbackResponse.recommendations[index] ?? {
    reason: product.aiReason,
    easyToGive: '日常で使いやすく、相手に気を遣わせにくいギフトとして渡しやすいです。',
    caution: '香り・使用感・成分の好みには個人差があるため、気になる場合は事前に確認すると安心です。',
    fitFor: '相手の好みや生活スタイルに自然になじむギフトを探している時に合います。',
  }

  return {
    productId: product.id,
    reason: normalizeText(item?.reason, product.aiReason),
    easyToGive: normalizeText(item?.easyToGive, fallback.easyToGive),
    caution: normalizeText(item?.caution, fallback.caution),
    fitFor: normalizeText(item?.fitFor, fallback.fitFor),
  }
}

function normalizeText(value, fallback) {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback
}
