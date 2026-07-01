# 相談の解決根拠を商品詳細に引き継ぐ

## Goal

コンシェルジュで「あなたの困りごとにこう合う」と提示した理由・相談文を、商品詳細ページでも見えるようにし、解決根拠が導線の途中で消えないようにする。

## Context

- 種別: 改善（解決体験の連続性）。
- 現状、商品詳細は**静的な** `product.aiReason` しか出さない: `app/src/pages/ProductDetail.jsx:44-45`。
- 相談時に文脈は保存されている: `saveAiContext(recommendedProductIds, query)`（`app/src/lib/cart.js:65`、`Concierge.jsx:79`）が、詳細ページはそれを読んでいない（`ProductDetail.jsx` に `getAiContext` 参照なし）。
- そのため「相談 → 詳細を見る」（`Concierge.jsx:249`）で遷移すると、なぜ自分に合うのかの文脈が失われる。

## Scope

- `ProductDetail` で `getAiContext()` を読み、当該商品が直近の相談で提案された商品なら「あなたの相談『…』に対して AI が選んだ商品です」的な文脈バナーを出す。
- 相談由来でない通常閲覧時は従来通り静的 aiReason のみ。

## Non-scope

- 詳細ページで再度 AI を呼ぶこと（コスト増）。
- 相談ごとの理由文の永続保存スキーマ拡張は最小限に。

## Skeleton

- `getAiContext()` の `productIds` / `query` を使い、`product.id` が含まれる場合のみ文脈表示。

## Plan

1. `getAiContext` を `ProductDetail` で読む。
2. 当該商品が相談対象かを判定し、相談文を添えた文脈表示を追加。
3. 相談の理由文も引き継ぎたい場合は `saveAiContext` に理由を含める拡張を検討（別途）。

## Acceptance Criteria

- 相談 → 詳細で、相談文脈のバナーが出る。
- 通常閲覧では従来表示のまま（回帰なし）。

## Verification

- `cd app && npm run build && npm run lint && npx playwright test`
- 手動: 相談から詳細に飛んだときだけ文脈が出ることを確認。

## FB 反映（owner・P1 拡張）

個別相談の文脈引き継ぎに加えて、**「AI相談でよく選ばれる理由（集計）」**を商品詳細に出す案。相談データ（`lumiere-consultations` / cart events）を集計し、その商品が相談で選ばれやすい傾向を提示する。例:

```text
AI相談でよく選ばれる理由
・友人向けの軽めのギフトとして選ばれやすい
・予算5,000円以内に収まりやすい
・香りや色の好みが分かれにくい
```

これにより商品詳細が単なるカタログでなく「相談データを反映した販売ページ」に見える。`/admin-demo` の集計ロジック（[admin-product-gap-detection.md](admin-product-gap-detection.md)）と語彙・集計を揃えると再利用が効く。個別文脈（本体 Scope）と集計（本拡張）は段階実装でよい。

## Notes

- 文言は薬機法配慮（断定を避ける）。既存トーンに合わせる。
- 集計は少数データでも破綻しないフォールバック文を用意する。
