# 3商品比較ビュー（ギフト選定軸）

## Goal

AI が提案した3品を、スペックではなく **ギフト選定軸**（失敗しにくさ・高見え・相手を選びにくさ 等）で横並び比較できるようにし、「どれが一番無難か / 高見えするか / 相手を選ばないか」で納得して選べるようにする。

## Context

- owner FB「3商品比較ビュー」P1。コンセプト「困りごと→納得」の"納得"を強化する。
- 提案3品は既に取得済み: `app/src/pages/Concierge.jsx` の `recommendations`。
- 比較軸候補（FB）: 価格 / ギフト感 / 失敗しにくさ / 香りの強さ / 相手を選びにくいか / 特別感 / 普段使いしやすさ。

## Scope

- 提案後に「比較する」導線を追加し、3品を軸ごとに横並び表示。
- 各軸はスペック値でなくラベル/相対（例: 高い・普通・控えめ）。
- 軸データは [gift-fit-labels.md](../done/gift-fit-labels.md) のラベル/スコア、または AI レスポンスから取得。

## Non-scope

- 4品以上・任意商品の比較（提案3品に限定）。
- 通常 EC のスペック比較表。

## Skeleton

- `recommendations` を入力に、軸×3商品のテーブル/カードを描画するコンポーネント。

## Plan

1. 比較軸の確定（[gift-fit-labels.md](gift-fit-labels.md) と揃える）。
2. 軸データの供給元決定（ラベル or AI レスポンス）。
3. 比較 UI（モバイルは縦積み/横スクロール）。

## Acceptance Criteria

- 提案3品が選定軸で比較できる。
- 「一番無難 / 一番高見え / 相手を選ばない」が一目で分かる。
- モバイルで詰まらない（`AGENTS.md` UI 注意準拠）。

## Verification

- `cd app && npm run build && npm run lint && npx playwright test`
- 手動: デスクトップ/モバイルで比較が読めることを確認。

## Done Evidence

- `app/src/pages/Concierge.jsx`: 提案3品の下に「3品を比較する」導線を追加。
- `app/src/pages/Concierge.jsx`: 価格帯 / 失敗しにくさ / 高見え / 香りの強さ / 相手を選びにくい / 普段使いの比較表を追加。
- `app/src/lib/giftLabels.js`: 比較軸の値を `getComparisonRows` で共通生成。
- `app/src/index.css`: 横スクロール可能な比較テーブルを追加し、モバイルでも列が潰れないように調整。
- `app/e2e/demo-flow.spec.js`: 比較ボタンを押すと比較表と主要軸が表示されることを確認。
- `cd app && npm run build`: passed（Vite の既存 chunk size warning のみ）。
- `cd app && npm run lint`: passed。
- `npx playwright test`: 既存の別 repo dev server が `5173` を占有しているため、この repo を `5175` で起動し一時 config で実行。`20 passed`。

## Notes

- [gift-fit-labels.md](../done/gift-fit-labels.md) 先行で実装し、軸データの供給元にした。
