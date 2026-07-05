# grep: job_lifecycle

evidence_id: ev.grep.job_lifecycle
description: job lifecycle / retry / timeout / status

- .claude/hooks/detect-unverified-claim.sh:L10: changed="$(git status --porcelain docs/tasks/done/ 2>/dev/null | head -n1 || true)"
- .claude/settings.json:L14: "Bash(git status:*)",
- .claude/settings.json:L53: "statusMessage": "safety-boundary check"
- .claude/settings.json:L65: "statusMessage": "scope-creep check"
- .claude/settings.json:L80: "statusMessage": "decision-log session boundary"
- .claude/settings.json:L85: "statusMessage": "unverified-claim check"
- app/e2e/demo-flow.spec.js:L38: status: 200,
- app/e2e/demo-flow.spec.js:L85: status: 200,
- app/e2e/demo-flow.spec.js:L151: status: 200,
- app/e2e/demo-flow.spec.js:L215: status: 200,
- app/playwright.config.js:L5: timeout: 30000,
- app/playwright.config.js:L21: timeout: 15000,
- app/src/index.css:L1017: .turn-status,
- app/src/index.css:L1019: .ai-status {
- app/src/index.css:L1028: .turn-status {
- app/src/index.css:L1043: .ai-status {
- app/src/index.css:L1450: .gift-message-status {
- app/src/pages/Complete.jsx:L14: const [messageStatus, setMessageStatus] = useState('')
- app/src/pages/Complete.jsx:L19: setMessageStatus('')
- app/src/pages/Complete.jsx:L28: setMessageStatus(error?.name === 'AiLimitExceededError' ? error.message : 'AIが混み合っています。定型文を表示しました。')
- app/src/pages/Complete.jsx:L38: setMessageStatus('添え書きをコピーしました。')
- app/src/pages/Complete.jsx:L49: setMessageStatus(copied ? '添え書きをコピーしました。' : 'コピーできませんでした。テキストを選択してコピーしてください。')
- app/src/pages/Complete.jsx:L95: {messageStatus && <p className="gift-message-status">{messageStatus}</p>}
- app/src/pages/Concierge.jsx:L280: <motion.p className="turn-status" variants={fadeUp} initial="hidden" animate="show">
- app/src/pages/ProductDetail.jsx:L27: setTimeout(() => startViewTransition(() => navigate('/cart')), 320)
- app/src/pages/Products.jsx:L102: setTimeout(() => setAddedId(null), 1400)
- app/src/pages/Products.jsx:L164: {aiMessage && <p className="ai-status">{aiMessage}</p>}
- app/test-results/.last-run.json:L2: "status": "passed",
- supabase/config.toml:L39: health_timeout = "2m"
- supabase/config.toml:L135: # Store analytical data in S3 for running ETL jobs over Iceberg Catalog
- supabase/config.toml:L271: # Configure logged in session timeouts.
- supabase/config.toml:L276: # inactivity_timeout = "8h"
- supabase/config.toml:L376: # Supported request policies: `oneshot`, `per_worker`.
- supabase/config.toml:L377: # `per_worker` (default) — enables hot reload during local development.
- supabase/config.toml:L379: policy = "per_worker"
- supabase/functions/concierge/index.ts:L338: function json(body: unknown, status = 200) {
- supabase/functions/concierge/index.ts:L340: status,
- supabase/functions/recommend-products/index.ts:L74: function json(body: unknown, status = 200) {
- supabase/functions/recommend-products/index.ts:L76: status,
