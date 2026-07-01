# 04 ワークフロー

## セットアップ

```bash
make setup        # npm install + ビルド
```

初回のみ:

```bash
# Supabase CLI ログイン
supabase login
supabase link --project-ref ftimimljrflfboopsqgm

# .env.local を作成（app/.env.local.example をコピーして値を記入）
cp app/.env.local.example app/.env.local
```

## 作業開始

```bash
git status --short
```

1. `docs/tasks/README.md` を見る。
2. `docs/tasks/active/` から今日の task を選ぶ。
3. task に Scope / Plan / Acceptance Criteria があることを確認する。
4. 中規模以上なら Skeleton を固定してから実装する。

## ローカル開発

```bash
make dev          # Vite 開発サーバー起動 (http://localhost:5173)
make debug        # Playwright でブラウザを開いて目視確認
make debug-ui     # Playwright UI モード（インタラクティブデバッグ）
```

## ビルド確認

```bash
make build        # app/dist/ を生成
make run          # ビルド済み成果物をプレビュー
make lint         # oxlint
```

## Edge Functions デプロイ

```bash
make fn-deploy    # consult-engineer を Supabase にデプロイ
make fn-logs      # デプロイ済み Function のログを確認
```

## テスト

```bash
cd app && npx playwright test   # E2E
make debug                      # headed 実行。導線の目視確認向け
```

## デプロイ

```bash
make deploy       # Cloudflare Pages へデプロイ
```

Cloudflare Pages へ出す前に `make build` 済みであることを確認する。

## 作業終了

```bash
git diff --check
git status --short
```

- 実行した検証を task の `Verification` に残す。
- 未解決事項は task の `Notes` または `backlog/` に移す。
- 確定した仕様・手順・判断は docs 本体、runbook、ADR へ昇格する。
