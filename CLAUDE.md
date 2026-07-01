# CLAUDE.md

このファイルは Claude Code がこのリポジトリで作業する際の最小ガイド。

## Source of Truth

- Project overview: `README.md`
- Documentation index: `docs/00_index.md`
- Requirements: `docs/01_requirements.md`
- Architecture: `docs/02_architecture.md`
- Test strategy: `docs/07_test_strategy.md`
- Harness 全体像: `.claude/README.md`（このリポジトリの AI 制御一式）
- Harness アーキ本体: `docs/specs/kurosawa-thin-harness-architecture.md`（tool-agnostic マスター）＋ repo 固有 instantiation（`docs/specs/{runtime-protocol,capability-boundary,change-boundary,evidence-policy,judgment-memory}.md`）
- 判断日誌 / 蒸留記憶: `docs/decisions/decision-log.md` / `docs/memory/`
- Task notes: `docs/tasks/`

## コマンド

```bash
make setup    # 初期セットアップ (依存取得 + ビルド)
make build    # ビルド
make run      # 実行
make dev      # 開発サーバー / ホットリロード
cd app && npx playwright test  # E2E / スモーク確認
make fmt      # フォーマット
make lint     # 静的解析
```

## アーキテクチャ

- フロントエンドは `app/` 配下に置く。商品カタログは `app/src/data/products.js`（DB は持たない）。
- React 19 + Vite 8。Pico.css は最低限の根本スタイルで、画面設計は独自 CSS + Motion + View Transitions で行う。
- **Pico のダークモード対策**: `app/index.html` の `<html>` に `data-theme="light"` を固定している。外すとブラウザのダークモード時に Pico が `<article>`（カード類）を黒背景にして配色が崩れる。外さない。
- **reveal の注意**: `whileInView` は初期ビューポート外の要素が `opacity:0` のまま残ることがある（画面外＝未 reveal）。常時見せたい要素は `animate="show"` を使う。
- DeepSeek API キーはブラウザに出さない。Supabase Edge Functions（`concierge` / `recommend-products`）経由でのみ呼び出す。
- AI 相談履歴・カート・注文は localStorage に保持する。サーバーサイド永続化なし。
- 店舗インサイト（`/admin-demo`）は localStorage を集計。実績が無いときは `app/src/data/admin-demo-sample.js` を表示専用フォールバックにする（localStorage には書かない）。
- 非機密の設定は `env/config.yaml`、フロントのローカル環境変数は `app/.env.local`、`DEEPSEEK_API_KEY` / `DEEPSEEK_MODEL` は Supabase Secrets で管理する。
- 設計・運用ドキュメントは `docs/` 配下。権威順位と更新規約は `docs/00_index.md` に従う。
- パス別ルールは `.claude/rules/` 配下に置く。
- 一回性の作業計画は `docs/tasks/`、繰り返し使う作業手順は `.claude/skills/` に置く。

## 作業ルール

- 推測でコードを書かない。コマンドを書いたら実際に実行して確認する。
- 仕様変更は連動する `docs/` とテストを同一 PR で直す。drift を作らない。
- 既存の関数・ユーティリティ・パターンを優先的に再利用する。
- task note を仕様の正本にしない。確定内容は `docs/specs/`、`docs/adr/`、`docs/runbooks/` に昇格する。
- **Scope invariant（常時）**: 作業中に Goal/Scope 外の変更・前提崩れ・追加副作用・docs と実装の矛盾を見つけたら即実装しない。`control-change` で分類するか follow-up task に残す。「ついで修正/共通化/改名」は scope creep。

## AI Runtime Protocol（薄い・常時）

Thin Harness の常時手順。詳細は `.claude/README.md` と `docs/specs/runtime-protocol.md`、停止条件は同 §「停止して owner に確認する」。

1. Goal / Scope / Done を言い直す。
2. Weight Class を判定（Light / Standard / Heavy → `classify-task`）。Light は以降の重い手順をスキップしてよい。
3. owner-only 判断・保護 capability・allowed/forbidden paths を確認（`scan-decisions` / `capability-boundary.md` / `change-boundary.md`）。
4. Standard/Heavy は skeleton + TDD contract を先に（`plan-skeleton`）。
5. scope 内で最小変更を当てる。複数 attempt が要るなら停止条件付きで回す（`reconcile-task`）。
6. 必要 Evidence Level（≥2、本番は4）で検証（`verify-completion` / `evidence-policy.md`）。
7. scope 拡大・保護境界接触・二度違う理由で検証失敗 → 停止して owner へ。
8. 非自明な判断を下した時だけ記録（`log-decision`）。
