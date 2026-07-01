# 「失敗しにくさ」などギフト適合ラベル

## Goal

美容ギフトで刺さる **「失敗しにくさ / 高見え / 香り控えめ / 相手を選びにくい / 美容初心者にも渡しやすい」** を、数値でなくラベルとして提案カード・比較・詳細で使えるようにする。

## Context

- owner FB「失敗しにくさスコア」P1。おすすめ度より「失敗しにくさ」が刺さるという指摘。
- 既存 `products.js` は `tags` / `giftFor` を持つ（`app/src/data/products.js`）。ラベルはここから導出、または AI レスポンスに含める。
- FB のスコア例（内部表現）: `{ giftSafety, specialFeeling, easyToGive, cautionLevel }`。**UI は数値でなくラベル**（「失敗しにくい」「高見え」等）。

## Scope

- ラベルの定義（語彙）と供給元を決める: (a) `tags` からのマッピング、(b) AI レスポンス付与、のどちらか/併用。
- 提案カード（[concierge-card-reasoning-breakdown.md](../active/concierge-card-reasoning-breakdown.md)）と比較ビュー（[three-product-comparison-view.md](three-product-comparison-view.md)）で共用。

## Non-scope

- 数値スコアの UI 露出（ラベルのみ）。
- 商品スキーマの大改修（まずは tags 由来で最小実装）。

## Skeleton

- `getGiftLabels(product | aiResponse) -> string[]` の共通ユーティリティ。

## Plan

1. ラベル語彙を確定（薬機法配慮の言い回し）。
2. `tags` → ラベルのマッピング（例: `敏感肌向け`/`低刺激感` → 「香り・刺激が控えめ」寄り）。必要なら AI レスポンスで補完。
3. カード/比較/詳細で共用。

## Acceptance Criteria

- 主要商品に妥当なラベルが付く。
- ラベル語彙が薬機法配慮（断定しない）。
- カードと比較で同じラベル体系を使う。

## Verification

- `cd app && npm run build && npm run lint && npx playwright test`
- 手動: 敏感肌系に「香り控えめ」等、妥当なラベルが出る。

## Notes

- 「敏感肌でも安心」等の断定は不可。「香り控えめ」「好みが分かれにくい」等に寄せる。
