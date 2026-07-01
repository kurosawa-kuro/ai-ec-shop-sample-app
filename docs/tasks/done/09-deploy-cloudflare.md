# Cloudflare Pages デプロイ

## Goal

`lumiere-select` を Cloudflare Pages に公開し、外部 URL でデモを見せられる状態にする。

## Value

営業デモの最終ゴール。URL を渡すだけでデモできるようになる。

## Scope

- `npm run build` → `dist/` が生成される
- Cloudflare Pages プロジェクト作成・`dist/` をデプロイ先に設定
- SPA フォールバック（`_redirects`: `/* /index.html 200`）
- 環境変数（`VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`）を Pages の設定に追加
- デプロイ後に主要導線（トップ → コンシェルジュ → カート → 注文完了）を目視確認

## Non-scope

- カスタムドメイン（任意）
- CI/CD パイプライン

## Done

- 公開 URL でアプリが開く
- AI コンシェルジュが動く（Supabase Function 経由）
- ページリロードで 404 にならない

## Evidence

目視確認（公開 URL でのブラウザ確認）

## Stop / Ask Owner If

- Cloudflare アカウントの準備ができていなければ確認する
- 公開 URL を拡散する前に owner に確認する
