# `.claude` — このリポジトリのハーネス

AI エージェント（Claude Code）を、このリポジトリで**安全に・止まりすぎずに**動かすための制御一式（ハーネス）。
人間向けの「各ファイルが何の責務を持つか」の説明はこの README に集約する。各ファイル内のコメントは補助。

このハーネスは **Kurosawa Thin Harness Architecture**（正本: `docs/specs/kurosawa-thin-harness-architecture.md`、tool-agnostic）の **Claude Code 向け integration** である。アーキ本体（仕様・テンプレ・判断記憶）は `docs/` に置き、`.claude/` はそれを呼ぶ薄い adapter に保つ。

## 設計思想 — 「何を守るか」から決める

ハーネスはテンプレではなく、このプロジェクトで**壊れたら困るもの（脅威モデル）**の写像。
**このプロジェクトで守る対象を最初に言語化すること**（例: secret / 外部副作用・不可逆操作 / 正本データの整合 / 本番データ）。それが決まると、permissions の ask/deny と `detect-safety-boundary` の protected path をどこに引くかが決まる。

> このテンプレは**安全既定（一般則）**で出荷されている: 生インフラ/DBツール（`gcloud`/`terraform`/`psql`/`aws`/`turso`/`supabase`）は **ask**、不可逆なコード/履歴破壊（`rm -rf`/force-push/`git reset --hard`）だけ **deny**。プロジェクトの脅威モデルが「壊れても再構築できる・loss-critical 資産が無い」なら raw ツールを allow に緩めてよいし、本番データを扱うなら ask/deny を厚くする。**他プロジェクトの permissions をそのまま移植しない**——重心は守る対象で変わる。

## 10 Layer → このリポジトリでの実装

アーキ文書の Layer 0–9 を skill / rule / hook / setting / spec へ写像したもの。常時ロード面（CLAUDE.md + rules）は薄いまま、重量はオンデマンドな skill / template / spec / hook に寄せる。

| Layer | 文書の名称 | 実装 | 強制力 |
|---:|---|---|---|
| 0 | Thin Harness | この README + メンテ方針 | 思想 |
| 1 | Harness Weight Class | skill `classify-task` + CLAUDE.md Runtime Protocol | ソフト |
| 2 | Task Contract | skill `create-task`（Lite/Full）+ `docs/templates/task-contract-*.md` | ソフト |
| 3 | Human Judgment Gate | skill `scan-decisions` + `docs/specs/runtime-protocol.md`（stop rules） | ソフト |
| 4 | Capability Boundary | `settings.json` permissions + skill `assess-risk` + `docs/specs/capability-boundary.md` | **ハード**＋ソフト |
| 5 | Change Boundary | skill `control-change` + **hook `detect-safety-boundary`** + `docs/specs/change-boundary.md` | **ハード**＋ソフト |
| 6 | Skeleton / TDD | skill `plan-skeleton` + `execute-task` | ソフト |
| 7 | Reconcile Controller | skill `reconcile-task` + **hook `detect-scope-creep`** | ソフト＋nudge |
| 8 | Evidence / Reality Check | skill `verify-completion`（Evidence Level 0–4）+ `check-claims` + **hook `detect-unverified-claim`** + `docs/specs/evidence-policy.md` | ソフト＋nudge |
| 9 | Judgment Memory | skill `log-decision`（収集）→ `distill-memory`（蒸留）+ `docs/decisions/` + `docs/memory/` + `docs/specs/judgment-memory.md` | 観測 |

> 「**ソフト＝AI への指示（無視されうる）／ハード＝ツール層で実際に止まる**」。permissions（Bash を止める）と `detect-safety-boundary`（Edit/Write の対象パスを止める）の2つでハードを多重化する。

## コンポーネント責務一覧

| 場所 | 責務 | 強制力 | 読み込み |
|---|---|---|---|
| `../CLAUDE.md` | 司令塔。最小の判断基準＋薄い Runtime Protocol。詳細は `docs/` を指す | ソフト | 常時 |
| `rules/` | パス別の柔らかい制約（docs 整合・secret 混入防止 等） | ソフト | 該当パス編集時 |
| `settings.json` (`permissions`) | 操作の許可/承認/禁止を**物理的に**強制 | ハード | 常時 |
| `settings.json` (`hooks`) + `hooks/` | 検出 hooks・セッションログの軽量自動処理 | ハード/nudge | イベント時 |
| `skills/` | 頻出・低リスクな作業手順の呼び出し（Layer 1–9 の手続き本体） | 補助 | 呼ばれた時のみ |
| `logs/` | セッション実行ログ・scope カウンタ（gitignore 済み） | — | — |
| `../docs/specs/` | アーキ本体（マスター）＋ repo 固有 instantiation | — | 参照時 |
| `../docs/templates/` | 各 Layer のテンプレ | — | 必要時 |
| `../docs/decisions/decision-log.md` | 判断日誌。append-only、`log-decision` が追記、Stop hook が boundary 挿入 | — | レビュー時 |
| `../docs/memory/` | 蒸留済み判断記憶（`distill-memory` が更新） | — | 参照時 |

## settings.json — 強制層（Layer 4 の本丸）

`permissions` は3分類。安全既定（一般則）で出荷:

- **allow**: 安全な開発ループ（`make test`/`lint`/`build`、`cargo *`、read-only git、`rg`/`ls`/`grep`/`find` 等）→ 確認なしで進む
- **ask**: 生インフラ/DBツール（`gcloud`/`aws`/`terraform`/`psql`/`turso`/`supabase`）・`doppler run`・`git push`→ 都度承認
- **deny**: 不可逆な**コード/履歴破壊**（`rm -rf`、force-push、`git reset --hard`）→ 実行不可

### hooks

| hook | イベント | 役割 | 強制力 |
|---|---|---|---|
| `detect-safety-boundary.sh` | PreToolUse `Edit\|Write\|MultiEdit` | protected path（`env/secret/**`/`infra/**`/`terraform/**`/`.github/workflows/**`）の編集を exit 2 で止め owner 確認へ。**permissions が見ない Edit/Write の隙間埋め** | ハード |
| `detect-scope-creep.sh` | PostToolUse `Edit\|Write\|MultiEdit` | 1 セッションの編集ファイル数が Standard 上限(8)超で非ブロッキング advisory | nudge |
| `detect-unverified-claim.sh` | Stop | `docs/tasks/done/` 変更時に「done は Evidence Level ≥2」を reminder | nudge |
| session.log / decision boundary | Stop | セッション終了時刻・decision-log の session boundary 追記 | — |

protected path はプロジェクトに合わせて `hooks/detect-safety-boundary.sh` と `docs/specs/change-boundary.md` で調整する。

## skills/ — 作業手順（オンデマンド、常時トークンを食わない）

```
通常:      classify-task ─→ create-task ─→ scan-decisions ─→ plan-skeleton ─→ execute-task/reconcile-task ─→ verify-completion ─→ review-task
危険作業:    ↑           ─→ scan-decisions ─→ assess-risk ─→ ...（Heavy は Task Contract Full + owner approval）
割り込み:   実行中に scope 外/前提崩れ/新リスク/Weight Class 上昇を見つけたら control-change
横断（収集）: 実際に判断を下した時は log-decision で1行残す
横断（蒸留）: decision-log が溜まったら distill-memory で memory-candidates → distilled-memory へ昇格 / rejected へ
```

全部を毎回必須にしない（重くなる）。**Light タスクは classify-task で分類した後、重い手順（scan-decisions 一括質問・plan-skeleton・reconcile-task）をスキップしてよい**——これが Thin Harness を能動的に効かせる仕組み（文書 §22.2: gate が強すぎると速度が死ぬ）。

| Skill | Layer | 責務 |
|---|---|---|
| `classify-task` | 1 | Light/Standard/Heavy を判定し default limits を出す。重さの起点 |
| `create-task` | 2 | docs/tasks に作業メモを1枚（Lite/Full の Task Contract）。spec にはしない |
| `scan-decisions` | 3 | 着手前に「人間の判断が要る箇所」を洗い出し、真の blocker だけ一括質問・残りは既定値で進める |
| `assess-risk` | 4 | 危険作業の前に「失敗したら何が壊れるか」を評価 |
| `control-change` | 5 | 作業中に見つけた scope 外変更/前提崩れ/新リスクを分類 |
| `plan-skeleton` | 6 | 本実装前に構造（files/interface/stub）と TDD contract を固定 |
| `execute-task` | 6 | メモ通りに、既存挙動・テスト・docs を壊さず小さく実装する |
| `reconcile-task` | 7 | 複数 attempt を停止条件付きループで回す。scope を広げて継続しない |
| `verify-completion` | 8 | Goal/Acceptance を**証拠付き**で満たしたか判定。Evidence Level ≥2 が done の下限 |
| `check-claims` | 8 | 結論を書く前に実ファイル/コマンドで主張を裏取り |
| `log-decision` | 9 | 実際に下した判断1件を decision-log へ append |
| `distill-memory` | 9 | decision-log を蒸留し distilled-memory へ昇格・一回限りを rejected へ |
| `review-task` | 終結 | メモ自体の品質を点検する |
| `review-project` | 終結 | 構造・docs・責務境界・テスト不足をレビューする |
| `plan-refactor` | 補助 | 重複/責務ズレの整理計画を、早すぎる共通化なしに立てる |
| `distill-spec` | 補助 | 生ブレスト/貼り付けメモを 01_requirements(仕様)/02_architecture(基礎設計) へ蒸留分離する |

## メンテ方針

- **thin harness**: 常時ロードされる `CLAUDE.md` と `rules/` は最小に保つ。詳細仕様は `docs/specs/`、テンプレは `docs/templates/`、人間向け説明はこの README に集約する。10 Layer 全採用でも、追加重量はオンデマンド面に置く。
- skills は呼ばれた時しか読まれないので増やしても常時コストは低い。汎用 skill は陳腐化に注意。
- 守る対象（secret・不可逆操作・正本・本番データ）が変わったら、まず `settings.json` の ask/deny と `detect-safety-boundary` の protected path を見直す。
- **破綻監視（文書 §22）**: Weight Class が形骸化し全タスク Heavy 扱いになる / Judgment Memory が生ログのまま肥大化する / hooks が誤検知で速度を削ぐ、のいずれかが起きたら畳む。
- 形骸化した層は撤去してよい（decision-log が雑用ログで薄まったら Stop hook の boundary 追記を外す、hook が邪魔なら `settings.json` の該当エントリ削除）。
