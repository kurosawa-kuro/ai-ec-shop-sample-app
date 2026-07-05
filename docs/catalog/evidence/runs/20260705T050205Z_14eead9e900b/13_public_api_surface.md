# Public API Surface

evidence_id: ev.public_api_surface.summary

Public/exported symbols observed by deterministic heuristics. Use this as blast-radius evidence before classifying a bounded change.

| path | line | language | kind | name | parent |
|---|---:|---|---|---|---|
| `app/src/App.jsx` | 17 | `typescript` | `component` | `App` | `` |
| `app/src/components/CheckoutSteps.jsx` | 3 | `typescript` | `component` | `CheckoutSteps` | `` |
| `app/src/components/FlyingCartItem.jsx` | 16 | `typescript` | `component` | `FlyingCartItem` | `` |
| `app/src/components/Footer.jsx` | 11 | `typescript` | `component` | `Footer` | `` |
| `app/src/components/Header.jsx` | 11 | `typescript` | `component` | `Header` | `` |
| `app/src/components/TransitionLink.jsx` | 4 | `typescript` | `component` | `TransitionLink` | `` |
| `app/src/data/engineer-profile.js` | 166 | `typescript` | `function` | `buildSystemPrompt` | `` |
| `app/src/lib/aiLimit.js` | 1 | `typescript` | `class` | `AiLimitExceededError` | `` |
| `app/src/lib/aiLimit.js` | 36 | `typescript` | `function` | `getAiUsageToday` | `` |
| `app/src/lib/cart.js` | 7 | `typescript` | `function` | `getCart` | `` |
| `app/src/lib/cart.js` | 11 | `typescript` | `function` | `saveCart` | `` |
| `app/src/lib/cart.js` | 15 | `typescript` | `function` | `addToCart` | `` |
| `app/src/lib/cart.js` | 38 | `typescript` | `function` | `updateCartQuantity` | `` |
| `app/src/lib/cart.js` | 46 | `typescript` | `function` | `removeFromCart` | `` |
| `app/src/lib/cart.js` | 52 | `typescript` | `function` | `clearCart` | `` |
| `app/src/lib/cart.js` | 56 | `typescript` | `function` | `getOrders` | `` |
| `app/src/lib/cart.js` | 60 | `typescript` | `function` | `saveOrder` | `` |
| `app/src/lib/cart.js` | 66 | `typescript` | `function` | `saveAiContext` | `` |
| `app/src/lib/cart.js` | 78 | `typescript` | `function` | `getAiContext` | `` |
| `app/src/lib/cart.js` | 82 | `typescript` | `function` | `getConsultations` | `` |
| `app/src/lib/cart.js` | 86 | `typescript` | `function` | `recordConsultation` | `` |
| `app/src/lib/cart.js` | 99 | `typescript` | `function` | `getCartEvents` | `` |
| `app/src/lib/cart.js` | 116 | `typescript` | `function` | `createOrderNumber` | `` |
| `app/src/lib/giftLabels.js` | 10 | `typescript` | `function` | `getGiftLabels` | `` |
| `app/src/lib/giftLabels.js` | 23 | `typescript` | `function` | `getGiftFitProfile` | `` |
| `app/src/lib/giftLabels.js` | 38 | `typescript` | `function` | `getComparisonRows` | `` |
| `app/src/lib/motion.js` | 3 | `typescript` | `component` | `EASE` | `` |
| `app/src/lib/supabase.js` | 11 | `typescript` | `function` | `recommendProducts` | `` |
| `app/src/lib/supabase.js` | 22 | `typescript` | `function` | `askConcierge` | `` |
| `app/src/lib/supabase.js` | 37 | `typescript` | `function` | `generateGiftMessage` | `` |
| `app/src/lib/viewTransition.js` | 1 | `typescript` | `function` | `startViewTransition` | `` |
| `app/src/pages/About.jsx` | 33 | `typescript` | `component` | `About` | `` |
| `app/src/pages/AdminDemo.jsx` | 93 | `typescript` | `component` | `AdminDemo` | `` |
| `app/src/pages/Cart.jsx` | 9 | `typescript` | `component` | `Cart` | `` |
| `app/src/pages/Checkout.jsx` | 14 | `typescript` | `component` | `Checkout` | `` |
| `app/src/pages/Complete.jsx` | 10 | `typescript` | `component` | `Complete` | `` |
| `app/src/pages/Concierge.jsx` | 65 | `typescript` | `component` | `Concierge` | `` |
| `app/src/pages/Orders.jsx` | 4 | `typescript` | `component` | `Orders` | `` |
| `app/src/pages/ProductDetail.jsx` | 9 | `typescript` | `component` | `ProductDetail` | `` |
| `app/src/pages/Products.jsx` | 30 | `typescript` | `component` | `Products` | `` |
| `app/src/pages/Top.jsx` | 79 | `typescript` | `component` | `Top` | `` |

## Guardrail

- Public-by-convention for Python means names not starting with `_`; confirm package exports before API promises.
