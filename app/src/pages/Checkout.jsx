import { CreditCard } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CheckoutSteps from '../components/CheckoutSteps'
import products from '../data/products'
import { clearCart, createOrderNumber, getAiContext, getCart, saveOrder } from '../lib/cart'
import { startViewTransition } from '../lib/viewTransition'

const DEMO_ITEMS = [
  { productId: 'gift-001', quantity: 1, source: 'concierge' },
  { productId: 'skincare-001', quantity: 1, source: 'products' },
]

export default function Checkout() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const cart = useMemo(() => getCart(), [])
  const cartLines = useMemo(
    () =>
      cart
        .map((item) => ({ ...item, product: products.find((p) => p.id === item.productId) }))
        .filter((item) => item.product),
    [cart],
  )

  const isDemo = cartLines.length === 0
  const lines = isDemo
    ? DEMO_ITEMS.map((item) => ({ ...item, product: products.find((p) => p.id === item.productId) })).filter(
        (item) => item.product,
      )
    : cartLines
  const total = lines.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  const handleSubmit = (event) => {
    event.preventDefault()
    const aiContext = getAiContext()
    const order = {
      id: createOrderNumber(),
      orderedAt: new Date().toISOString(),
      customer: {
        name: name || 'デモ ユーザー',
        email: email || 'demo@lumiere-select.example.com',
      },
      items: lines.map(({ product, quantity, source }) => ({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        source,
      })),
      total,
      fromAi: isDemo || lines.some((item) => item.source === 'concierge') || Boolean(aiContext?.productIds?.length),
      recommendedProductNames: (aiContext?.productIds ?? [])
        .map((id) => products.find((p) => p.id === id)?.name)
        .filter(Boolean),
    }

    saveOrder(order)
    clearCart()
    sessionStorage.setItem('lumiere-last-order', JSON.stringify(order))
    startViewTransition(() => navigate('/complete'))
  }

  return (
    <main className="site-page flow-page">
      <CheckoutSteps current={2} />

      <section className="page-heading">
        <Link className="text-link" to="/cart">
          ← カートに戻る
        </Link>
        <h1>お客様情報の入力</h1>
        <p className="lead">デモ用の簡易フォームです。実決済・配送処理は行いません。</p>
      </section>

      <form className="checkout-layout" onSubmit={handleSubmit}>
        <section className="checkout-form">
          <label>
            お名前
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="山田 花子（空欄でもデモ送信できます）"
            />
          </label>
          <label>
            メールアドレス
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="hanako@example.com（任意）"
            />
          </label>
          <button type="submit" className="button primary">
            <CreditCard size={18} aria-hidden="true" />
            注文を確定する（デモ）
          </button>
        </section>

        <aside className="summary-panel">
          <p>注文内容{isDemo ? '（デモサンプル）' : ''}</p>
          {lines.map(({ product, quantity }) => (
            <div className="summary-line" key={product.id}>
              <span>
                {product.name} × {quantity}
              </span>
              <strong>¥{formatPrice(product.price * quantity)}</strong>
            </div>
          ))}
          <hr />
          <div className="summary-line total">
            <span>合計</span>
            <strong>¥{formatPrice(total)}</strong>
          </div>
        </aside>
      </form>
    </main>
  )
}

function formatPrice(price) {
  return new Intl.NumberFormat('ja-JP').format(price)
}
