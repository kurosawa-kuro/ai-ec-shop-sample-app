# AGENTS.md

AI コーディングエージェント（Claude Code / Codex / GitHub Copilot 等）共通の作業ガイド。
Codex は作業前にこのファイルを読むため、ここには repo 共通方針のみ記す。
ツール固有の指示は各ツールのファイル（例: Claude Code は `CLAUDE.md`）に置く。

## プロジェクト概要

- 目的: **Lumière Select** — 若い女性向けの美容・ギフトセレクトショップという設定の AI ギフト EC デモ。目玉機能は AI ギフトコンシェルジュ（予算・相手・シーンを言葉で入力すると 36 品から渡しやすい 3 つを理由つきで提案）と、商品一覧の AI リランキング。購入フローと店舗インサイト（`/admin-demo`）も含む。詳細は `docs/01_requirements.md` を参照。
- 主要技術: React 19 + Vite 8 / Cloudflare Pages / Supabase Edge Functions（`concierge` / `recommend-products`）/ DeepSeek API

## セットアップ / 主要コマンド

```bash
make setup    # 依存取得 + ビルド
make dev      # 開発サーバー
make build    # 本番ビルド
make lint     # oxlint
make fmt      # フォーマット
```

## コーディング規約

- 既存のコード・命名・パターンに合わせる。新規導入より既存の再利用を優先する。
- 変更後は原則 `cd app && npm run build && npm run lint && npx playwright test` を実行してから完了とする。
- 非機密の設定値は `env/config.yaml`、フロントのローカル秘密情報は `app/.env.local`、`DEEPSEEK_API_KEY` / `DEEPSEEK_MODEL` は Supabase Secrets。秘密情報をコミットしない。

## UI / フロント実装の注意（ミス防止）

過去に踏んだ崩れ。UI を触るときは先回りして避ける。

- **ダークモードで確認する**: Pico がブラウザのダークモードで `<article>` 等を黒背景にする。`app/index.html` の `data-theme="light"` 固定を外さない。見た目確認はライト／ダーク両方で行う。
- **`whileInView` で要素が消える**: 初期ビューポート外だと `opacity:0` のまま残る。常時見せたい要素は `animate="show"`。
- **余白**: セクション（特にヒーロー）に背景色を敷くときは内側パディングを必ず入れる。文字が背景の端に貼り付く「ピチピチ」を作らない。
- **見出し**: 過度に大きい明朝見出しやオールドスタイル数字（`3` が下付きに見える）を避け、普通サイズで読みやすく。
- **デプロイ後の見た目確認**: `make deploy` 後は本番 URL をライト／ダーク・デスクトップ／モバイルで確認する。

## ドキュメント

設計・仕様・運用は `docs/` 配下を参照。更新規約と権威順位は `docs/00_index.md` に従う。
仕様レベルの変更は連動するドキュメントを同一 PR でまとめて直す。

## Codex / Claude Code

- `AGENTS.md` は Codex / 他エージェント共通ガイド。
- `CLAUDE.md` は Claude Code の司令塔。
- `.claude/rules/` と `.claude/skills/` は Claude Code 用。Codex が読む前提にしない。
- Codex 向けに永続させたい recurring な指摘やミス防止は、この `AGENTS.md` または nested `AGENTS.md` に小さく追加する。

## Harness（AI 制御一式）

- このリポジトリの AI 制御の全体像は `.claude/README.md`（Kurosawa Thin Harness Architecture の実装）。
- アーキ本体（tool-agnostic マスター）は `docs/specs/kurosawa-thin-harness-architecture.md`、repo 固有の脅威モデルは `docs/specs/{capability-boundary,change-boundary,runtime-protocol,evidence-policy,judgment-memory}.md`。
- permissions の ask/deny と保護パスは脅威モデルで決める。**他プロジェクトの設定をそのまま移植しない**。

## Task / Skill

- 一回性の作業計画・調査メモ・実装タスクは `docs/tasks/` に置く。
- Claude Code で繰り返し使う作業手順は `.claude/skills/` に置く。
- task note を仕様の正本にしない。確定した仕様は `docs/specs/`、判断理由は `docs/adr/`、運用手順は `docs/runbooks/` に昇格する。
