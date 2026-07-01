# 添え書き（ギフトメッセージ）AI 生成

## Goal

商品を選んだあとに「このギフトに添える一言」を AI で生成し、購入の後押しにする。営業デモで映える小機能。

## Context

- owner FB「ギフトメッセージ生成」P1（体験を華やかにする追加機能。MVP ではない）。
- 相談文脈は保持済み: `saveAiContext(recommendedProductIds, query)`（`app/src/lib/cart.js:65`）。相手・シーンを添え書きの素材に使える。
- 生成 AI 呼び出しは既存の Edge Function 経由パターンを踏襲（`app/src/lib/supabase.js`）。AI 利用上限（`aiLimit.js`）に含める。

### 出力イメージ（FB）

```text
最近忙しそうだったので、少しでもリラックスできたらと思って選びました。
```

## Scope

- 商品選択後（カート/詳細/完了のいずれか）に「添え書きを AI で作る」導線。
- 相談文脈（相手・シーン）を使って一言を生成、コピー可能に。

## Non-scope

- ラッピング/熨斗などの実サービス連携。
- 生成文の保存永続化（コピーできれば十分）。

## Skeleton

- 新規 Edge Function もしくは `concierge` の派生で短文生成 → コピー UI。

## Plan

1. 生成の入口と配置を決める（完了画面が有力）。
2. Edge Function（短文生成）とフォールバック定型文を用意。
3. コピー UI（薬機法配慮の定型に寄せる）。

## Acceptance Criteria

- 相談文脈を反映した一言が生成され、コピーできる。
- AI 障害/上限時は定型文にフォールバックする。

## Verification

- `cd app && npm run build && npm run lint && npx playwright test`
- 手動: 生成→コピーが動く。上限時フォールバックを確認。

## Done Evidence

- `supabase/functions/concierge/index.ts`: `mode: "gift-message"` を追加し、既存 `concierge` Edge Function 経由で添え書き短文を生成。AI 障害時は定型文にフォールバック。
- `app/src/lib/supabase.js`: `generateGiftMessage` を追加。AI 利用上限 `consumeAiLimit()` の対象に含め、`concierge` function へ `mode: "gift-message"` で送信。
- `app/src/pages/Complete.jsx`: 注文完了画面に「ギフトに添える一言」生成 UI とコピー UI を追加。Clipboard API が拒否される場合は `execCommand('copy')` で fallback。
- `app/src/index.css`: 添え書き生成パネル、結果表示、コピー状態のスタイルを追加。
- `app/e2e/demo-flow.spec.js`: 注文完了画面で添え書きを生成し、コピー完了メッセージが出ることを確認。
- `Makefile`: `concierge` deploy を `--use-api` 経路に変更。通常 deploy が Supabase Function store の 500 で落ちたため。
- `cd app && npm run build`: passed（Vite の既存 chunk size warning のみ）。
- `cd app && npm run lint`: passed。
- `npx playwright test`: 既存の別 repo dev server が `5173` を占有しているため、この repo を `5175` で起動し一時 config で実行。`21 passed`。
- `supabase functions deploy concierge --use-api`: passed。deployed `concierge` の `mode: "gift-message"` 実応答で `message` が返ることを確認。

## Notes

- 優先度は P1。P0 群（提案カード/入口/ワンタップ）の後。
