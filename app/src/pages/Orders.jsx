import { Link } from 'react-router-dom'
import EmptyState from '../components/ui/EmptyState'
import PageHeader from '../components/ui/PageHeader'
import { getOrders } from '../lib/cart'

export default function Orders() {
  const orders = getOrders()

  return (
    <main className="site-page flow-page">
      <PageHeader title="注文履歴">
        <p className="lead">localStorage に保存されたデモ注文の履歴です。</p>
      </PageHeader>

      {orders.length === 0 ? (
        <EmptyState
          title="注文履歴はまだありません"
          action={(
            <Link className="button primary" to="/products">
              商品を見る
            </Link>
          )}
        />
      ) : (
        <section className="orders-list">
          {orders.map((order) => (
            <article className="order-card" key={order.id}>
              <div>
                <p className="product-category">{order.fromAi ? 'AI相談経由' : '通常注文'}</p>
                <h2>{order.id}</h2>
                <p>{new Date(order.orderedAt).toLocaleString('ja-JP')}</p>
              </div>
              <div className="order-items">
                {order.items.map((item) => (
                  <span key={item.productId}>
                    {item.name} × {item.quantity}
                  </span>
                ))}
              </div>
              <strong>¥{new Intl.NumberFormat('ja-JP').format(order.total)}</strong>
            </article>
          ))}
        </section>
      )}
    </main>
  )
}
