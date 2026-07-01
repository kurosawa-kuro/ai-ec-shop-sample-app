import { BarChart3, Gauge, Lightbulb, MessageSquareText, ShoppingBag, Sparkles, TrendingUp } from 'lucide-react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import products from '../data/products'
import {
  sampleAiUsageToday,
  sampleCartEvents,
  sampleConsultations,
  sampleOrders,
} from '../data/admin-demo-sample'
import { getAiDailyLimit, getAiUsageToday } from '../lib/aiLimit'
import { getCartEvents, getConsultations, getOrders } from '../lib/cart'
import { cardReveal, fadeUp, staggerFast, staggerGrid } from '../lib/motion'

const consultationTopics = [
  { label: '彼女・パートナーへ',  keywords: ['彼女', 'パートナー', '好きな人', '気になる人'] },
  { label: '予算・コスパ重視',    keywords: ['予算', '円以内', 'コスパ', 'プチギフト', '安い', '手頃'] },
  { label: '肌悩み・敏感肌',      keywords: ['敏感肌', '乾燥肌', '肌が弱', '刺激', '保湿', '乾燥'] },
  { label: '美容初心者向け',      keywords: ['美容初心者', '初心者', '詳しくない', '分からない', '始めて'] },
  { label: '香り・リラックス',    keywords: ['香り', 'アロマ', 'リラックス', '癒し', 'バス', '香水'] },
  { label: '高見え・記念日',      keywords: ['高見え', '記念日', '誕生日', '特別', 'プレゼント', 'ギフト'] },
  { label: '自分へのご褒美',      keywords: ['自分へ', 'ご褒美', '自分用', '自分のため'] },
  { label: '友人・同僚へ',        keywords: ['友人', '友達', '同僚', '職場', '先輩', '後輩'] },
  { label: '母・家族へ',          keywords: ['母', 'お母さん', '妻', '家族', '親', '祖母'] },
  { label: '失敗しにくい定番',    keywords: ['失敗', '定番', '無難', '喜ばれ', '迷っ'] },
]

const suggestions = [
  {
    title: '相談チップを改善する',
    body: '「予算」と「相手との関係」が相談に出やすいため、トップのチップをギフト文脈に寄せると相談開始率が上がりそうです。',
    link: '/',
    linkLabel: 'トップを見る →',
  },
  {
    title: 'ギフトセットを前面に出す',
    body: 'AI 経由注文ではセット商品が選ばれやすい傾向です。ギフトセットの見せ方を一覧上部に寄せると購入まで短縮できます。',
    link: '/products',
    linkLabel: '商品一覧を見る →',
  },
  {
    title: '「香り控えめ」タグを強調',
    body: '香りの強さに不安がある相談が出やすいため、「香り控えめ」タグをカード上で目立たせると離脱を減らせそうです。',
    link: '/products',
    linkLabel: '商品一覧を見る →',
  },
]

export default function AdminDemo() {
  const realOrders = getOrders()
  const realConsultations = getConsultations()
  const realCartEvents = getCartEvents()

  // このセッションで活動がまだ無ければサンプルデータで表示する（すべて 0 で崩れて見えるのを防ぐ）。
  const isSample =
    realOrders.length === 0 && realConsultations.length === 0 && realCartEvents.length === 0

  const orders = isSample ? sampleOrders : realOrders
  const consultations = isSample ? sampleConsultations : realConsultations
  const cartEvents = isSample ? sampleCartEvents : realCartEvents

  const today = new Date().toDateString()
  const todaysConsultations = consultations.filter(
    (item) => new Date(item.createdAt).toDateString() === today,
  )
  const aiOrders = orders.filter((order) => order.fromAi)
  const totalSales = orders.reduce((sum, order) => sum + order.total, 0)
  const convRate = consultations.length > 0
    ? Math.round((aiOrders.length / consultations.length) * 100)
    : null
  const topTopics = rankConsultationTopics(consultations)
  const topProducts = rankProducts(orders, cartEvents)
  const aiUsageToday = isSample ? sampleAiUsageToday : getAiUsageToday()
  const aiDailyLimit = getAiDailyLimit()
  const aiRemaining = Math.max(0, aiDailyLimit - aiUsageToday)

  return (
    <main className="site-page admin-page">
      <section className="page-heading">
        <p className="eyebrow">
          <BarChart3 size={18} aria-hidden="true" />
          Store AI dashboard
        </p>
        <h1>店舗インサイト</h1>
        <p className="lead">
          セッション内の localStorage から、AI 経由注文・よくある相談・売れ筋・改善提案を見せる店舗側デモ画面です。
        </p>
        {isSample && (
          <p className="sample-badge">
            <Sparkles size={14} aria-hidden="true" />
            サンプルデータを表示中 — 相談や注文を行うと、この画面に実績が反映されます。
          </p>
        )}
      </section>

      <motion.section
        className="metric-grid"
        aria-label="店舗指標"
        variants={staggerGrid}
        initial="hidden"
        animate="show"
      >
        <MetricCard
          icon={<MessageSquareText size={22} aria-hidden="true" />}
          label="今日の相談件数"
          rawValue={todaysConsultations.length}
          valueSuffix="件"
          note="コンシェルジュ送信数"
        />
        <MetricCard
          icon={<Sparkles size={22} aria-hidden="true" />}
          label="AI 経由注文数"
          rawValue={aiOrders.length}
          valueSuffix="件"
          note={`全注文 ${orders.length} 件`}
        />
        <MetricCard
          icon={<ShoppingBag size={22} aria-hidden="true" />}
          label="デモ売上"
          rawValue={totalSales}
          valuePrefix="¥"
          note="localStorage 注文合計"
        />
        <MetricCard
          icon={<TrendingUp size={22} aria-hidden="true" />}
          label="AI 相談→購入率"
          rawValue={convRate !== null ? convRate : '—'}
          valueSuffix={convRate !== null ? '%' : ''}
          note={`${consultations.length} 相談中`}
        />
        <MetricCard
          icon={<Gauge size={22} aria-hidden="true" />}
          label="AI 利用回数（本日）"
          rawValue={aiUsageToday}
          valueSuffix={` / ${aiDailyLimit} 回`}
          note={`本日の上限まで残り ${aiRemaining} 回`}
        />
      </motion.section>

      <section className="admin-grid">
        <DashboardPanel title="よくある相談トップ3">
          {topTopics.length > 0 ? (
            <motion.ol className="rank-list" variants={staggerFast} initial="hidden" animate="show">
              {topTopics.map((topic) => (
                <motion.li key={topic.label} variants={fadeUp}>
                  <span>{topic.label}</span>
                  <strong>{topic.count}回</strong>
                </motion.li>
              ))}
            </motion.ol>
          ) : (
            <EmptyAdminState link="/concierge" label="相談デモを作る" text="まだ相談履歴がありません。" />
          )}
        </DashboardPanel>

        <DashboardPanel title="売れ筋商品 Top 5">
          {topProducts.length > 0 ? (
            <motion.ol className="rank-list" variants={staggerFast} initial="hidden" animate="show">
              {topProducts.map(({ product, count }) => (
                <motion.li key={product.id} variants={fadeUp}>
                  <span>{product.name}</span>
                  <strong>{count}点</strong>
                </motion.li>
              ))}
            </motion.ol>
          ) : (
            <EmptyAdminState link="/products" label="商品を購入する" text="まだカート追加・注文履歴がありません。" />
          )}
        </DashboardPanel>
      </section>

      <section className="improvement-panel">
        <div className="improvement-head">
          <div>
            <p className="eyebrow">
              <Lightbulb size={18} aria-hidden="true" />
              AI improvement ideas
            </p>
            <h2>AI 改善提案</h2>
          </div>
          <p className="improvement-subtitle">
            相談データに基づいた自動提案
          </p>
        </div>
        <motion.div
          className="suggestion-list"
          variants={staggerFast}
          initial="hidden"
          animate="show"
        >
          {suggestions.map((item, index) => (
            <motion.div className="suggestion-item" key={item.title} variants={cardReveal}>
              <span className="suggestion-num">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <strong>{item.title}</strong>
                <p>{item.body}</p>
                <Link className="suggestion-link" to={item.link}>
                  {item.linkLabel}
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </main>
  )
}

function CountUp({ to, prefix = '', suffix = '' }) {
  const mv = useMotionValue(0)
  const spring = useSpring(mv, { stiffness: 80, damping: 22, restDelta: 0.5 })
  const [display, setDisplay] = useState(0)

  useEffect(() => { mv.set(to) }, [mv, to])
  useEffect(() => spring.on('change', (v) => setDisplay(Math.round(v))), [spring])

  return <>{prefix}{display.toLocaleString('ja-JP')}{suffix}</>
}

function MetricCard({ icon, label, rawValue, valuePrefix = '', valueSuffix = '', note }) {
  const isNum = typeof rawValue === 'number'
  return (
    <motion.article className="metric-card" variants={cardReveal}>
      <div className="metric-icon">{icon}</div>
      <p>{label}</p>
      <strong>
        {isNum
          ? <CountUp to={rawValue} prefix={valuePrefix} suffix={valueSuffix} />
          : rawValue
        }
      </strong>
      <span>{note}</span>
    </motion.article>
  )
}

function DashboardPanel({ title, children }) {
  return (
    <section className="dashboard-panel">
      <h2>{title}</h2>
      {children}
    </section>
  )
}

function EmptyAdminState({ text, link, label }) {
  return (
    <div className="admin-empty">
      <p>{text}</p>
      <Link className="button secondary" to={link}>
        {label}
      </Link>
    </div>
  )
}

function rankConsultationTopics(consultations) {
  const counts = new Map()
  for (const consultation of consultations) {
    for (const topic of consultationTopics) {
      if (topic.keywords.some((kw) => consultation.query.includes(kw))) {
        counts.set(topic.label, (counts.get(topic.label) ?? 0) + 1)
      }
    }
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
}

function rankProducts(orders, cartEvents) {
  const counts = new Map()
  for (const event of cartEvents) {
    counts.set(event.productId, (counts.get(event.productId) ?? 0) + event.quantity)
  }
  for (const order of orders) {
    for (const item of order.items) {
      counts.set(item.productId, (counts.get(item.productId) ?? 0) + item.quantity)
    }
  }
  return [...counts.entries()]
    .map(([productId, count]) => ({
      product: products.find((product) => product.id === productId),
      count,
    }))
    .filter((item) => item.product)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
}
