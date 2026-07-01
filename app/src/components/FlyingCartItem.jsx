import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

const GRADIENTS = {
  スキンケア: 'linear-gradient(135deg,#fce4ec,#f8bbd9)',
  ボディケア: 'linear-gradient(135deg,#e8f5e9,#c8e6c9)',
  ヘアケア: 'linear-gradient(135deg,#fffde7,#fff9c4)',
  フレグランス: 'linear-gradient(135deg,#e8eaf6,#c5cae9)',
  ギフトセット: 'linear-gradient(135deg,#fdf0ed,#fceee8)',
  ネイル: 'linear-gradient(135deg,#fce4ec,#ffccbc)',
  リラクゼーション: 'linear-gradient(135deg,#e0f7fa,#b2ebf2)',
  コスメ: 'linear-gradient(135deg,#fce4ec,#ffccbc)',
}

export default function FlyingCartItem() {
  const [item, setItem] = useState(null)

  useEffect(() => {
    const onFly = (e) => {
      const cartEl = document.querySelector('.cart-link')
      if (!cartEl) return
      const cartRect = cartEl.getBoundingClientRect()
      setItem({ ...e.detail, cartRect, key: Date.now() })
    }
    window.addEventListener('cart-fly', onFly)
    return () => window.removeEventListener('cart-fly', onFly)
  }, [])

  return createPortal(
    <AnimatePresence>
      {item && (
        <Bullet
          key={item.key}
          item={item}
          onComplete={() => {
            setItem(null)
            window.dispatchEvent(new Event('cart-arrived'))
          }}
        />
      )}
    </AnimatePresence>,
    document.body,
  )
}

const SIZE = 54

const clamp = (v, min, max) => Math.min(Math.max(v, min), max)

function Bullet({ item, onComplete }) {
  const { startRect, cartRect, imageUrl, category } = item

  const sx = startRect.left + startRect.width / 2 - SIZE / 2
  const sy = startRect.top + startRect.height / 2 - SIZE / 2
  // カート座標が viewport 外でも画面外へ飛ばさない（追加成功が伝わることを優先）
  const ex = clamp(cartRect.left + cartRect.width / 2 - 10, 24, window.innerWidth - 24)
  const ey = clamp(cartRect.top + cartRect.height / 2 - 10, 24, Math.min(96, window.innerHeight - 24))

  // Arc peak: halfway horizontally, higher than both endpoints
  const mx = (sx + ex) / 2
  const my = Math.min(sy, ey) - 110

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: SIZE,
        height: SIZE,
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 6px 24px rgba(0,0,0,0.22)',
        border: '2.5px solid rgba(255,255,255,0.9)',
        pointerEvents: 'none',
        zIndex: 9999,
        background: GRADIENTS[category] ?? 'linear-gradient(135deg,#fdf0ed,#ead9d5)',
      }}
      initial={{ x: sx, y: sy, scale: 1, opacity: 1 }}
      animate={{
        x: [sx, mx, ex],
        y: [sy, my, ey],
        scale: [1, 0.88, 0.22],
        opacity: [1, 1, 0],
      }}
      transition={{
        duration: 0.6,
        times: [0, 0.42, 1],
        ease: ['easeOut', 'easeIn'],
      }}
      onAnimationComplete={onComplete}
    >
      {imageUrl && (
        <img
          src={imageUrl}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          alt=""
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
      )}
    </motion.div>
  )
}
