# Investigated Findings

generated_by: dcm investigate
source: non_llm_evidence_investigation
judgment_status: llm_enriched

## observed_signals

- Evidence Pack exists and has the required scan, symbol, config, risk, and scan-limitation files. evidence_ref: file=evidence/00_scan_manifest.md
- Symbol evidence exists for code navigation and candidate responsibility boundaries. evidence_ref: file=evidence/03_symbols.md
- Configuration and environment evidence exists for secret and runtime-risk review. evidence_ref: file=evidence/08_config_env.md
- Static signal evidence exists and must be investigated before draft. evidence_ref: file=evidence/30_static_signal_hits.md
- Scan limitation evidence exists and can inform descriptive current implications when judgment-relevant. evidence_ref: file=evidence/99_scan_limitations.md

## available_evidence_files

- `00_evidence_freshness.md`
- `00_scan_manifest.md`
- `01_file_tree.md`
- `02_files.json`
- `03_symbols.md`
- `04_symbols.json`
- `05_tests.md`
- `07_entrypoints.md`
- `08_config_env.md`
- `09_diff_evidence.md`
- `10_observed_change_signals.json`
- `10_observed_change_signals.md`
- `11_dependency_inventory.json`
- `11_dependency_inventory.md`
- `12_code_metrics.json`
- `12_code_metrics.md`
- `13_public_api_surface.json`
- `13_public_api_surface.md`
- `14_code_excerpts.json`
- `14_code_excerpts.md`
- `15_decision_memory.json`
- `15_decision_memory.md`
- `30_static_signal_hits.md`
- `98_redaction_report.md`
- `99_scan_limitations.md`

## llm_enrichment

## item_meaning_candidates

- `app/src/lib/supabase.js` functions (`recommendProducts`, `askConcierge`, `generateGiftMessage`): likely client-side wrappers for Supabase Edge Functions, using VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (evidence: 08_config_env).
- `supabase/functions/concierge/index.ts`: serverless function for conversational AI concierge, using DeepSeek model with query length and candidate limits (evidence: 03_symbols lists DEEPSEEK_MODEL, MAX_QUERY_LENGTH, MAX_CANDIDATES, FALLBACK_GIFT_MESSAGE, FALLBACK_RESPONSE, CORS, and functions like `generateGiftMessage`, `rankRecommendations`, `normalizeCandidates`).
- `supabase/functions/recommend-products/index.ts`: serverless function for product recommendations, also using DeepSeek model and including a `fallbackRanking` function (evidence: 03_symbols lists DEEPSEEK_MODEL, MAX_QUERY_LENGTH, MAX_CANDIDATES, CORS, `fallbackRanking`).
- `app/src/lib/aiLimit.js`: implements daily AI usage limit, with class `AiLimitExceededError`, function `consumeAiLimit` (test), `getAiDailyLimit` (test) (evidence: 03_symbols).
- CSS custom properties in `app/src/index.css` (--bg, --surface, --ink, etc.): design tokens for theming and layout tokens (--space-1 through --space-8, --tap-min) (evidence: 03_symbols).
- Change signals on `app/src/index.css`, `app/src/pages/Concierge.jsx`, `app/e2e/demo-flow.spec.js`, `env/config.yaml`, `supabase/functions/concierge/index.ts`: indicate recent modifications to UI styling, concierge page, e2e tests, environment config, and backend function (evidence: 30_static_signal_hits).
- `app/src/pages/AdminDemo.jsx` functions (`rankConsultationTopics`, `rankProducts`, `detectProductGaps`, `countMatchingProducts`): likely admin analytics and product gap detection (evidence: 03_symbols).
- `app/src/lib/cart.js` functions and constants (CART_KEY, ORDERS_KEY, AI_CONTEXT_KEY, CONSULTATIONS_KEY, CART_EVENTS_KEY): local storage keys and operations for cart, orders, AI context, consultations, cart events (evidence: 03_symbols).
- `app/src/lib/viewTransition.js` function `startViewTransition`: provides a view transition utility (evidence: 03_symbols).
- `app/src/lib/giftLabels.js` functions (`getGiftLabels`, `getGiftFitProfile`, `getComparisonRows`, `formatPriceBand`): gift-related label and comparison logic (evidence: 03_symbols).
- Static signals: `job_lifecycle` (39 hits), `env_secret` (56 hits, path redacted), `high_risk_ops` (20 hits), `auth_permission` (123 hits), `infra_surface` (12 hits) – indicate potential presence of lifecycle hooks, secrets, high-risk operations, auth permissions, and infrastructure surface in the codebase (evidence: 30_static_signal_hits).

## role_notes

- CSS selectors in `app/src/index.css` (`.hero-section`, `.product-card`, `.cart-line`, `.checkout-layout`, etc.) define roles for layout and component styling: hero, product display, cart, checkout flow, admin panels, AI concierge UI (`.chat-panel`, `.ai-reason`, `.follow-up-panel`), order management, and responsive breakpoints (evidence: 03_symbols).
- React components in `app/src/pages/` (Top, Products, ProductDetail, Cart, Checkout, Complete, Concierge, Orders, AdminDemo, About) serve as page-level route components (evidence: 03_symbols).
- `app/src/components/` (Header, Footer, CheckoutSteps, FlyingCartItem, TransitionLink) provide reusable UI sections (evidence: 03_symbols).
- `app/src/lib/supabase.js` functions act as API client for Supabase edge functions (evidence: 08_config_env, 03_symbols).
- `app/src/lib/aiLimit.js` enforces daily AI usage limits, with `AiLimitExceededError` as error class (evidence: 03_symbols).
- `supabase/functions/concierge/index.ts` functions (`rankRecommendations`, `scoreSensitiveFit` (test), `normalizeGiftMessage`, `normalizeCandidates`) implement backend logic for AI concierge: ranking, scoring sensitivity, normalization (evidence: 03_symbols).
- `supabase/functions/recommend-products/index.ts` `fallbackRanking` provides fallback product ranking logic (evidence: 03_symbols).
- `app/src/lib/cart.js` functions manage persistent browser storage for cart and order data (evidence: 03_symbols).
- `app/src/lib/giftLabels.js` provides gift label and fit profile analysis (evidence: 03_symbols).
- `app/src/lib/motion.js` exports `EASE` for animation easing (evidence: 03_symbols).
- `app/src/lib/viewTransition.js` provides a function `startViewTransition` for smooth page transitions (evidence: 03_symbols).
- Test-related: functions `consumeAiLimit`, `getAiDailyLimit` in `app/src/lib/aiLimit.js` and `scoreSensitiveFit` in `supabase/functions/concierge/index.ts` are marked `(test)` indicating they are either test helpers or specifically tested (evidence: 03_symbols).

## current_implications

- The application integrates Supabase for backend and uses AI (DeepSeek model) for product recommendations and concierge service (evidence: 08_config_env, 03_symbols).
- AI features are rate-limited daily, with a defined limit (`AI_DAILY_LIMIT` in `app/vite.config.js`) and error handling (`AiLimitExceededError`) (evidence: 03_symbols).
- The app has a comprehensive CSS design system with custom properties and responsive media queries; recent changes to `app/src/index.css` (7 changes) suggest active styling adjustments (evidence: 30_static_signal_hits, 03_symbols).
- The concierge page (`app/src/pages/Concierge.jsx`) and backend function (`supabase/functions/concierge/index.ts`) show change activity (5 and 4 changes respectively), indicating ongoing development in AI interaction flow (evidence: 30_static_signal_hits).
- Environment configuration (`env/config.yaml`) has 5 changes, suggesting deployment or feature toggle modifications (evidence: 30_static_signal_hits).
- E2E tests (`app/e2e/demo-flow.spec.js`) show 5 changes, implying test adjustments alongside feature changes (evidence: 30_static_signal_hits).
- The presence of `(test)` annotations on certain functions indicates unit test coverage for AI limit and scoring functions (evidence: 03_symbols).
- The codebase contains 577 symbols across 194 files, with test count of 3 and entrypoint count of 3, suggesting a moderately sized single-page application with limited formal tests (evidence: 00_scan_manifest).
- Scan limitations note that symbol extraction is heuristic, so some dynamic symbols may be missing; this affects completeness of analysis (evidence: 99_scan_limitations).

## uncertainty_notes

- Required/optional status of environment variables `VITE_SUPABASE_ANON_KEY` and `VITE_SUPABASE_URL` is unknown (evidence: 08_config_env).
- Default values for environment variables are not analyzed (evidence: 08_config_env).
- Static signal hits indicate potential security risks: `env_secret` (56 hits, path redacted), `high_risk_ops` (20 hits), `auth_permission` (123 hits) – but without reviewing the matching lines, the actual risk level is uncertain (evidence: 30_static_signal_hits).
- `job_lifecycle` hit (39 hits) may indicate lifecycle hooks or background jobs, but details are not available in provided evidence (evidence: 30_static_signal_hits).
- `infra_surface` hit (12 hits) may indicate deployment configuration, but content is unknown (evidence: 30_static_signal_hits).
- Change signals show number of changes but not the nature or purpose of those changes; follow-up with change history is recommended (evidence: 30_static_signal_hits).
- The `grep no-hit` for `todos` is not proof that no TODOs exist (evidence: 30_static_signal_hits guardrail).
- Symbol extraction is heuristic; dynamic/macro-generated symbols may be missing, especially in Rust macros or dynamic JSX props (evidence: 99_scan_limits).
- Test coverage is limited to 3 test files and specific functions marked `(test)`; overall test coverage is unclear (evidence: 00_scan_manifest, 03_symbols).
- Actual implementation logic for AI functions (e.g., `recommendProducts`, `askConcierge`) is not visible; only function signatures are captured (evidence: 03_symbols).

## judgment_value_added

- Raw inventory has been classified into draft inputs: observed signals, roles, and current implications.
- LLM enrichment, when present, adds meaning for each evidence item without changing observed evidence.
- This file does not approve an implementation choice or prescribe future work. It prevents raw scan output from being treated as a completed Decision Catalog.

## draft_inputs

- Draft must create `catalog_items` where each item pairs fact and meaning.
- Draft must not include advice, recommendations, next actions, validation plans, rollback plans, or change boundaries.
- Draft must cite evidence_ids for fact items and must not invent facts outside the Evidence Pack.

## required_llm_enrichment

- Assign role/current implication to evidence items.
- Keep risk language descriptive and current-state only.
- Put judgment-relevant uncertainty in descriptive current implications instead of a separate field.

## next_step

- Run `dcm draft <TARGET>` or `dcm llm draft <TARGET>` only after this investigated findings file exists.
