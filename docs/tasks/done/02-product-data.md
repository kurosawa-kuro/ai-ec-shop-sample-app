# 商品データ作成（products.js）

## Goal

固定商品データ 36 件を `src/data/products.js` に作成する。

## Value

AIリランキング・コンシェルジュ・一覧・詳細すべてがこのデータに依存する。薄いデータだと AI の提案理由が弱くなる。

## Scope

- 6 カテゴリ × 6 件 = 36 件
  - スキンケア / ヘアケア / ボディケア / 香り・リラックス / ギフトセット / メンズから贈るギフト
- 各商品フィールド: `id` / `name` / `category` / `price` / `tags` / `giftFor` / `description` / `aiReason`
- タグは女性受け重視（高見え・失敗しにくい・敏感肌向け・初心者向け・ギフト向けなど）
- 効能断言をしない（「使いやすい」「失敗しにくい」表現に統一）

## Non-scope

- 実在商品・実在ブランドの使用
- 画像素材の準備（プレースホルダーで可）
- 薬機法表現の審査（今回はリスクを避ける書き方に統一）

## Done

- `import products from './data/products'` で 36 件取れる
- 全カテゴリに最低 6 件ある

## Evidence

`console.log(products.length)` → 36

## Stop / Ask Owner If

- 商品名・価格帯の方向性でイメージが違ったら確認する
