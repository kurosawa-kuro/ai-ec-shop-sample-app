# 08 リリース Runbook

## リリース前チェック

```bash
make build        # ビルドエラーがないことを確認
make lint         # oxlint
cd app && npx playwright test   # E2E 15件
```

- `docs/tasks/active/` にリリース前の未完了 blocker が残っていないことを確認する。
- リリース対象 task の `Verification` に検証結果が残っていることを確認する。
- `.env.local` はコミットしない。Cloudflare / Supabase 側の環境変数・Secrets で管理する。

## デプロイ手順

### 1. Edge Functions（Supabase）

```bash
make fn-deploy
# → supabase functions deploy recommend-products
# → supabase functions deploy concierge
```

デプロイ後の動作確認:

```bash
make fn-logs      # ログに ERROR がないことを確認
```

Supabase Secrets:

| 変数名 | 用途 |
|---|---|
| `OPENAI_API_KEY` | Edge Function から OpenAI を呼ぶ。ブラウザには公開しない |
| `OPENAI_MODEL` | 任意。未設定時は Function 側の低コスト寄りデフォルトを使う |

### 2. フロントエンド（Cloudflare Pages）

```bash
make build        # app/dist/ を生成
```

Cloudflare Pages は `app/dist/` をデプロイする。
このリポジトリの Makefile では以下を使う。

```bash
make deploy       # cd app && wrangler pages deploy dist --project-name lumiere-select --commit-dirty=true
```

直接実行する場合:

```bash
cd app && wrangler pages deploy dist --project-name lumiere-select --commit-dirty=true
```

環境変数は Cloudflare Pages の Settings > Environment variables に設定:

| 変数名 | 値 |
|---|---|
| `VITE_SUPABASE_URL` | `https://ftimimljrflfboopsqgm.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase Dashboard > Settings > API > anon key |

## デプロイ後確認

公開 URL で以下を目視確認:

1. トップページが開く
2. 商品一覧が表示される
3. AIコンシェルジュに相談 → レスポンスが返る
4. カート → 注文完了 の流れが通る
5. 注文履歴に直前の注文が反映される
6. `/admin-demo` に AI 相談、注文、ランキング、改善提案が反映される
7. 商品追加時に商品画像起点のカート飛び演出とバッジ更新が見える
8. 一覧 → 詳細、カート → checkout の遷移が View Transitions 対応環境で自然につながる
9. `prefers-reduced-motion: reduce` で過剰なアニメーションが抑制される
10. ページリロードで 404 にならない（`_redirects` が効いている）

## ロールバック

**Edge Functions**: Supabase Dashboard > Edge Functions > 対象 Function > 旧バージョンに切り替える

**フロントエンド**: Cloudflare Pages Dashboard > Deployments > 前のデプロイに "Rollback" する

## リリース後タスク

- リリース後の確認事項は `docs/tasks/active/` または `docs/tasks/backlog/` に残す。
- 恒久的な運用手順になったものは `docs/runbooks/` へ昇格する。
