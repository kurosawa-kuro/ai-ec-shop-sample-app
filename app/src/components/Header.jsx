import { ShoppingBag, Sparkles } from 'lucide-react'
import { AnimatePresence, motion, useAnimate } from 'motion/react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getCart } from '../lib/cart'

function getCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0)
}

export default function Header() {
  const location = useLocation()
  const [cartCount, setCartCount] = useState(getCount)
  const [iconScope, animate] = useAnimate()

  useEffect(() => {
    setCartCount(getCount())
  }, [location.pathname])

  useEffect(() => {
    const onUpdate = () => setCartCount(getCount())
    window.addEventListener('cart-updated', onUpdate)
    return () => window.removeEventListener('cart-updated', onUpdate)
  }, [])

  useEffect(() => {
    const onArrived = () => {
      if (iconScope.current) {
        animate(iconScope.current, { scale: [1, 1.45, 0.82, 1.18, 1] }, { duration: 0.48 })
      }
    }
    window.addEventListener('cart-arrived', onArrived)
    return () => window.removeEventListener('cart-arrived', onArrived)
  }, [animate, iconScope])

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="header-logo" to="/">
          Lumière Select
        </Link>
        <nav className="header-nav" aria-label="サイトナビゲーション">
          <Link className="header-nav-products" to="/products">商品を見る</Link>
          <Link className="header-nav-admin" to="/admin-demo">店舗インサイト</Link>
          <Link to="/concierge" className="header-nav-cta">
            <Sparkles size={15} aria-hidden="true" />
            AIに相談
          </Link>
          <Link to="/cart" className="cart-link" aria-label={`カート（${cartCount}件）`}>
            <span ref={iconScope} style={{ display: 'inline-flex' }}>
              <ShoppingBag size={18} aria-hidden="true" />
            </span>
            カート
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  key="badge"
                  className="cart-badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 14 }}
                  aria-hidden="true"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </nav>
      </div>
    </header>
  )
}
