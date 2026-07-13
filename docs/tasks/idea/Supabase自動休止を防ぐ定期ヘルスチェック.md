# アイデア: Supabase 無料枠の自動休止を防ぐ定期ヘルスチェック

- 日付: 2026-07-13
- 種別: idea / ops（仕様・実装方針はスコープ外。着手時に別タスクへ切り出す）
- 正本: **`kurosawa-ai-consulting-site/docs/tasks/idea/2026-07-13-Supabase自動休止を防ぐ定期ヘルスチェック.md` をマスターとする。** このプロジェクトは kuro サイトと Supabase を共有しているため、実装は 1 系統に集約する（下記「共有プロジェクト」）。本ファイルは lumiere 側からの入口。
- 状態: **2026-07-14 kuro 側に実装・本番反映完了。** `kurosawa-ai-consulting-site/ops/supabase-keepalive/` の Cloudflare Cron Worker 1 系統が両サイトを担当する。lumiere 側に cron は追加しない。

## 発端

2026-07-13、kuro サイトの AI 相談機能が全応答エラーになっていた。原因はコードではなく、**共有 Supabase プロジェクト `ftimimljrflfboopsqgm` が無料枠の「7 日間無アクセス」で自動休止(INACTIVE)** し、subdomain が DNS から外れて Edge Function 呼び出しが全滅していたこと。Management API の restore で復帰済み。**同じプロジェクトを使う lumiere の Edge Function（concierge / gift-message / recommend-products）も同時に沈黙する構造**なので、lumiere にとっても他人事ではない。

## 背景 / なぜ必要か

- Supabase 無料枠は **7 日間プロジェクトへのアクセスが無いと自動 pause** する仕様。
- 個人ポートフォリオは実トラフィックが少なく、無アクセス期間が 7 日を超えやすい → **再発リスクが構造的に高い**。
- pause されると AI 機能（Edge Function）が全滅し、気づくまで放置される。

## ゴール

- プロジェクトを定期的にアクティブへ保ち、**無料枠のまま**自動休止を防ぐ。
- 併せて、万一止まっても早期検知できる状態にする（keep-alive 兼 死活監視）。

## 重要 — この Supabase プロジェクトは 2 サイトで共有

- `lumiere-select` と `kurosawa-ai-consulting-site` は **同一プロジェクト `ftimimljrflfboopsqgm`** を使用（両リポの `env/config.yaml` が同じ URL を指す）。
- → keep-alive は **1 系統に集約**する。2 つ作らない（同じプロジェクトを二重に叩くだけで無駄・drift の温床）。
- cron をどちらのリポに置くかは着手時に 1 箇所へ決定する。どちらの Edge Function を叩いてもプロジェクト全体が生き延びるので、叩く関数は 1 つで足りる。

## 決定・実装内容

- `kurosawa-ai-consulting-site` の Cloudflare Cron Worker に一本化した。
- 毎日 03:23 UTC に起動し、PostgREST 経由で singleton `project_health` を 3 回 `SELECT` する。
- Edge Function の OPTIONS ではなく、Supabase が休止判定の根拠として説明する user database activity を直接発生させる。LLM 呼び出しや書き込みは行わない。
- `anon` には対象 1 行の `SELECT` だけを RLS で許可し、anon key は Cloudflare Secret で管理する。
- 失敗時は構造化エラーログを出して throw し、Cron Event を失敗扱いにする。
- GitHub Actions は、公開リポジトリが 60 日間非アクティブだと scheduled workflow が自動無効化されるため不採用とした。

## 残作業

- [x] 実行基盤・実行間隔・DB activity の方法を確定
- [x] Worker、migration、test、runbook を実装
- [x] 本番 migration を適用
- [x] Cloudflare Secret を登録し Worker をデプロイ
- [x] 本番 Supabase へ同一の health query を3回実行し、全件成功を確認
- [ ] 初回 scheduled event 後に Workers Logs / Cron Events を確認

## スコープ外

- アプリコードの変更。
- 有料プラン移行（pause を完全に無くす別解。コスト方針は別途判断）。

## 参考（今回の一次情報）

- 復帰手順: Management API `POST /v1/projects/ftimimljrflfboopsqgm/restore`（CLI のアクセストークンで実行、HTTP 200）→ `INACTIVE → COMING_UP → RESTORING → ACTIVE_HEALTHY`。
- 対象 Edge Function: lumiere = `concierge`, `gift-message`, `recommend-products` / kuro = `consult-engineer`。
