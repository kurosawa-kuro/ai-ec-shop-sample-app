import { CheckCircle2, Copy, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import CheckoutSteps from '../components/CheckoutSteps'
import Panel from '../components/ui/Panel'
import { getAiContext } from '../lib/cart'
import { generateGiftMessage } from '../lib/supabase'

const fallbackGiftMessage = '最近忙しそうだったので、少しでもほっとできる時間になればと思って選びました。'

export default function Complete() {
  const order = readLastOrder()
  const aiContext = getAiContext()
  const [giftMessage, setGiftMessage] = useState('')
  const [messageStatus, setMessageStatus] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateMessage = async () => {
    setIsGenerating(true)
    setMessageStatus('')
    try {
      const data = await generateGiftMessage({
        query: aiContext?.query ?? '',
        productNames: order?.items?.map((item) => item.name) ?? order?.recommendedProductNames ?? [],
      })
      setGiftMessage(data?.message || fallbackGiftMessage)
    } catch (error) {
      setGiftMessage(error?.name === 'AiLimitExceededError' ? fallbackGiftMessage : fallbackGiftMessage)
      setMessageStatus(error?.name === 'AiLimitExceededError' ? error.message : 'AIが混み合っています。定型文を表示しました。')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyMessage = async () => {
    if (!giftMessage) return
    try {
      await navigator.clipboard.writeText(giftMessage)
      setMessageStatus('添え書きをコピーしました。')
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = giftMessage
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      const copied = document.execCommand('copy')
      document.body.removeChild(textarea)
      setMessageStatus(copied ? '添え書きをコピーしました。' : 'コピーできませんでした。テキストを選択してコピーしてください。')
    }
  }

  return (
    <main className="site-page flow-page">
      <CheckoutSteps current={3} />

      <Panel className="complete-panel">
        <CheckCircle2 size={42} aria-hidden="true" />
        <h1>ご注文ありがとうございます</h1>
        {order ? (
          <>
            <p className="lead">注文が完了しました。注文内容は以下からご確認いただけます。</p>
            <dl className="order-facts">
              <div>
                <dt>注文番号</dt>
                <dd>{order.id}</dd>
              </div>
              <div>
                <dt>AI相談経由</dt>
                <dd>{order.fromAi ? 'あり' : 'なし'}</dd>
              </div>
              <div>
                <dt>推薦商品</dt>
                <dd>{order.recommendedProductNames?.join('、') || 'なし'}</dd>
              </div>
            </dl>
            <section className="gift-message-panel">
              <div>
                <h2>ギフトに添える一言</h2>
                <p>相談内容と選んだ商品から、重すぎない一言を作れます。</p>
              </div>
              <button type="button" className="button secondary" onClick={handleGenerateMessage} disabled={isGenerating}>
                <Sparkles size={17} aria-hidden="true" />
                {isGenerating ? '作成中...' : 'AIで一言を作る'}
              </button>
              {giftMessage && (
                <div className="gift-message-result">
                  <p>{giftMessage}</p>
                  <button type="button" onClick={handleCopyMessage}>
                    <Copy size={16} aria-hidden="true" />
                    コピー
                  </button>
                </div>
              )}
              {messageStatus && <p className="gift-message-status">{messageStatus}</p>}
            </section>
          </>
        ) : (
          <p className="lead">直近の注文情報が見つかりません。注文履歴から確認してください。</p>
        )}
        <div className="cta-row">
          <Link className="button primary" to="/orders">
            注文履歴を見る
          </Link>
          <Link className="button secondary" to="/">
            トップへ戻る
          </Link>
        </div>
      </Panel>
    </main>
  )
}

function readLastOrder() {
  try {
    const raw = sessionStorage.getItem('lumiere-last-order')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
