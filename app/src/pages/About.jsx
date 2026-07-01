import { ArrowRight, BarChart3, MessagesSquare, ShieldCheck, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { cardReveal, staggerGrid } from '../lib/motion'

const proofs = [
  {
    icon: <MessagesSquare size={22} aria-hidden="true" />,
    title: '自然文の困りごと → 3品を理由つき提案',
    body: '「肌が弱い母へ、香り控えめで」——曖昧な相談を LLM が条件整理し、カタログから3品を「おすすめ理由・渡しやすい点・注意点」つきで提案。追加質問に答えて多ターンで絞り込める。',
  },
  {
    icon: <ShieldCheck size={22} aria-hidden="true" />,
    title: '業務に出せる AI 制御',
    body: 'API キーはブラウザ非公開（Supabase Edge Functions 経由）、カタログ属性への接地、AI 混雑時のフォールバック、薬機法に配慮した表現。PoC で終わらせない作り込み。',
  },
  {
    icon: <BarChart3 size={22} aria-hidden="true" />,
    title: 'AI が売上と改善に効くことを可視化',
    body: '店舗インサイト（/admin-demo）で相談傾向・AI 経由購入率・改善提案を表示。「AI で売る」だけでなく「AI で商品企画を改善する」まで一つの流れで示す。',
  },
]

const stack = [
  'React 19 + Vite',
  'Supabase Edge Functions',
  'LLM（DeepSeek）',
  'Cloudflare Pages',
  'Playwright E2E',
  'Motion / View Transitions',
]

export default function About() {
  return (
    <main className="site-page about-page">
      <section className="page-heading">
        <p className="eyebrow">
          <Sparkles size={18} aria-hidden="true" />
          About this demo
        </p>
        <h1>要件定義から本番デプロイまで、一人称で作った AI 実装デモ</h1>
        <p className="lead">
          このサイトは、黒澤俊文が要件定義・UI 設計・AI 実装・デプロイ・テストまで一人称で構築した、AI
          ギフトコンシェルジュの実装デモです。「自社プロダクトに“効く AI”を入れられるか」を、スライドではなく動くもので示すことを目的にしています。
        </p>
        <div className="cta-row">
          <Link className="button primary" to="/concierge">
            <Sparkles size={18} aria-hidden="true" />
            コンシェルジュを試す
          </Link>
          <Link className="button secondary" to="/admin-demo">
            店舗インサイトを見る
          </Link>
        </div>
      </section>

      <motion.section
        className="about-proofs"
        variants={staggerGrid}
        initial="hidden"
        animate="show"
        aria-label="このデモが示すこと"
      >
        {proofs.map((proof) => (
          <motion.article className="about-proof" key={proof.title} variants={cardReveal}>
            <span className="about-proof-icon">{proof.icon}</span>
            <h2>{proof.title}</h2>
            <p>{proof.body}</p>
          </motion.article>
        ))}
      </motion.section>

      <section className="about-stack">
        <h2 className="section-title">使用技術と担当範囲</h2>
        <div className="tag-list">
          {stack.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <p className="about-role">
          担当範囲: 要件定義 / 画面設計 / AI 実装（プロンプト設計・カタログ接地・フォールバック）/ 本番デプロイ / E2E まで、一人称で完遂。
        </p>
        <p className="about-back">
          <Link to="/">
            デモのトップへ戻る
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </p>
      </section>
    </main>
  )
}
