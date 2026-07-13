Cloudflare Cron Triggerはよい選択です

# アイデア: Supabase 無料枠の自動休止を防ぐ定期ヘルスチェック

- 日付: 2026-07-13
- 種別: idea / ops（仕様・実装方針はスコープ外。着手時に別タスクへ切り出す）
- 正本: **`kurosawa-ai-consulting-site/docs/tasks/idea/2026-07-13-Supabase自動休止を防ぐ定期ヘルスチェック.md` をマスターとする。** このプロジェクトは kuro サイトと Supabase を共有しているため、実装は 1 系統に集約する（下記「共有プロジェクト」）。本ファイルは lumiere 側からの入口。
- 状態: **2026-07-14 kuro 側に実装完了。** `kurosawa-ai-consulting-site/ops/supabase-keepalive/` の Cloudflare Cron Worker 1 系統が両サイトを担当する。lumiere 側に cron は追加しない。

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

## 方針（案）

- 数日おき（例: **3 日ごと**。7 日に対し十分な余裕）に Edge Function を 1 回叩く。
- **LLM コストを出さない叩き方**にする（DeepSeek を呼ばない）:
  - OPTIONS（CORS preflight）→ 200 を返し LLM 未呼び出し、または
  - 必須項目を欠いた POST → バリデーションエラーで関数は起動するが LLM 未呼び出し。
- いずれも「Edge Function 起動＝プロジェクトのアクティビティ」になる想定。

## 実行場所の候補（着手時に 1 つ選ぶ）

1. **GitHub Actions の `schedule`（cron）** ← 推奨。無料・リポでバージョン管理・追加インフラ不要。anon key は GitHub Secrets。
2. Cloudflare Workers Cron Triggers（サイトが CF Pages のため親和性が高い）。
3. 外部監視（UptimeRobot 等）。keep-alive と死活監視を兼ねられるが外部サービス依存。

## 着手時に確定すべきオープン事項

- [ ] Supabase の「アクティビティ」判定に **Edge Function 起動が本当にカウントされるか要検証**。カウントされない場合の代替: 極小 `health` テーブルを 1 つ作り PostgREST で `select`（※現状は両リポとも DB テーブル無し＝localStorage 運用のため、テーブル新設が必要）。
- [ ] インターバル（3 日 or それ未満）。
- [ ] 実行場所（上記 1〜3）と、どのリポに cron を置くか。
- [ ] 失敗時の通知（pause 検知 → メール / Slack）。死活監視を兼ねるか。
- [ ] anon key の保管場所（Secrets）。ハードコードしない。

## スコープ外

- アプリコードの変更。
- 有料プラン移行（pause を完全に無くす別解。コスト方針は別途判断）。

## 参考（今回の一次情報）

- 復帰手順: Management API `POST /v1/projects/ftimimljrflfboopsqgm/restore`（CLI のアクセストークンで実行、HTTP 200）→ `INACTIVE → COMING_UP → RESTORING → ACTIVE_HEALTHY`。
- 対象 Edge Function: lumiere = `concierge`, `gift-message`, `recommend-products` / kuro = `consult-engineer`。
