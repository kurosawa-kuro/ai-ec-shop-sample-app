# コンシェルジュの多ターン絞り込み（追加質問に答えて再提案）（P0）

## Goal

AI の追加質問（followUpQuestion）に答えると、その回答を踏まえて再提案が走る往復を作り、「解決するまで付き合う」体験を成立させる。

## FB 反映（owner・P0）

追加質問は自由入力だけだと面倒。**候補ボタン（ワンタップ回答）**を出す。例:

```text
相手の方は香りのあるアイテムが好きそうですか？
[好きそう] [苦手そう] [分からない]

相手との関係性は？
[友人] [彼女] [職場] [家族]
```

`AI相談 → 追加質問 → ワンタップ → 再提案` のループで AI 接客らしさを出す。候補ボタンは Edge Function 応答に選択肢を含めるか、質問文からクライアントで定型候補を出す。

## Context

- 種別: 不足（コンセプト核心「困りごとを解決する」）。
- 現状、追加質問は **表示のみ**で答える導線が無い: `app/src/pages/Concierge.jsx:259-268`。
- 画面の lead は「2ターン以内におすすめ商品まで案内します」と謳うが（`Concierge.jsx:110-112`）、実装は 1 ターンで終わる（謳い文句と実装の drift）。
- 追加質問は `concierge` Edge Function が返す（`supabase/functions/concierge/index.ts` の JSON `followUpQuestion`）。

## Scope

- 追加質問に対する簡単な回答入力（チップ or テキスト）を用意。
- 回答を元の相談文に連結して再度 `askConcierge` を呼び、結果を差し替える。
- 会話状態（元の相談＋回答）を保持。

## Non-scope

- 無制限のチャット化。ターン数は AI 利用上限（`app/src/lib/aiLimit.js`、1日50回）と整合する範囲に留める。
- サーバー永続化（localStorage 内で完結）。

## Skeleton

- `messages`（相談文の積み上げ）を state に持ち、送信時に連結クエリを作る。追加質問回答は「相談文＋回答」を新クエリとして再送。

## Plan

1. 追加質問の下に回答 UI（想定回答チップ＋自由入力）を追加。
2. 回答送信で連結クエリを作り再 `askConcierge`。
3. 結果とサマリを更新。ターン表記（1/2 等）を出すか検討。
4. lead の「2ターン以内」を実装挙動に合わせる（または実装を lead に合わせる）。

## Acceptance Criteria

- 追加質問に答えると再提案が反映される。
- lead の謳い文句と実挙動が一致する（drift 解消）。
- AI 上限超過時は既存フォールバック/文言で破綻しない。

## Verification

- `cd app && npm run build && npm run lint && npx playwright test`
- 手動: 1回目提案 → 追加質問回答 → 2回目提案が変わることを確認。

## Notes

- アニメーション（thinking→results）は既存の仕組みを再利用する。
