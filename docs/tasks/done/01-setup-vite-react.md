# プロジェクト初期セットアップ（Vite + React）

## Goal

`lumiere-select` の Vite React JS プロジェクトを作成し、ローカルで開発サーバーが起動する状態にする。

## Value

これ以降の全実装の土台。最初にやらないと何も動かない。

## Scope

- `npm create vite@latest` で React テンプレート作成
- `react-router-dom` / `@supabase/supabase-js` / `lucide-react` インストール
- ルーティング骨格（全 9 画面の空コンポーネント + Route 定義）
- Makefile の `make dev` で `vite` が起動するよう設定
- Cloudflare Pages 向け `_redirects` 配置（SPA フォールバック）

## Non-scope

- 画面の中身・スタイル
- Tailwind 導入（CSS 直書きでも可。後回し）
- Supabase / OpenAI 接続

## Done

- `make dev` → `http://localhost:5173` が開く
- 全 9 パスが 404 ではなくコンポーネント名が表示される

## Evidence

- `npm run build` → `dist/` 生成・エラーなし ✅
- `dist/_redirects` 生成確認 ✅
- 全 9 コンポーネント `src/pages/` に作成済み ✅
- `Makefile` の `make dev` / `make build` が動作する ✅

## 完了

2026-06-29 実装完了。`make dev` で起動確認可能。
