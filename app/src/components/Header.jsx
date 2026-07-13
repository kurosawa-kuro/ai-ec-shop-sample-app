import { BarChart3, Menu, PackageSearch, ShoppingBag, Sparkles, X } from 'lucide-react'
import { AnimatePresence, motion, useAnimate } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { getCart } from '../lib/cart'

const NAV_ITEMS = [
  { to: '/products', label: '商品を見る', icon: PackageSearch },
  { to: '/admin-demo', label: '店舗インサイト', icon: BarChart3 },
  { to: '/concierge', label: 'AIに相談', icon: Sparkles, accent: true },
]

function getCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0)
}

export default function Header() {
  const location = useLocation()
  const [cartCount, setCartCount] = useState(getCount)
  const [menuOpen, setMenuOpen] = useState(false)
  const [iconScope, animate] = useAnimate()
  const menuButtonRef = useRef(null)
  const firstMobileLinkRef = useRef(null)

  useEffect(() => {
    setCartCount(getCount())
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!menuOpen) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    firstMobileLinkRef.current?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [menuOpen])

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
          {NAV_ITEMS.map(({ to, label, icon: Icon, accent }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                ['header-nav-link', accent && 'header-nav-cta', isActive && 'is-active'].filter(Boolean).join(' ')
              }
            >
              {accent && <Icon size={15} aria-hidden="true" />}
              {label}
            </NavLink>
          ))}
          <NavLink
            to="/cart"
            className={({ isActive }) => `cart-link${isActive ? ' is-active' : ''}`}
            aria-label={`カート（${cartCount}件）`}
          >
            <span ref={iconScope} className="header-cart-icon">
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
          </NavLink>
        </nav>
        <div className="header-mobile-actions">
          <Link to="/cart" className="header-mobile-cart" aria-label={`カート（${cartCount}件）`}>
            <ShoppingBag size={20} aria-hidden="true" />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          <button
            ref={menuButtonRef}
            type="button"
            className="mobile-menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? 'メニューを閉じる' : 'メニューを開く'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              type="button"
              className="mobile-nav-backdrop"
              aria-label="メニューを閉じる"
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.aside
              id="mobile-navigation"
              className="mobile-nav-drawer"
              aria-label="モバイルナビゲーション"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 360, damping: 34 }}
            >
              <div className="mobile-nav-heading">
                <span>メニュー</span>
                <button type="button" onClick={() => setMenuOpen(false)} aria-label="メニューを閉じる">
                  <X size={20} aria-hidden="true" />
                </button>
              </div>
              <nav className="mobile-nav-list" aria-label="モバイルサイトナビゲーション">
                {NAV_ITEMS.map(({ to, label, icon: Icon, accent }, index) => (
                  <NavLink
                    key={to}
                    ref={index === 0 ? firstMobileLinkRef : undefined}
                    to={to}
                    className={({ isActive }) =>
                      ['mobile-nav-link', accent && 'mobile-nav-link-accent', isActive && 'is-active']
                        .filter(Boolean)
                        .join(' ')
                    }
                  >
                    <Icon size={19} aria-hidden="true" />
                    <span>{label}</span>
                  </NavLink>
                ))}
                <NavLink
                  to="/cart"
                  className={({ isActive }) => `mobile-nav-link${isActive ? ' is-active' : ''}`}
                >
                  <ShoppingBag size={19} aria-hidden="true" />
                  <span>カート</span>
                  <span className="mobile-nav-count">{cartCount}</span>
                </NavLink>
              </nav>
              <p className="mobile-nav-note">贈る気持ちを、AIと一緒に。</p>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
