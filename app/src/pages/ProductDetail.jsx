import { ShoppingCart } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useRef } from 'react'
import products from '../data/products'
import { addToCart } from '../lib/cart'
import { startViewTransition } from '../lib/viewTransition'

export default function ProductDetail() {
  const imageRef = useRef(null)
  const { id } = useParams()
  const navigate = useNavigate()
  const product = products.find((item) => item.id === id) ?? products[0]

  const handleAddToCart = (event) => {
    addToCart(product)
    const sourceEl = imageRef.current ?? event.currentTarget
    const rect = sourceEl.getBoundingClientRect()
    window.dispatchEvent(new CustomEvent('cart-fly', {
      detail: { imageUrl: product.imageUrl, category: product.category, startRect: rect },
    }))
    window.dispatchEvent(new Event('cart-updated'))
    setTimeout(() => startViewTransition(() => navigate('/cart')), 320)
  }

  return (
    <main className="site-page detail-page">
      <Link className="text-link" to="/products">
        商品一覧へ戻る
      </Link>
      <section className="detail-layout">
        <div className="product-image detail-image" data-category={product.category} ref={imageRef}>
          <img src={product.imageUrl} alt={product.name} onError={(e) => { e.currentTarget.style.display = "none" }} />
        </div>
        <div className="detail-copy">
          <p className="product-category">{product.category}</p>
          <h1>{product.name}</h1>
          <p className="lead">{product.description}</p>
          <div className="tag-list">
            {product.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <section className="info-panel">
            <h2>AIおすすめ理由</h2>
            <p>{product.aiReason}</p>
          </section>
          <section className="info-panel">
            <h2>贈り先の目安</h2>
            <p>{product.giftFor.join('、')} に渡しやすい候補です。</p>
          </section>
          <div className="detail-actions">
            <strong>¥{new Intl.NumberFormat('ja-JP').format(product.price)}</strong>
            <button type="button" className="button primary" onClick={(e) => handleAddToCart(e)}>
              <ShoppingCart size={18} aria-hidden="true" />
              カートに入れる
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
