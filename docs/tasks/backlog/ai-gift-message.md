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

## Notes

- 優先度は P1。P0 群（提案カード/入口/ワンタップ）の後。
