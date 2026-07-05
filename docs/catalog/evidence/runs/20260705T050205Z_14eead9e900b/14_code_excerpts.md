# Controlled Code Excerpts

evidence_id: ev.code_excerpts.summary

Small deterministic source excerpts around public/test anchors. This is controlled raw evidence for investigation; it is not a license to read or paste the full repository.

## app/src/App.jsx:14-20 `App`

language: `typescript`

```text
14: import AdminDemo from './pages/AdminDemo'
15: import About from './pages/About'
16: 
17: export default function App() {
18:   return (
19:     <MotionConfig reducedMotion="user">
20:       <BrowserRouter>
```

## app/src/components/CheckoutSteps.jsx:1-6 `CheckoutSteps`

language: `typescript`

```text
1: const STEPS = ['カートを確認', 'お客様情報', '注文完了']
2: 
3: export default function CheckoutSteps({ current }) {
4:   return (
5:     <nav className="checkout-steps" aria-label="購入ステップ">
6:       {STEPS.map((label, i) => {
```

## app/src/components/FlyingCartItem.jsx:13-19 `FlyingCartItem`

language: `typescript`

```text
13:   コスメ: 'linear-gradient(135deg,#fce4ec,#ffccbc)',
14: }
15: 
16: export default function FlyingCartItem() {
17:   const [item, setItem] = useState(null)
18: 
19:   useEffect(() => {
```

## app/src/components/Footer.jsx:8-14 `Footer`

language: `typescript`

```text
8:   { label: 'お問い合わせ', href: '#contact' },
9: ]
10: 
11: export default function Footer() {
12:   return (
13:     <footer className="site-footer">
14:       <div className="footer-inner">
```

## app/src/components/Header.jsx:8-14 `Header`

language: `typescript`

```text
8:   return getCart().reduce((sum, item) => sum + item.quantity, 0)
9: }
10: 
11: export default function Header() {
12:   const location = useLocation()
13:   const [cartCount, setCartCount] = useState(getCount)
14:   const [iconScope, animate] = useAnimate()
```

## app/src/components/TransitionLink.jsx:1-7 `TransitionLink`

language: `typescript`

```text
1: import { Link, useNavigate } from 'react-router-dom'
2: import { startViewTransition } from '../lib/viewTransition'
3: 
4: export default function TransitionLink({ to, onClick, target, children, ...props }) {
5:   const navigate = useNavigate()
6: 
7:   const handleClick = (event) => {
```

## app/src/data/engineer-profile.js:163-169 `buildSystemPrompt`

language: `typescript`

```text
163:  * AI プロンプトへの埋め込み用テキスト生成
164:  * consult-engineer Edge Function の system prompt に挿入する。
165:  */
166: export function buildSystemPrompt() {
167:   const strengths = engineerProfile.strengths
168:     .map((s) => `- ${s.area}（得意度: ${s.strength === "high" ? "高" : "中"}）: ${s.detail}`)
169:     .join("\n");
```

## app/src/lib/aiLimit.js:1-4 `AiLimitExceededError`

language: `typescript`

```text
1: export class AiLimitExceededError extends Error {
2:   constructor(limit) {
3:     super(`本日のAI利用回数の上限（${limit}回）に達しました。明日またご利用ください。`)
4:     this.name = 'AiLimitExceededError'
```

## app/src/lib/aiLimit.js:22-28 `consumeAiLimit`

language: `typescript`

```text
22:   localStorage.setItem(limitSignatureKey, signature)
23: }
24: 
25: export function consumeAiLimit() {
26:   ensureCurrentLimitSignature()
27:   const limit = __AI_DAILY_LIMIT__
28: <redacted sensitive-looking assignment>
```

## app/src/lib/aiLimit.js:38-43 `getAiDailyLimit`

language: `typescript`

```text
38:   return parseInt(localStorage.getItem(storageKey()) ?? '0')
39: }
40: 
41: export function getAiDailyLimit() {
42:   return __AI_DAILY_LIMIT__
43: }
```

## app/src/lib/aiLimit.js:33-39 `getAiUsageToday`

language: `typescript`

```text
33:   localStorage.setItem(key, String(current + 1))
34: }
35: 
36: export function getAiUsageToday() {
37:   ensureCurrentLimitSignature()
38:   return parseInt(localStorage.getItem(storageKey()) ?? '0')
39: }
```

## app/src/lib/cart.js:12-18 `addToCart`

language: `typescript`

```text
12:   localStorage.setItem(CART_KEY, JSON.stringify(items))
13: }
14: 
15: export function addToCart(product, quantity = 1, source = 'browse') {
16:   const cart = getCart()
17:   const existing = cart.find((item) => item.productId === product.id)
18:   if (existing) {
```

## app/src/lib/cart.js:49-55 `clearCart`

language: `typescript`

```text
49:   return nextCart
50: }
51: 
52: export function clearCart() {
53:   saveCart([])
54: }
55: 
```

## app/src/lib/cart.js:113-119 `createOrderNumber`

language: `typescript`

```text
113:   localStorage.setItem(CART_EVENTS_KEY, JSON.stringify(events))
114: }
115: 
116: export function createOrderNumber(date = new Date()) {
117:   const yyyy = date.getFullYear()
118:   const mm = String(date.getMonth() + 1).padStart(2, '0')
119:   const dd = String(date.getDate()).padStart(2, '0')
```

## app/src/lib/cart.js:75-81 `getAiContext`

language: `typescript`

```text
75:   )
76: }
77: 
78: export function getAiContext() {
79:   return readJson(AI_CONTEXT_KEY, null)
80: }
81: 
```

## app/src/lib/cart.js:4-10 `getCart`

language: `typescript`

```text
4: <redacted sensitive-looking assignment>
5: <redacted sensitive-looking assignment>
6: 
7: export function getCart() {
8:   return readJson(CART_KEY, [])
9: }
10: 
```

## app/src/lib/cart.js:96-102 `getCartEvents`

language: `typescript`

```text
96:   return consultations
97: }
98: 
99: export function getCartEvents() {
100:   return readJson(CART_EVENTS_KEY, [])
101: }
102: 
```

## app/src/lib/cart.js:79-85 `getConsultations`

language: `typescript`

```text
79:   return readJson(AI_CONTEXT_KEY, null)
80: }
81: 
82: export function getConsultations() {
83:   return readJson(CONSULTATIONS_KEY, [])
84: }
85: 
```

## app/src/lib/cart.js:53-59 `getOrders`

language: `typescript`

```text
53:   saveCart([])
54: }
55: 
56: export function getOrders() {
57:   return readJson(ORDERS_KEY, [])
58: }
59: 
```

## app/src/lib/cart.js:83-89 `recordConsultation`

language: `typescript`

```text
83:   return readJson(CONSULTATIONS_KEY, [])
84: }
85: 
86: export function recordConsultation(query, recommendedProductIds = []) {
87:   const consultations = [
88:     {
89:       query,
```

## app/src/lib/cart.js:43-49 `removeFromCart`

language: `typescript`

```text
43:   return nextCart
44: }
45: 
46: export function removeFromCart(productId) {
47:   const nextCart = getCart().filter((item) => item.productId !== productId)
48:   saveCart(nextCart)
49:   return nextCart
```

## app/src/lib/cart.js:63-69 `saveAiContext`

language: `typescript`

```text
63:   return orders
64: }
65: 
66: export function saveAiContext(productIds, query = '', recommendations = []) {
67:   localStorage.setItem(
68:     AI_CONTEXT_KEY,
69:     JSON.stringify({
```

## app/src/lib/cart.js:8-14 `saveCart`

language: `typescript`

```text
8:   return readJson(CART_KEY, [])
9: }
10: 
11: export function saveCart(items) {
12:   localStorage.setItem(CART_KEY, JSON.stringify(items))
13: }
14: 
```

## app/src/lib/cart.js:57-63 `saveOrder`

language: `typescript`

```text
57:   return readJson(ORDERS_KEY, [])
58: }
59: 
60: export function saveOrder(order) {
61:   const orders = [order, ...getOrders()]
62:   localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
63:   return orders
```

## Guardrail

- Excerpts are capped and redacted for sensitive-looking assignment lines. Confirm full context with owner approval before relying on omitted lines.
