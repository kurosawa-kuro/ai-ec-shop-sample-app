import { ArrowRight, ArrowUpRight, Gift, Search, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import products from '../data/products'
import { cardReveal, staggerFast, staggerGrid } from '../lib/motion'

const promptChips = [
  '肌が弱い友人へ',
  '美容に詳しくない相手へ',
  '予算5,000円で高見え',
  '香りが強すぎないもの',
  '彼女への記念日ギフト',
  '職場の女性に気軽に',
]

const guideGroups = [
  {
    id: 'recipient',
    label: '相手',
    options: ['友人', '彼女', '母', '職場の女性', '自分'],
  },
  {
    id: 'concern',
    label: '悩み',
    options: ['肌が弱い', '美容に詳しくない', '香りが苦手', '何が喜ばれるか分からない', '高見えさせたい'],
  },
  {
    id: 'budget',
    label: '予算',
    options: ['3,000円以内', '5,000円くらい', '7,000円くらい'],
  },
]

const initialGuide = {
  recipient: '友人',
  concern: '肌が弱い',
  budget: '5,000円くらい',
}

const findProducts = (ids) => ids.map((id) => products.find((p) => p.id === id)).filter(Boolean)

// ヒーロー右の「AIが選んだ3件」— 相手・予算・好みの幅を1枚で示す組み合わせ
const heroPicks = findProducts(['gift-001', 'skincare-001', 'relax-001'])

// カタログが実在することを見せる編集部ピック（画像優先）
const featured = findProducts(['gift-001', 'skincare-003', 'relax-001', 'bodycare-001'])

const steps = [
  {
    num: '01',
    title: '言葉で相談する',
    body: '予算・相手・シーンをそのまま入力。「何を選べばいいか分からない」ままで大丈夫です。',
    link: '/concierge',
    linkLabel: 'AIに相談する',
  },
  {
    num: '02',
    title: 'AIが3つに絞る',
    body: '厳選した商品からあなたの状況に合う候補を提案。そのまま渡せる理由も一緒に添えます。',
    link: '/concierge',
    linkLabel: '提案を見る',
  },
  {
    num: '03',
    title: 'そのまま買える',
    body: '気に入った候補はワンタップでカートへ。会員登録なしで注文フローまで試せます。',
    link: '/products',
    linkLabel: '商品を見る',
  },
]

const formatPrice = (n) => `¥${n.toLocaleString('ja-JP')}`

const hideBrokenImage = (event) => {
  event.currentTarget.style.display = 'none'
}

export default function Top() {
  const [message, setMessage] = useState('')
  const [guide, setGuide] = useState(initialGuide)
  const navigate = useNavigate()

  const guidedMessage = buildGuidedMessage(guide)

  const navigateToConcierge = (query, auto = false) => {
    const params = new URLSearchParams()
    if (query.trim()) {
      params.set('message', query.trim())
    }
    if (auto && query.trim()) {
      params.set('auto', '1')
    }
    navigate(`/concierge${params.toString() ? `?${params.toString()}` : ''}`)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    navigateToConcierge(message)
  }

  const handleGuideChange = (groupId, value) => {
    const nextGuide = { ...guide, [groupId]: value }
    setGuide(nextGuide)
    setMessage(buildGuidedMessage(nextGuide))
  }

  const handleGuidedSubmit = () => {
    const query = message.trim() || guidedMessage
    navigateToConcierge(query, true)
  }

  return (
    <main className="site-page">
      <section className="hero-section">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p className="eyebrow">
            <Sparkles size={18} aria-hidden="true" />
            AI gift concierge
          </p>
          <h1>
            あなたの言葉から、
            <br />
            3つのギフトを。
          </h1>
          <p className="lead">
            「肌が弱い女友達に贈るギフト」——そんな一言で大丈夫。厳選したギフトから、渡しやすい候補を AI が3つに絞ります。
          </p>
          <div className="guided-entry" aria-label="困りごとから選ぶ相談">
            {guideGroups.map((group) => (
              <div className="guided-group" key={group.id}>
                <span>{group.label}</span>
                <div className="chip-row">
                  {group.options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`chip ${guide[group.id] === option ? 'chip-active' : ''}`}
                      aria-pressed={guide[group.id] === option}
                      onClick={() => handleGuideChange(group.id, option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <button type="button" className="button primary guided-submit" onClick={handleGuidedSubmit}>
              <Sparkles size={17} aria-hidden="true" />
              この条件で相談する
            </button>
          </div>
          <form className="concierge-form" onSubmit={handleSubmit}>
            <label htmlFor="gift-message">どんな相手に、どんなギフト？</label>
            <div className="hero-search">
              <Search size={20} aria-hidden="true" />
              <input
                id="gift-message"
                type="text"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="肌が弱い女友達に贈るギフト"
              />
              <button type="submit" aria-label="AIに相談する">
                <ArrowRight size={20} aria-hidden="true" />
              </button>
            </div>
            <div className="chip-row" aria-label="相談例">
              {promptChips.map((chip) => (
                <button key={chip} type="button" className="chip" onClick={() => navigateToConcierge(chip, true)}>
                  {chip}
                </button>
              ))}
            </div>
          </form>
          <p className="hero-alt">
            またはこのまま
            <Link to="/products">
              商品一覧から探す
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </p>
        </motion.div>

        <motion.aside
          className="concierge-slip"
          aria-label="AIが選んだギフトの例"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="slip-head">
            <span className="slip-eyebrow">for you</span>
            <span className="slip-count">3 picks</span>
          </div>
          <motion.div
            className="slip-list"
            variants={staggerFast}
            initial="hidden"
            animate="show"
          >
            {heroPicks.map((product) => (
              <motion.article className="slip-item" key={product.id} variants={cardReveal}>
                <div className="slip-media" data-category={product.category}>
                  <img src={product.imageUrl} alt="" loading="lazy" onError={hideBrokenImage} />
                </div>
                <div className="slip-text">
                  <span className="slip-cat">{product.category}</span>
                  <p className="slip-name">{product.name}</p>
                  <span className="slip-reason">{product.aiReason}</span>
                </div>
              </motion.article>
            ))}
          </motion.div>
          <p className="slip-foot">
            <Sparkles size={14} aria-hidden="true" />
            相手・予算・好みから AI が選定
          </p>
        </motion.aside>
      </section>

      <section className="value-section">
        <div className="section-head section-head--center">
          <p className="eyebrow">how it works</p>
          <h2 className="section-title">3ステップで、迷わず贈れる</h2>
        </div>
        <motion.div
          className="value-grid"
          variants={staggerGrid}
          initial="hidden"
          animate="show"
        >
          {steps.map((step) => (
            <motion.article className="step-card" key={step.num} variants={cardReveal}>
              <span className="step-badge">{step.num}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
              <Link className="step-link" to={step.link}>
                {step.linkLabel}
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </section>

      <section className="featured-section">
        <div className="section-head">
          <div>
            <p className="eyebrow">
              <Gift size={18} aria-hidden="true" />
              editors&apos; picks
            </p>
            <h2 className="section-title">いま人気のギフト</h2>
          </div>
          <Link className="section-link" to="/products">
            すべて見る
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <motion.div
          className="feature-grid"
          variants={staggerGrid}
          initial="hidden"
          animate="show"
        >
          {featured.map((product) => (
            <motion.div key={product.id} variants={cardReveal}>
              <Link className="feature-card" to={`/products/${product.id}`}>
                <div className="feature-media" data-category={product.category}>
                  <img src={product.imageUrl} alt="" loading="lazy" onError={hideBrokenImage} />
                </div>
                <div className="feature-body">
                  <span className="feature-cat">{product.category}</span>
                  <p className="feature-name">{product.name}</p>
                  <div className="feature-foot">
                    <span className="feature-price">{formatPrice(product.price)}</span>
                    <ArrowUpRight className="feature-go" size={18} aria-hidden="true" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="closing-cta">
        <div className="closing-inner">
          <p className="closing-eyebrow">まだ迷っていても大丈夫</p>
          <h2 className="closing-title">
            贈る相手を思い浮かべて、
            <br />
            話しかけるだけ。
          </h2>
          <p className="closing-lead">
            予算も、関係も、うまく言えない不安も、そのまま。AI が3つの候補に絞ってお渡しします。
          </p>
          <div className="closing-actions">
            <Link className="button closing-primary" to="/concierge">
              <Sparkles size={18} aria-hidden="true" />
              AIに相談する
            </Link>
            <Link className="closing-secondary" to="/products">
              商品を見る
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

function buildGuidedMessage(guide) {
  return `${guide.recipient}に贈るギフトを探しています。${guide.concern}相手にも渡しやすく、予算は${guide.budget}です。`
}
