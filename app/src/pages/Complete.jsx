import { CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import CheckoutSteps from '../components/CheckoutSteps'

export default function Complete() {
  const order = readLastOrder()

  return (
    <main className="site-page flow-page">
      <CheckoutSteps current={3} />

      <section className="complete-panel">
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
      </section>
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
