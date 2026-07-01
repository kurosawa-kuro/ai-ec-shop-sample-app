# Supabase Edge Functions セットアップ + OpenAI 接続

## Goal

`recommend-products` と `concierge` の Edge Function を Supabase にデプロイし、OpenAI API を呼べる状態にする。

## Value

疑似 AI から本物の AI に切り替わる。デモの説得力が上がる。

## Scope

- Supabase プロジェクト作成・CLI セットアップ
- `supabase functions new recommend-products`
- `supabase functions new concierge`
- Supabase Secrets に `OPENAI_API_KEY` を設定（ブラウザに出さない）
- 各 Function の最小実装（OpenAI chat completion 呼び出し → JSON レスポンス）
- `env/config.yaml` に `SUPABASE_URL` / `SUPABASE_ANON_KEY` を記載

## Non-scope

- JWT 認証・RLS（今回はデモ用途のため簡易版）
- レート制限の本格実装（入力文字数・候補数の制限のみ）

## Done

- `curl` で Edge Function を叩いて OpenAI レスポンスが返る
- React 側から `@supabase/supabase-js` で呼び出せる

## Evidence

目視確認（curl + ブラウザ Network タブ）

## Stop / Ask Owner If

- Supabase プロジェクトのアカウント・プランを確認する必要があれば聞く
- API キーの管理場所（Secrets / env）で迷ったら確認する
