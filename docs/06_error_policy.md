# 06 エラー方針

## エラー分類

| 分類 | 発生箇所 | 対応 |
|---|---|---|
| AI タイムアウト / 障害 | Supabase Edge Function → OpenAI | フォールバック固定候補を表示。ユーザーにエラーを出さない |
| Supabase 呼び出し失敗 | React → Edge Function | フォールバックに切り替え。コンソールに記録 |
| 入力バリデーション違反 | Edge Function 受信時 | 400 を返し、React 側でフォールバック表示 |
| localStorage 読み書き失敗 | カート / 注文履歴 | 例外を catch してセッション限りのメモリで継続 |
| ルーティング不一致（404） | Cloudflare Pages | `_redirects` で `/index.html` にフォールバック（SPA） |
| アニメーション非対応 | View Transition API 未対応ブラウザ | 通常の React Router 遷移にフォールバック |
| reduced motion | OS / ブラウザで動きを減らす設定 | Motion と CSS アニメーションを抑制 |

## AI フォールバック戦略

OpenAI または Supabase が応答しない場合は、ユーザーに「AI が混み合っています」と表示し、以下を返す。

- **recommend-products**: 候補商品をリランキングなしの通常順で返す
- **concierge**: 固定の定番 3 件（`gift-001` / `skincare-001` / `relax-001`）を返す

フォールバック中も購入フローは継続できる状態を保つ。

## 入力制限

Edge Function 側で以下を強制する（コスト事故防止）。

| 制限 | 値 |
|---|---|
| 相談文の最大文字数 | 200 文字 |
| リランキング候補の最大数 | 15 件 |

## OpenAI モデル

- Edge Functions は Supabase Secret `OPENAI_MODEL` を優先する。
- 未設定時は低コスト寄りの `gpt-5.4-nano` を使う。
- `OPENAI_API_KEY` と `OPENAI_MODEL` はブラウザに露出させない。

## ログ

- `OPENAI_API_KEY` などの秘密情報はログに出さない。
- Edge Function のエラーは Supabase Dashboard > Logs で確認する（`make fn-logs`）。
- フロントエンドはコンソールへの出力のみ（本番ログ収集基盤なし）。

## 関連タスク

- エラー分類、リトライ、ログ出力の変更は task に再現条件と期待する観測結果を残す。
- 障害対応で得た恒久手順は task に閉じず、`docs/runbooks/` へ昇格する。
- 回帰防止が必要なものは `07_test_strategy.md` と task の `Acceptance Criteria` に反映する。
