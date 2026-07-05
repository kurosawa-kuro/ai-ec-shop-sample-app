# Code Metrics

evidence_id: ev.code_metrics.summary

Deterministic size and symbol-count signals. These are risk-prioritization signals, not defect claims.

| path | language | loc | non_empty_loc | symbols | public_symbols | tests | max_line_length |
|---|---|---:|---:|---:|---:|---:|---:|
| `app/e2e/demo-flow.spec.js` | `typescript` | 266 | 237 | 0 | 0 | 0 | 172 |
| `app/e2e/products-ui.spec.js` | `typescript` | 31 | 26 | 0 | 0 | 0 | 122 |
| `app/e2e/routes.spec.js` | `typescript` | 21 | 19 | 0 | 0 | 0 | 91 |
| `app/index.html` | `html` | 19 | 19 | 1 | 0 | 0 | 125 |
| `app/playwright.config.js` | `typescript` | 23 | 22 | 0 | 0 | 0 | 77 |
| `app/src/App.css` | `css` | 184 | 158 | 19 | 0 | 0 | 80 |
| `app/src/App.jsx` | `typescript` | 39 | 38 | 1 | 1 | 0 | 68 |
| `app/src/components/CheckoutSteps.jsx` | `typescript` | 19 | 18 | 2 | 1 | 0 | 89 |
| `app/src/components/FlyingCartItem.jsx` | `typescript` | 104 | 94 | 4 | 1 | 0 | 114 |
| `app/src/components/Footer.jsx` | `typescript` | 64 | 59 | 2 | 1 | 0 | 117 |
| `app/src/components/Header.jsx` | `typescript` | 74 | 68 | 2 | 1 | 0 | 95 |
| `app/src/components/TransitionLink.jsx` | `typescript` | 30 | 26 | 1 | 1 | 0 | 85 |
| `app/src/data/admin-demo-sample.js` | `typescript` | 53 | 48 | 0 | 0 | 0 | 149 |
| `app/src/data/engineer-profile.js` | `typescript` | 212 | 194 | 1 | 1 | 0 | 185 |
| `app/src/data/products.js` | `typescript` | 411 | 405 | 0 | 0 | 0 | 134 |
| `app/src/index.css` | `css` | 2716 | 2327 | 451 | 0 | 0 | 129 |
| `app/src/lib/aiLimit.js` | `typescript` | 43 | 35 | 5 | 4 | 2 | 119 |
| `app/src/lib/cart.js` | `typescript` | 131 | 115 | 21 | 14 | 0 | 99 |
| `app/src/lib/giftLabels.js` | `typescript` | 55 | 48 | 4 | 3 | 0 | 133 |
| `app/src/lib/motion.js` | `typescript` | 33 | 26 | 1 | 1 | 0 | 73 |
| `app/src/lib/supabase.js` | `typescript` | 45 | 40 | 3 | 3 | 0 | 84 |
| `app/src/lib/viewTransition.js` | `typescript` | 7 | 7 | 1 | 1 | 0 | 72 |
| `app/src/main.jsx` | `typescript` | 11 | 10 | 0 | 0 | 0 | 51 |
| `app/src/pages/About.jsx` | `typescript` | 92 | 87 | 1 | 1 | 0 | 265 |
| `app/src/pages/AdminDemo.jsx` | `typescript` | 386 | 364 | 9 | 1 | 0 | 199 |
| `app/src/pages/Cart.jsx` | `typescript` | 100 | 92 | 2 | 1 | 0 | 130 |
| `app/src/pages/Checkout.jsx` | `typescript` | 126 | 115 | 3 | 1 | 0 | 116 |
| `app/src/pages/Complete.jsx` | `typescript` | 121 | 114 | 2 | 1 | 0 | 172 |
| `app/src/pages/Concierge.jsx` | `typescript` | 549 | 520 | 10 | 1 | 0 | 161 |
| `app/src/pages/Orders.jsx` | `typescript` | 44 | 41 | 1 | 1 | 0 | 102 |
| `app/src/pages/ProductDetail.jsx` | `typescript` | 101 | 97 | 2 | 1 | 0 | 160 |
| `app/src/pages/Products.jsx` | `typescript` | 229 | 215 | 1 | 1 | 0 | 147 |
| `app/src/pages/Top.jsx` | `typescript` | 325 | 304 | 2 | 1 | 0 | 176 |
| `app/vite.config.js` | `typescript` | 18 | 16 | 1 | 0 | 0 | 81 |
| `doppler.yaml` | `github-actions` | 27 | 25 | 0 | 0 | 0 | 119 |
| `env/config.yaml` | `github-actions` | 25 | 21 | 0 | 0 | 0 | 140 |
| `env/project.yaml` | `github-actions` | 9 | 8 | 0 | 0 | 0 | 64 |
| `env/secret.yaml` | `github-actions` | 12 | 10 | 0 | 0 | 0 | 97 |
| `supabase/functions/concierge/index.ts` | `typescript` | 343 | 306 | 17 | 0 | 1 | 634 |
| `supabase/functions/recommend-products/index.ts` | `typescript` | 79 | 66 | 7 | 0 | 0 | 144 |

## Guardrail

- Large files and many public symbols increase review attention; they do not prove unsafe code.
