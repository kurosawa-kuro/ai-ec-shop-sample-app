import { ShoppingCart } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useRef } from 'react'
import products from '../data/products'
import { addToCart, getAiContext } from '../lib/cart'
import { getGiftLabels } from '../lib/giftLabels'
import { startViewTransition } from '../lib/viewTransition'

export default function ProductDetail() {
  const imageRef = useRef(null)
  const { id } = useParams()
  const navigate = useNavigate()
  const product = products.find((item) => item.id === id) ?? products[0]
  const aiContext = getAiContext()
  const aiRecommendation = aiContext?.recommendations?.find((item) => item.productId === product.id)
  const isAiSuggested = Boolean(aiContext?.productIds?.includes(product.id))
  const giftLabels = getGiftLabels(product)

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
          {giftLabels.length > 0 && (
            <div className="gift-label-list" aria-label="ギフト適合ラベル">
              {giftLabels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          )}
          {isAiSuggested && (
            <section className="info-panel ai-context-panel">
              <h2>あなたの相談から選ばれました</h2>
              {aiContext?.query && <p className="context-query">「{aiContext.query}」</p>}
              <p>{aiRecommendation?.reason ?? product.aiReason}</p>
              {aiRecommendation?.easyToGive && <p>{aiRecommendation.easyToGive}</p>}
            </section>
          )}
          <section className="info-panel">
            <h2>AIおすすめ理由</h2>
            <p>{product.aiReason}</p>
          </section>
          <section className="info-panel">
            <h2>AI相談でよく選ばれる理由</h2>
            <ul className="detail-reason-list">
              {buildFrequentReasons(product, giftLabels).map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
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

function buildFrequentReasons(product, labels) {
  const reasons = []
  if (labels.includes('失敗しにくい')) reasons.push('定番感があり、相手の好みが分からない相談でも候補にしやすいです。')
  if (labels.includes('高見え')) reasons.push('見た目や内容にギフト感があり、きちんと選んだ印象を作りやすいです。')
  if (labels.includes('香り控えめ')) reasons.push('香りの好みが分かれそうな相談でも、控えめな候補として選びやすいです。')
  if (labels.includes('美容初心者にも渡しやすい')) reasons.push('美容に詳しくない相手にも使う場面が伝わりやすいです。')
  if (product.price <= 5000) reasons.push('予算5,000円前後の相談に収まりやすい価格帯です。')
  if (reasons.length === 0) reasons.push('相談内容に合わせて、用途や贈り先が分かりやすい候補として選ばれやすいです。')
  return reasons.slice(0, 3)
}
