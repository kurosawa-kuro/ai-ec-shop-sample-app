# Observed Change Signals

evidence_id: ev.change_signal.summary

This is git history evidence for files that changed often. It is not a defect claim.

| path | commit_count | churn | distinct_authors | last_changed |
|---|---:|---:|---:|---|
| `app/src/index.css` | 7 | 2730 | 1 | `2026-07-02T00:18:30+09:00` |
| `app/src/pages/Concierge.jsx` | 5 | 621 | 1 | `2026-07-02T00:02:31+09:00` |
| `app/e2e/demo-flow.spec.js` | 5 | 274 | 1 | `2026-07-01T23:31:22+09:00` |
| `env/config.yaml` | 5 | 35 | 1 | `2026-07-02T00:02:31+09:00` |
| `supabase/functions/concierge/index.ts` | 4 | 369 | 1 | `2026-07-01T23:09:38+09:00` |
| `app/src/pages/Top.jsx` | 4 | 357 | 1 | `2026-07-02T00:18:30+09:00` |
| `docs/tasks/backlog/00-roadmap.md` | 3 | 96 | 1 | `2026-07-01T23:09:38+09:00` |
| `app/src/lib/supabase.js` | 3 | 49 | 1 | `2026-07-01T23:09:38+09:00` |
| `app/src/pages/AdminDemo.jsx` | 2 | 386 | 1 | `2026-07-01T23:09:38+09:00` |
| `README.md` | 2 | 194 | 1 | `2026-07-02T00:18:30+09:00` |
| `docs/tasks/backlog/concept-gap-analysis.md` | 2 | 190 | 1 | `2026-07-01T22:14:16+09:00` |
| `app/src/lib/cart.js` | 2 | 135 | 1 | `2026-07-01T22:50:09+09:00` |
| `app/src/pages/Complete.jsx` | 2 | 123 | 1 | `2026-07-01T23:09:38+09:00` |
| `app/src/pages/ProductDetail.jsx` | 2 | 103 | 1 | `2026-07-01T22:50:09+09:00` |
| `docs/tasks/backlog/concierge-reason-product-alignment.md` | 2 | 100 | 1 | `2026-07-01T22:14:16+09:00` |
| `docs/tasks/backlog/concierge-ground-recommendations-in-catalog.md` | 2 | 94 | 1 | `2026-07-01T22:14:16+09:00` |
| `docs/tasks/backlog/concierge-prompt-id-mismatch.md` | 2 | 86 | 1 | `2026-07-01T22:14:16+09:00` |
| `app/src/components/Footer.jsx` | 2 | 66 | 1 | `2026-07-02T00:02:31+09:00` |
| `Makefile` | 2 | 64 | 1 | `2026-07-01T23:09:38+09:00` |
| `docs/tasks/backlog/gift-fit-labels.md` | 2 | 48 | 1 | `2026-07-01T22:14:20+09:00` |

## Notes

- churn = added + deleted lines from `git log --numstat`.
- binary file churn is counted as 0 when git reports `-`.
