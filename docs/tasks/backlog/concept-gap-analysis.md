# コンセプト差分分析 — 「AI で困りごとを解決する EC」

## Goal

コンセプト **「AI で困りごと（どの商品が自分の状況に適切か分からない）を解決する EC」**（`docs/01_requirements.md`）に対して、現状の実装で **足りない機能 / 修正すべき機能** を洗い出し、実行単位のタスクに分割する。この文書は入口（index）で、詳細は各タスクファイルに置く。

## Context

- 調査日: 2026-07-01。コード実測ベース（推測なし）。
- 中核導線: コンシェルジュ（`app/src/pages/Concierge.jsx` + `supabase/functions/concierge/`）が「困りごと→適切な3品を理由つきで提案」を担う。
- 現状は「動く」が、"適切さ" と "解決までの往復" にコンセプト上の穴がある。

## 差分一覧（優先度順）

| # | 種別 | 概要 | 影響 | タスク |
|---|---|---|---|---|
| 1 | 修正(核心) | コンシェルジュがカタログ属性（tags/giftFor/category）を AI に渡さず、商品 ID だけ渡している。「肌が弱い→敏感肌向け」の対応づけが AI の推測頼みで不安定 | 提案の"適切さ"＝コンセプトの核が担保されない | [concierge-ground-recommendations-in-catalog.md](concierge-ground-recommendations-in-catalog.md) |
| 2 | 不具合 | 提案理由と商品がズレうる。無効 ID を除外/フォールバック補完した後も `reasons` は AI の元インデックス参照のまま | 誤った理由が別商品に付く＝信頼を損なう | [concierge-reason-product-alignment.md](concierge-reason-product-alignment.md) |
| 3 | 不足(核心) | 追加質問（followUpQuestion）が表示のみで、答えて絞り込む導線が無い。lead は「2ターン以内」と謳うが実質1ターン | 「解決するまで付き合う」体験が成立しない | [concierge-multi-turn-refinement.md](concierge-multi-turn-refinement.md) |
| 4 | 改善 | 相談で提示した「あなたの困りごとにこう合う」理由が商品詳細に引き継がれない（詳細は静的 aiReason のみ） | 解決根拠が導線の途中で消える | [carry-consultation-context-to-detail.md](carry-consultation-context-to-detail.md) |
| 5 | 修正(小) | Edge Function の system prompt の商品 ID 例が実データと不一致（`mens-gift-001〜006` 実際は `mensgift-001`）。無効 ID を誘発 | 提案精度・フォールバック頻度に悪影響 | [concierge-prompt-id-mismatch.md](concierge-prompt-id-mismatch.md) |
| 6 | 改善 | 困りごとの構造化入口が弱い（自由文＋チップのみ）。「肌が弱い」「香りが苦手」「予算内」「何が喜ばれるか分からない」等の"困りごと起点"の入口が薄い | 解決に入る前の離脱・入力ハードル | [guided-problem-entry.md](guided-problem-entry.md) |

## 次点（今回はタスク化せず、ここに記録のみ）

- **相談履歴の活用**: `recordConsultation`（`app/src/lib/cart.js:84`）で保存しているが、ユーザー側に「前回の相談を再開」導線が無い。解決の継続性を高める余地。
- **検索体験の非対称**: 商品一覧の AI リランキングはキーワード前提（`app/src/pages/Products.jsx:125` の例 `例: 彼女 高見え 保湿`）。ヒーロー/コンシェルジュの自然文コンセプトと入力様式が揃っていない。
- **フォールバック時の透明性**: AI 障害/上限時に定番3品へ落ちるが（`Concierge.jsx:82-85`）、「なぜこの3品か」の説明が弱く、"解決した感"が下がる。

## Acceptance Criteria

- 上記 #1〜#6 が個別タスクファイルとして `backlog/` に存在し、各々が Goal / 根拠(file:line) / Scope / Done を持つ。
- 各タスクがコンセプト（困りごと解決）との関係を明記している。

## FB 反映（2026-07-01 追記）

owner FB の要旨: **追加すべきは商品機能ではなく「購買不安を分解して購入理由に変換する機能」**。価値の流れは

```text
買う人の不安 → AIが条件整理 → 3品に絞る → 理由で納得 → カートへ → 店舗は相談データで改善
```

この流れを強化する機能だけを入れ、普通の EC 機能（レビュー/会員/お気に入り/クーポン/ポイント/在庫/配送）は後回しにする。

### 優先度（FB 準拠）

```text
P0（すぐ）
- AI提案カードの3段理由化（おすすめ理由/渡しやすい点/注意点） … 最優先。owner が「次はまずこれ」と指名
- 困りごとテンプレート入口
- 追加質問のワンタップ回答
P1（次）
- 3商品比較ビュー（ギフト選定軸）
- 失敗しにくさラベル
- 商品詳細の「AI相談でよく選ばれる理由（集計）」
- ギフトメッセージ生成
P2（後回し）
- レビュー / 会員登録 / お気に入り / クーポン / ポイント / 商品CRUD
```

### すでに実装済み（新規タスク不要・FB の P0 と重複）

- `source=concierge` のカート/注文記録: `app/src/lib/cart.js:15-35`（addToCart source）＋ `order.fromAi`。
- `/admin-demo` の相談傾向表示: `app/src/pages/AdminDemo.jsx`（よくある相談トップ3）。
- サンプル/実績の区別バッジ: 「サンプルデータを表示中」表示済み（`AdminDemo.jsx`）。透明性強化の余地は #12 に記載。

### FB 由来タスク（新規＋既存への統合）

| # | 優先 | タスク | FB 対応 |
|---|---|---|---|
| 7 | **P0(最優先)** | [concierge-card-reasoning-breakdown.md](concierge-card-reasoning-breakdown.md) | AI提案カードを「おすすめ理由/渡しやすい点/注意点/合う条件」に分解。owner 指名の次アクション |
| 6→P0 | P0 | [guided-problem-entry.md](guided-problem-entry.md) | 困りごとテンプレート入口（チップ→query→送信）。FB のチップ例を反映 |
| 3→P0 | P0 | [concierge-multi-turn-refinement.md](concierge-multi-turn-refinement.md) | 追加質問のワンタップ回答（候補ボタン）を追記 |
| 8 | P1 | [three-product-comparison-view.md](three-product-comparison-view.md) | 3商品比較ビュー（スペックでなくギフト選定軸） |
| 9 | P1 | [gift-fit-labels.md](gift-fit-labels.md) | 失敗しにくさ等のラベル（giftSafety/easyToGive…を数値でなくラベル表示） |
| 10 | P1 | [ai-gift-message.md](ai-gift-message.md) | 添え書き（ギフトメッセージ）生成 |
| 4→P1 | P1 | [carry-consultation-context-to-detail.md](carry-consultation-context-to-detail.md) | 詳細に「AI相談でよく選ばれる理由（集計）」を追記 |
| 11 | P0/P1 | [admin-product-gap-detection.md](admin-product-gap-detection.md) | `/admin-demo` に「相談は多いが該当商品が弱い領域（商品穴）」検出 |

### 破綻条件（やらないこと / ガードレール）

- **機能を増やしすぎない**: 普通の EC 機能を足すとコンセプトが薄れる。P2 は当面やらない。
- **理由を薄くしない**: 「あなたにおすすめ/人気/ギフトに良い」で終わらせない。「なぜその相手に合うか/なぜ失敗しにくいか/どんな不安を避けられるか」まで出す。
- **薬機法**: 「敏感肌でも安心/肌荒れしない/効果がある」等の断言は禁止。「選びやすい/確認しやすい/好みが分かれにくい/控えめ/渡しやすい」に寄せる（全タスク共通）。
- **インサイトを実績に見せかけない**: `/admin-demo` は「このブラウザのデモ実績」と「サンプル店舗インサイト」を明確に分ける（#12 として下記に記録）。

### 次点（記録のみ・未タスク化）

- #12 `/admin-demo` の透明性強化: サンプル表示バッジはあるが、「デモ実績」と「サンプル」を UI 上でより明確に分離する余地。着手要否は owner 判断。

## Notes

- 本 index は分析の正本ではない。確定した仕様変更は `docs/01_requirements.md` / `docs/02_architecture.md` へ昇格する。
- 実装はまだ行わない（本タスクは「調査＋タスク化」まで）。着手時に `active/` へ移す。
- owner 指名の次アクション = **#7（提案カードの3段理由化）**。
