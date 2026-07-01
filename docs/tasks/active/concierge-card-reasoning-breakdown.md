# AI提案カードを「理由の3段構成」に強化する（P0・最優先）

## Goal

コンシェルジュの提案カードを、単一の理由文から **「おすすめ理由 / 渡しやすいポイント / 注意したい点（＋合いそうな相手条件）」** の分解表示に強化し、「AI が勝手に選んだ」ではなく「購入者が納得して選ぶ」体験にする。

## Context

- owner FB で **次に実装する最優先タスク**として指名（「AI提案カードを『おすすめ理由 / 渡しやすい理由 / 注意点』の3段表示にする」）。コンセプト「購買不安を購入理由に変換する」の中核。
- 現状カードは理由1文のみ: `app/src/pages/Concierge.jsx:244-247`（`<p>{reason ?? product.aiReason}</p>`）。
- 現行 concierge レスポンスは `reasons`（1商品1文）まで: `supabase/functions/concierge/index.ts:42-43` の JSON 形。注意点/渡しやすさは無い。

### 表示イメージ（FB より）

```text
AIが選んだ理由：直接肌に使うアイテムの中でも日常使いしやすくギフト感があります。
渡しやすいポイント：香りや色味の好みが強く出にくく、友人向けにも重くなりにくいです。
注意したい点：香りに敏感な方には、無香料・控えめタイプを確認すると安心です。
```

## Scope

- concierge レスポンススキーマを拡張: 各商品に `{ reason, easyToGive, caution, fitFor }`（命名は実装時確定）。
- Edge Function の system prompt を 3〜4 観点で返す形に更新（`supabase/functions/concierge/index.ts`）。
- カード UI を分解表示に（`Concierge.jsx` 推薦カード）。トップ右の 3 picks（`Top.jsx`）は据え置きでよい。
- レスポンス正規化・フォールバックを新スキーマに合わせる（`normalizeConciergeResponse`）。フォールバック文にも各観点を用意。

## Non-scope

- 多ターン化（[concierge-multi-turn-refinement.md](../backlog/concierge-multi-turn-refinement.md)）。
- 商品マスタへのスコア付与（[gift-fit-labels.md](../backlog/gift-fit-labels.md) で扱う）。

## Skeleton

- レスポンス: `recommendations: [{ productId, reason, easyToGive, caution, fitFor }]` へ寄せ、理由と商品を**ペア**で扱う（[concierge-recommendation-accuracy.md](../backlog/concierge-recommendation-accuracy.md) の理由ズレ対策と同時に解消する）。

## Plan

1. Edge Function の JSON 形と prompt を 3〜4 観点に更新。
2. `normalizeConciergeResponse` をペア構造 + 新フィールド対応に。
3. カード UI を「理由/渡しやすい点/注意点」の段組に。
4. フォールバック応答にも各観点を用意。
5. `make fn-deploy`。

## Acceptance Criteria

- 実応答時、各カードに理由・渡しやすい点・注意点が商品ごとに正しく（ズレなく）出る。
- 注意点は薬機法配慮（断定しない）。「無香料・控えめを確認すると安心」等の言い回し。
- フォールバック時も段組が崩れず表示される。

## Verification

- `cd app && npm run build && npm run lint && npx playwright test`（推薦3件の既存 E2E を壊さない）。
- `make fn-deploy` 後、手動で3観点が出ることを確認。

## Notes

- [concierge-recommendation-accuracy.md](../backlog/concierge-recommendation-accuracy.md)（接地・理由ズレ・ID整合）と同時実装が効率的（応答スキーマを一緒に整える）。
