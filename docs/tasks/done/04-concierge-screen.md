# AI コンシェルジュ画面 /concierge

## Goal

`/concierge` でユーザーが相談文を入力し、推薦商品 3 件と理由が返る体験を作る。
Supabase Edge Function 接続前は疑似 AI（固定フォールバック）で動作させる。

## Value

このアプリの主役機能。デモで最も見せたい画面。

## Scope

- 入力テキストエリア + 送信ボタン
- 質問チップ（彼女への誕生日プレゼント / 予算5,000円以内 / 肌が弱い人向け / 美容初心者向け / 自分へのご褒美 など）
- 疑似 AI レスポンス（固定 JSON をランダムまたはキーワードマッチで返す）
- レスポンス表示: summary + 商品カード 3 件 + followUpQuestion
- 2 ターン以内で商品提案まで到達する UX

## Non-scope

- Supabase Edge Function / OpenAI の実際の呼び出し（後のタスク）
- 会話履歴の永続化

## Done

- 入力 → 疑似 AI レスポンスが返る
- 推薦商品カード 3 件が表示される
- フォールバック文言が表示される（AI が混雑中など）

## Evidence

目視確認

## Stop / Ask Owner If

- 特になし。疑似 AI で動けば次のタスクへ進む
