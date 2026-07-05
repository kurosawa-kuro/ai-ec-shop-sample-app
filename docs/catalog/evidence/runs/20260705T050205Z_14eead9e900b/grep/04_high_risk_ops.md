# grep: high_risk_ops

evidence_id: ev.grep.high_risk_ops
description: delete / drop / truncate / migration

- app/src/components/FlyingCartItem.jsx:L27: return () => window.removeEventListener('cart-fly', onFly)
- app/src/components/Header.jsx:L23: return () => window.removeEventListener('cart-updated', onUpdate)
- app/src/components/Header.jsx:L33: return () => window.removeEventListener('cart-arrived', onArrived)
- app/src/index.css:L134: backdrop-filter: blur(14px);
- app/src/index.css:L135: -webkit-backdrop-filter: blur(14px);
- app/src/index.css:L2203: backdrop-filter: none;
- app/src/index.css:L2204: -webkit-backdrop-filter: none;
- app/src/lib/aiLimit.js:L20: .forEach((key) = <redacted>
- app/src/lib/cart.js:L46: export function removeFromCart(productId) {
- app/src/pages/Cart.jsx:L7: import { getCart, removeFromCart, updateCartQuantity } from '../lib/cart'
- app/src/pages/Cart.jsx:L27: const handleRemove = (productId) => {
- app/src/pages/Cart.jsx:L28: setCart(removeFromCart(productId))
- app/src/pages/Cart.jsx:L74: <button type="button" className="icon-button" onClick={() => handleRemove(product.id)}>
- app/src/pages/Complete.jsx:L48: document.body.removeChild(textarea)
- app/src/pages/Concierge.jsx:L303: else imageRefs.current.delete(product.id)
- app/src/pages/Products.jsx:L180: else imageRefs.current.delete(product.id)
- supabase/config.toml:L23: # deprecated and the field is removed on 2026-10-30 once the always-revoked behaviour is permanent.
- supabase/config.toml:L59: [db.migrations]
- supabase/config.toml:L60: # If disabled, migrations will be skipped during a db push or reset.
- supabase/config.toml:L67: # If enabled, seeds the database after migrations during a db reset.
