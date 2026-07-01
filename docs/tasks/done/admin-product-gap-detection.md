# /admin-demo に「商品穴」検出（相談は多いが商品が弱い領域）

## Goal

`/admin-demo` に **「相談は多いが該当商品が弱い領域（商品穴）」** を表示し、「AI は売るだけでなく商品企画・陳列改善にも使える」という営業メッセージを成立させる。

## Context

- owner FB「/admin-demo に『商品穴』検出」— 店舗向けで最も刺さる、との指摘。
- 材料は揃っている: 相談トピック集計 `rankConsultationTopics`（`app/src/pages/AdminDemo.jsx:238-251`）、カタログ `products.js`（`tags`/`category`）。
- 「相談トピックの多さ」と「そのトピックに合致する商品の少なさ」を突き合わせれば穴が出る。

### 出力イメージ（FB）

```text
相談傾向：「香りが控えめなギフト」を求める相談が多いです。
改善提案：無香料・微香タイプをギフトカテゴリに追加すると、AI提案の幅が広がります。
```

## Scope

- 相談トピック（`consultationTopics`）ごとに「相談数」と「該当商品数（tags/カテゴリ一致）」を算出し、相談多×商品少の領域を「商品穴」として提示。
- 既存の「AI 改善提案」枠（`AdminDemo.jsx` improvement-panel）に統合するか、専用パネルを追加。
- サンプルデータ経路（`app/src/data/admin-demo-sample.js`）でも成立させる。

## Non-scope

- 実在庫・実発注連携。
- 商品マスタの追加 CRUD。

## Skeleton

- `topicDemand`（相談数）× `topicSupply`（該当商品数）→ gap スコア → 上位を提示。

## Plan

1. トピック↔商品の合致判定（`consultationTopics.keywords` と `tags`/`category` を対応づけ）。
2. 相談多・商品少のギャップ算出。
3. 「相談傾向 → 改善提案」文で提示（薬機法配慮）。
4. サンプルデータでも妥当に見えるよう調整。

## Acceptance Criteria

- 相談が多く商品が薄い領域が「商品穴」として1〜3件出る。
- 改善提案文が具体的（どのカテゴリに何を増やすか）。
- サンプル表示でも破綻しない。

## Verification

- `cd app && npm run build && npm run lint && npx playwright test`
- 手動: サンプル/実データ両方で商品穴が妥当に出る。

## Done Evidence

- `app/src/pages/AdminDemo.jsx`: 相談トピックごとの需要と、カタログ `tags/category/giftFor/description` 由来の供給数を突き合わせる `detectProductGaps` を追加。
- `app/src/pages/AdminDemo.jsx`: 既存の「AI 改善提案」内に「商品穴の検出」パネルを追加。相談件数 / 該当商品数 / 改善提案文を1〜3件表示。
- `app/src/index.css`: 商品穴パネル用スタイルを追加。サンプル表示中バッジとは別に、改善提案内の補助情報として見せる。
- `app/e2e/demo-flow.spec.js`: `/admin-demo` で商品穴パネルと「相談 n件 / 該当商品 n件」が表示されることを確認。
- `cd app && npm run build`: passed（Vite の既存 chunk size warning のみ）。
- `cd app && npm run lint`: passed。
- `npx playwright test`: 既存の別 repo dev server が `5173` を占有しているため、この repo を `5175` で起動し一時 config で実行。`21 passed`。

## Notes

- 「サンプル表示中」バッジと整合させ、実績と誤認させない（破綻条件）。
