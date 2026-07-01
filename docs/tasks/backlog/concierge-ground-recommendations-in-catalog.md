# コンシェルジュ提案をカタログ属性に接地する

## Goal

コンシェルジュの AI 提案を、実カタログの属性（`tags` / `giftFor` / `category` / `price`）に接地させ、「肌が弱い→敏感肌向け」のような困りごと→適切商品の対応づけを AI の当てずっぽうにしない。

## Context

- コンセプト核心（`docs/01_requirements.md`「AI で困りごとを解決する」）に直結。"適切さ" の根拠がここ。
- 現状、クライアントは商品 **ID の配列だけ** を渡している: `app/src/pages/Concierge.jsx:73-76`（`askConcierge(query, products.map(p => p.id))`）。
- Edge Function 側も `query` と `productIds` しか受け取らず、属性を持たない: `supabase/functions/concierge/index.ts:30, 52-55`。system prompt には ID レンジのみ列挙（`index.ts:45-47`）。
- つまり AI は `skincare-001` が「敏感肌向け」かを知らないまま提案しており、`肌が弱い` に対する適切性が担保されない。

## Scope

- `askConcierge` に候補を「ID＋属性（name/category/price/tags/giftFor）」で渡すよう変更（`app/src/lib/supabase.js` / `Concierge.jsx`）。
- Edge Function の user/system prompt を、渡された候補属性から選ぶ形に更新（`supabase/functions/concierge/index.ts`）。
- トークン肥大を避けるため候補件数に上限（例: 全36品 or 事前フィルタ）を設定。

## Non-scope

- 多ターン絞り込み（別タスク [concierge-multi-turn-refinement.md](concierge-multi-turn-refinement.md)）。
- 商品スキーマ自体の変更。

## Skeleton

- `recommendProducts` 同様に candidates（属性つき）を body に載せる I/O へ寄せる（`docs/02_architecture.md` の recommend-products I/O が参考）。

## Plan

1. `Concierge.jsx` の送信を属性つき candidates に変更。
2. Edge Function で candidate 属性を prompt に整形（`recommend-products/index.ts` の `candidateText` が参考）。
3. 返却 ID が候補内であることを検証（既存 `normalizeConciergeResponse` を活用）。

## Acceptance Criteria

- 「肌が弱い女友達に贈るギフト」で、`敏感肌向け`/`低刺激感` タグを持つ商品が優先提案される（フォールバックでない実応答時）。
- 返却 ID は必ず実在（`normalizeConciergeResponse` で担保）。

## Verification

- `cd app && npm run build && npm run lint && npx playwright test`
- 手動: 相談文で敏感肌系が上位に来ることを確認（AI 実応答時）。フォールバック経路も維持。

## Notes

- Edge Function 変更のため `make fn-deploy` が必要。DeepSeek 未設定でもフォールバックで動くことを壊さない。
