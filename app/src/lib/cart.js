const CART_KEY = 'lumiere-cart'
const ORDERS_KEY = 'lumiere-orders'
const AI_CONTEXT_KEY = 'lumiere-ai-context'
const CONSULTATIONS_KEY = 'lumiere-consultations'
const CART_EVENTS_KEY = 'lumiere-cart-events'

export function getCart() {
  return readJson(CART_KEY, [])
}

export function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

export function addToCart(product, quantity = 1, source = 'browse') {
  const cart = getCart()
  const existing = cart.find((item) => item.productId === product.id)
  if (existing) {
    existing.quantity += quantity
    existing.source = existing.source === 'concierge' ? existing.source : source
  } else {
    cart.push({
      productId: product.id,
      quantity,
      source,
      addedAt: new Date().toISOString(),
    })
  }
  saveCart(cart)
  recordCartEvent(product.id, quantity, source)
  if (source === 'concierge') {
    saveAiContext([product.id])
  }
  return cart
}

export function updateCartQuantity(productId, quantity) {
  const nextCart = getCart()
    .map((item) => (item.productId === productId ? { ...item, quantity } : item))
    .filter((item) => item.quantity > 0)
  saveCart(nextCart)
  return nextCart
}

export function removeFromCart(productId) {
  const nextCart = getCart().filter((item) => item.productId !== productId)
  saveCart(nextCart)
  return nextCart
}

export function clearCart() {
  saveCart([])
}

export function getOrders() {
  return readJson(ORDERS_KEY, [])
}

export function saveOrder(order) {
  const orders = [order, ...getOrders()]
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
  return orders
}

export function saveAiContext(productIds, query = '') {
  localStorage.setItem(
    AI_CONTEXT_KEY,
    JSON.stringify({
      productIds,
      query,
      savedAt: new Date().toISOString(),
    }),
  )
}

export function getAiContext() {
  return readJson(AI_CONTEXT_KEY, null)
}

export function getConsultations() {
  return readJson(CONSULTATIONS_KEY, [])
}

export function recordConsultation(query, recommendedProductIds = []) {
  const consultations = [
    {
      query,
      recommendedProductIds,
      createdAt: new Date().toISOString(),
    },
    ...getConsultations(),
  ].slice(0, 50)
  localStorage.setItem(CONSULTATIONS_KEY, JSON.stringify(consultations))
  return consultations
}

export function getCartEvents() {
  return readJson(CART_EVENTS_KEY, [])
}

function recordCartEvent(productId, quantity, source) {
  const events = [
    {
      productId,
      quantity,
      source,
      createdAt: new Date().toISOString(),
    },
    ...getCartEvents(),
  ].slice(0, 100)
  localStorage.setItem(CART_EVENTS_KEY, JSON.stringify(events))
}

export function createOrderNumber(date = new Date()) {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const serial = String(Math.floor(Math.random() * 900) + 100)
  return `DEMO-${yyyy}${mm}${dd}-${serial}`
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}
