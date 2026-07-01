# コンシェルジュ提案の正確さ（接地・理由整合・ID整合）

## Goal

コンシェルジュの AI 提案を「困りごとに対して適切・正確」にする。3つの近接課題を1タスクにまとめて同時に潰す:

1. **カタログ接地**: 属性（tags/giftFor/category）を AI に渡し「肌が弱い→敏感肌向け」を推測頼みにしない。
2. **理由と商品の整合**: 無効 ID 除外/補完後に理由がズレる不具合を直す。
3. **prompt の ID 整合**: system prompt の ID 例を実データに合わせ、無効 ID の発生を減らす。

## Context

- コンセプト核心（`docs/01_requirements.md`「AI で困りごとを解決する」）の "適切さ・正確さ" を担う。
- 3課題は同じコード（`Concierge.jsx` の正規化 + `concierge` Edge Function）を触るため統合。

### 1. カタログ接地

- 現状クライアントは商品 **ID 配列だけ**を渡す: `app/src/pages/Concierge.jsx:73-76`。
- Edge Function も `query` と `productIds` のみ受領、属性なし: `supabase/functions/concierge/index.ts:30, 52-55`。
- → AI は `skincare-001` が敏感肌向けか知らずに提案。適切性が不安定。

### 2. 理由と商品の整合（不具合）

- `normalizeConciergeResponse`（`Concierge.jsx:299-313`）が `recommendedProductIds` を作り直す一方、`reasons` は AI の元配列のまま。表示は `reasons?.[index]` で対応づけ（`Concierge.jsx:224-247, 55-62`）。
- 無効 ID を1つでも除外/補完すると index がズレ、**別商品の理由が付く**。
- 再現: 応答 `ids:[X(無効),A,B] reasons:[rX,rA,rB]` → 正規化後 `[A,B,gift-001]` に `reasons` が `[rX,rA,rB]` のまま対応 → 全ズレ。

### 3. prompt の ID 整合（小）

- `supabase/functions/concierge/index.ts:45-47` に `mens-gift-001〜006` とあるが実 ID は `mensgift-001`（`app/src/data/products.js`、ハイフンなし）。無効 ID を誘発。

## Scope

- `askConcierge` に属性つき candidates（id/name/category/price/tags/giftFor）を渡す（`app/src/lib/supabase.js` / `Concierge.jsx`）。
- Edge Function を候補属性から選ぶ形に更新し、prompt の ID 例も実 prefix に修正（`concierge/index.ts`）。
- `normalizeConciergeResponse` を `{ id, reason }` ペアで扱う形へ（index 依存を廃止、補完 ID にはフォールバック理由を割当）。

## Non-scope

- カード UI の3段理由化（[concierge-card-reasoning-breakdown.md](../active/concierge-card-reasoning-breakdown.md) / active）。
- 多ターン絞り込み（[concierge-multi-turn-refinement.md](concierge-multi-turn-refinement.md)）。

## Skeleton

- 応答を `recommendations:[{ productId, reason }]` に寄せ、接地・整合・ID整合を同じ改修で満たす。

## Plan

1. クライアント送信を属性つき candidates に変更。
2. Edge Function の prompt/整形を属性ベース＋実 ID prefix に更新。
3. 正規化をペア構造に。フォールバック理由も用意。
4. `make fn-deploy`。

## Acceptance Criteria

- 「肌が弱い女友達に贈るギフト」で敏感肌系（`敏感肌向け`/`低刺激感`）が優先提案される（実応答時）。
- 無効 ID を含む応答でも各カードの理由が必ずその商品に対応。
- prompt の ID 例が実 prefix と一致し、無効 ID 発生が減る。

## Verification

- `cd app && npm run build && npm run lint && npx playwright test`（推薦3件の既存 E2E を壊さない）。
- `make fn-deploy` 後、敏感肌系が上位＋理由ズレなしを手動確認。

## Notes

- [concierge-card-reasoning-breakdown.md](../active/concierge-card-reasoning-breakdown.md)（P0・次アクション）と同時実装が効率的（応答スキーマを一緒に整える）。
- 旧タスク concierge-ground-recommendations-in-catalog / concierge-reason-product-alignment / concierge-prompt-id-mismatch を本タスクへ統合（2026-07-01）。
