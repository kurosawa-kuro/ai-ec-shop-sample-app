# コンシェルジュの理由と商品のズレを直す

## Goal

提案カードに表示する「渡しやすい理由」が、常にその商品に対応した理由になるようにする（別商品の理由が付く不整合をなくす）。

## Context

- 種別: 不具合（correctness）。コンセプト「解決」の信頼性を直接損なう。
- 現状 `normalizeConciergeResponse`（`app/src/pages/Concierge.jsx:299-313`）は `recommendedProductIds` を「有効 ID を前詰め → フォールバック ID で補完 → dedup → 先頭3」に**作り直す**が、`reasons` は AI 応答の**元配列のまま**（`reasons: Array.isArray(data?.reasons) ? data.reasons : ...`）。
- 表示側は `reasons?.[index]` を商品と同 index で対応づける（`Concierge.jsx:224-247, 55-62`）。
- そのため ID が 1 つでも無効で除外/補完されると、index がずれ、**商品 A に AI が商品 X 向けに書いた理由が付く**。

### 再現シナリオ

AI 応答 `recommendedProductIds:[X(無効), A, B]`, `reasons:[rX, rA, rB]` の場合、正規化後 `[A, B, gift-001(補完)]` に対し `reasons` は `[rX, rA, rB]` のまま → A に rX、B に rA、gift-001 に rB が付く（全てズレ）。

## Scope

- `normalizeConciergeResponse` を、ID と理由を**ペアで**保持・整列する形へ変更（`Concierge.jsx`）。
- 補完したフォールバック ID には対応するフォールバック理由を割り当てる。

## Non-scope

- 提案精度そのもの（別タスク [concierge-ground-recommendations-in-catalog.md](concierge-ground-recommendations-in-catalog.md)）。

## Skeleton

- `{ id, reason }` の配列を作ってから filter/pad/slice する（index 依存をやめる）。

## Plan

1. AI 応答を `id↔reason` のペア配列へ写像。
2. 無効 ID をペアごと除外。
3. 3件に満たなければフォールバック（id＋reason）で補完。
4. 表示側を `recommendations` のペアからそのまま描画。

## Acceptance Criteria

- 無効 ID を含む応答でも、各カードの理由が必ずその商品に対応する。
- 上記再現シナリオで A/B/補完すべてに正しい理由が付く（ユニットまたは手動で確認）。

## Verification

- `cd app && npm run build && npm run lint && npx playwright test`
- 無効 ID を含むモック応答で index ズレが起きないことを確認。

## Notes

- 既存 E2E（`e2e/demo-flow.spec.js` の推薦3件）を壊さないこと。
