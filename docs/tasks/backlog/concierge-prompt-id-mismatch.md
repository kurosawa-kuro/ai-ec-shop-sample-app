# concierge system prompt の商品 ID 例を実データに合わせる

## Goal

Edge Function `concierge` の system prompt に書かれた商品 ID 例を実カタログと一致させ、AI が無効 ID を返す確率を下げる。

## Context

- 種別: 修正（小）。提案精度・フォールバック頻度に地味に効く。
- `supabase/functions/concierge/index.ts:45-47` の prompt に `mens-gift-001〜006` とあるが、実際の ID は `mensgift-001`（`app/src/data/products.js`、ハイフンなし）。
- カテゴリ prefix の網羅も曖昧で、AI が実在しない ID を生成しやすい。無効 ID はクライアントで除外されるが（`Concierge.jsx:299-313`）、その分フォールバック補完が増え提案の質が落ちる。

## Scope

- system prompt の ID 例を実 prefix（`skincare-` / `haircare-` / `bodycare-` / `relax-` / `gift-` / `mensgift-`、各 001〜006）に修正。
- できれば candidates 属性提示（[concierge-ground-recommendations-in-catalog.md](concierge-ground-recommendations-in-catalog.md)）と統合し、ID をハードコードで例示しない形にする。

## Non-scope

- 大きなプロンプト設計変更（接地タスク側で扱う）。

## Skeleton

- 文字列修正のみ。可能なら本タスクを #1（接地）に吸収。

## Plan

1. `index.ts` の ID 例を実データ prefix に修正。
2. `make fn-deploy` で `concierge` を再デプロイ。

## Acceptance Criteria

- prompt 内 ID 例が実カタログの prefix と一致。
- AI 実応答時の無効 ID 発生が減る（手動サンプルで確認）。

## Verification

- `make fn-deploy`（`concierge`）
- 手動: 数件の相談で返却 ID が実在 ID になっていることを確認。

## Notes

- #1 を先にやるなら、本タスクはそこに畳んでよい（重複実装を避ける）。
