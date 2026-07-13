import { Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import CheckoutSteps from '../components/CheckoutSteps'
import TransitionLink from '../components/TransitionLink'
import EmptyState from '../components/ui/EmptyState'
import PageHeader from '../components/ui/PageHeader'
import Panel from '../components/ui/Panel'
import products from '../data/products'
import { getCart, removeFromCart, updateCartQuantity } from '../lib/cart'

export default function Cart() {
  const [cart, setCart] = useState(() => getCart())
  const lines = useMemo(
    () =>
      cart
        .map((item) => ({
          ...item,
          product: products.find((product) => product.id === item.productId),
        }))
        .filter((item) => item.product),
    [cart],
  )
  const total = lines.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  const handleQuantity = (productId, quantity) => {
    setCart(updateCartQuantity(productId, Number(quantity)))
  }

  const handleRemove = (productId) => {
    setCart(removeFromCart(productId))
  }

  return (
    <main className="site-page flow-page">
      <CheckoutSteps current={1} />

      <PageHeader
        title="カートを確認"
        actions={(
          <Link className="text-link" to="/products">
            ← 商品一覧へ戻る
          </Link>
        )}
      >
        <p className="lead">数量の変更や削除をして、内容がよければ次へ進んでください。</p>
      </PageHeader>

      {lines.length === 0 ? (
        <EmptyState
          title="カートは空です"
          action={(
            <Link className="button primary" to="/products">
              商品を見る
            </Link>
          )}
        />
      ) : (
        <section className="flow-layout">
          <div className="line-list">
            {lines.map(({ product, quantity, source }) => (
              <article className="cart-line" key={product.id}>
                <div className="product-image small" data-category={product.category}>
                  <img src={product.imageUrl} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = "none" }} />
                </div>
                <div>
                  <p className="product-category">{source === 'concierge' ? 'AI相談経由' : product.category}</p>
                  <h2>{product.name}</h2>
                  <p>¥{formatPrice(product.price)}</p>
                </div>
                <label>
                  数量
                  <input
                    type="number"
                    min="1"
                    max="9"
                    value={quantity}
                    onChange={(event) => handleQuantity(product.id, event.target.value)}
                  />
                </label>
                <strong>¥{formatPrice(product.price * quantity)}</strong>
                <button type="button" className="icon-button" onClick={() => handleRemove(product.id)}>
                  <Trash2 size={18} aria-hidden="true" />
                  <span className="sr-only">削除</span>
                </button>
              </article>
            ))}
          </div>

          <Panel as="aside" className="summary-panel">
            <p>小計</p>
            <strong>¥{formatPrice(total)}</strong>
            <TransitionLink className="button primary" to="/checkout">
              お客様情報の入力へ →
            </TransitionLink>
            <Link className="button secondary" to="/products">
              ← 買い物を続ける
            </Link>
          </Panel>
        </section>
      )}
    </main>
  )
}

function formatPrice(price) {
  return new Intl.NumberFormat('ja-JP').format(price)
}
