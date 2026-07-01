# 00 ロードマップ — 「AI で困りごとを解決する EC」

上から順に読むと優先順位が分かる。**これが backlog の入口**。個別詳細は各タスクファイル。

コンセプト（`docs/01_requirements.md`）: 「どの商品が自分の状況に適切か分からない」という**買い物の困りごとを AI が解決する**。追加するのは商品機能ではなく「購買不安を購入理由に変換する機能」。

```text
買う人の不安 → AIが条件整理 → 3品に絞る → 理由で納得 → カートへ → 店舗は相談データで改善
```

## 👉 いま次にやる（active）

**[refactoring-candidates](../active/refactoring-candidates.md)** — P0 実装後のクリーンアップ候補を確認し、次の安全な整理単位を選ぶ。

P0 のコンシェルジュ中核4本は完了済み。次に価値を伸ばすなら P1 の
[gift-fit-labels](gift-fit-labels.md) か [three-product-comparison-view](three-product-comparison-view.md) から着手する。

## Done: P0（このデモの価値を成立させる中核）

| 順 | タスク | 何のため |
|---|---|---|
| 1 | [concierge-card-reasoning-breakdown](../done/concierge-card-reasoning-breakdown.md) | 「AIが勝手に選んだ」→「納得して選ぶ」。理由を分解表示 |
| 2 | [concierge-recommendation-accuracy](../done/concierge-recommendation-accuracy.md) | 提案の"適切さ・正確さ"。属性接地＋理由ズレ修正＋ID整合を1本に統合 |
| 3 | [guided-problem-entry](../done/guided-problem-entry.md) | 困りごとテンプレート入口。書けなくても相談に入れる |
| 4 | [concierge-multi-turn-refinement](../done/concierge-multi-turn-refinement.md) | 追加質問にワンタップで答えて再提案。「解決するまで付き合う」 |

## P1（体験を強くする）

| 順 | タスク | 何のため |
|---|---|---|
| 5 | [gift-fit-labels](gift-fit-labels.md) | 「失敗しにくい/高見え/香り控えめ」等のラベル（比較の軸データにもなる） |
| 6 | [three-product-comparison-view](three-product-comparison-view.md) | 3品をギフト選定軸で比較して納得 |
| 7 | [carry-consultation-context-to-detail](carry-consultation-context-to-detail.md) | 相談の解決根拠を商品詳細に引き継ぐ／「よく選ばれる理由」 |
| 8 | [admin-product-gap-detection](admin-product-gap-detection.md) | `/admin-demo` に「商品穴」検出。営業に刺さる店舗インサイト |
| 9 | [ai-gift-message](ai-gift-message.md) | 添え書き生成。購入後押し（華やかさ） |

## P2（当面やらない ＝ 破綻条件）

普通の EC 機能を増やすとコンセプトが薄れる: レビュー / 会員登録 / お気に入り / クーポン / ポイント / 商品CRUD。

## すでに実装済み（新規タスク不要）

- `source=concierge` のカート/注文記録（`app/src/lib/cart.js:15-35` ＋ `order.fromAi`）
- `/admin-demo` の相談傾向表示・サンプルデータ表示バッジ（`app/src/pages/AdminDemo.jsx`）

## 全タスク共通のガードレール

- **理由を薄くしない**: 「おすすめ/人気」で終わらせず「なぜその相手に合うか/なぜ失敗しにくいか/どんな不安を避けられるか」まで出す。
- **薬機法**: 「敏感肌でも安心/効果がある」等の断言は禁止。「選びやすい/好みが分かれにくい/控えめ/渡しやすい」に寄せる。
- **インサイトを実績に見せかけない**: `/admin-demo` はサンプルと実績を区別する。

## Notes

- 本ロードマップは進行管理の入口であり仕様の正本ではない。確定仕様は `docs/01_requirements.md` / `docs/02_architecture.md` へ昇格する。
- 着手時に該当タスクを `active/` へ移す。
- 2026-07-01 整理: 旧 `concept-gap-analysis.md` を本ファイルへ集約。concierge 系3本を `concierge-recommendation-accuracy.md` に統合。孤児アセット（mobile-reliability-rebuild）を削除。P0 実行順を整理。
- 2026-07-01 更新: P0 の concierge 中核4本（理由3段表示、接地/理由整合、困りごと入口、多ターン再提案）を実装・検証済みとして `done/` に移動。次フェーズは P1 の比較/ラベル/詳細引き継ぎで「納得して買う」体験を厚くする。
