# AI 検索リランキング実装

## Goal

商品一覧の「AI でおすすめ順に並べ替え」ボタンを実際に動かす。

## Value

検索リランキングは「AI が仕事している」ことが視覚的に分かりやすい機能。デモ映えする。

## Scope

- React 側: 通常検索で候補を 10〜15 件に絞り、`recommend-products` Function へ送る
- Edge Function: OpenAI に「相談文に合う順に並べ替えて」と依頼し、`rankedProductIds` + `reasons` を返す
- React 側: 返ってきた順序で商品カードを並べ替え、各カードに理由を表示する
- フォールバック: AI 障害時は通常検索順のまま表示

## Non-scope

- ベクトル DB・埋め込み（今回は不要）
- 全商品を OpenAI に投げる実装（候補だけ渡す）

## Done

- 相談文入力 → AI 並び替え → 理由付きカード表示 の流れが目視で確認できる
- AI が落ちても通常検索結果が表示される（エラーにならない）

## Evidence

目視確認（Network タブで Function レスポンスも確認）

## Stop / Ask Owner If

- OpenAI のモデル選択（gpt-4o-mini 推奨）で迷ったら確認する
