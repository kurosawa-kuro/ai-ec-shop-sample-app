# 02 アーキテクチャ — Lumière Select

## 概要

コンセプトは **「AI で困りごとを解決する EC」**。「どの商品が自分の状況に適切か分からない」という困りごとを、
`concierge`（ギフト提案）と `recommend-products`（検索リランキング）の 2 つの AI ゲートウェイで解決する。技術的には次の 3 層。

```text
ブラウザ (React + Vite SPA)
  -> 静的配信: Cloudflare Pages（app/dist を配信）
  -> AI ゲートウェイ: Supabase Edge Functions
       concierge          -> DeepSeek API（ギフト提案）
       recommend-products -> DeepSeek API（商品一覧の検索リランキング）
```

- DB なし。商品カタログは `app/src/data/products.js` の固定 JS（36 品）。
- ログイン不要。カート・注文・相談履歴・AI 利用回数は localStorage。
- AI が落ちても各 Edge Function のフォールバックで継続できる。
- Playwright E2E をローカル品質ゲートにする（CI なし）。

## 構成要素

| 構成要素 | 役割 | 担当パス |
|---|---|---|
| React 19 + Vite 8 | SPA フロントエンド | `app/` |
| Cloudflare Pages | 静的ホスティング。`app/dist/` をデプロイ | — |
| `concierge` Edge Function | DeepSeek ゲートウェイ。相談文からギフト 3 件を提案 | `supabase/functions/concierge/` |
| `recommend-products` Edge Function | DeepSeek ゲートウェイ。候補商品を関連度順にリランキング | `supabase/functions/recommend-products/` |
| `products.js` | 商品カタログ（36 品） | `app/src/data/products.js` |
| `lib/supabase.js` | Edge Function 呼び出し（`askConcierge` / `recommendProducts`） | `app/src/lib/supabase.js` |
| `lib/cart.js` | カート・注文・相談・カートイベントの localStorage 管理 | `app/src/lib/cart.js` |
| `lib/aiLimit.js` | AI 利用回数の 1 日上限（ブラウザ単位） | `app/src/lib/aiLimit.js` |

画面: Top / Products / ProductDetail / Concierge / Cart / Checkout / Complete / Orders / AdminDemo（`app/src/pages/`）。

## Edge Function: concierge

相談文（と任意の商品 ID 候補）を受け取り、美容・ギフト EC のコンシェルジュとして 3 件のギフトを理由つきで提案する。

### I/O

```json
// リクエスト
{
  "query":      "予算5,000円で、美容に詳しくない友人へのプチギフト",
  "productIds": ["gift-001", "skincare-001", "relax-001"]  // 任意。対象を絞る場合のみ
}

// レスポンス
{
  "summary": "予算内で失敗しにくいギフト候補です。",
  "recommendedProductIds": ["gift-001", "skincare-001", "relax-001"],
  "reasons": ["見栄えがよく好みが分かれにくいです", "軽い使い心地で選びやすいです", "香り控えめで渡しやすいです"],
  "followUpQuestion": "相手の方は普段スキンケアをされますか？"
}
```

- `query` は必須（未指定は 400）。サーバー側で 200 字に切り詰める。
- 効能・効果を断言しない system prompt を Edge Function 内で組み立てる。
- フォールバック: DeepSeek がエラー / 例外時は定番 3 件（`gift-001` / `skincare-001` / `relax-001`）と説明文言を返す。

## Edge Function: recommend-products

商品一覧のフリーワード検索を、候補商品の並べ替えとして扱う。

### I/O

```json
// リクエスト
{
  "query": "彼女 高見え 保湿",
  "candidates": [
    { "id": "skincare-003", "name": "ナイトリペア クリーム", "price": 4600, "tags": ["夜ケア", "高見え"] }
  ]
}

// レスポンス
{
  "message": "彼女向けの高見えギフト順に並べ替えました",
  "rankedProductIds": ["skincare-003", "gift-001", "relax-001"],
  "reasons": { "skincare-003": "特別感のある高見えクリーム" }
}
```

- `query` と配列 `candidates` は必須（欠けると 400）。`candidates` は先頭 15 件まで、`query` は 200 字まで。
- フォールバック: エラー / 例外時は候補を通常順のまま返す（`rankedProductIds` = 入力順、`reasons` = 空）。

## 状態の保持（localStorage）

サーバーサイド永続化はしない。`lib/cart.js` / `lib/aiLimit.js` が以下のキーを管理する。

| キー | 内容 |
|---|---|
| `lumiere-cart` | カート内商品 |
| `lumiere-orders` | 確定注文（`fromAi` で AI 経由かを判定） |
| `lumiere-consultations` | コンシェルジュ相談履歴 |
| `lumiere-cart-events` | カート追加イベント（売れ筋集計用） |
| `lumiere-ai-context` | 直近の AI 提案コンテキスト |
| `lumiere_ai_usage_<YYYY-MM-DD>` | その日の AI 利用回数 |

`/admin-demo`（店舗インサイト）はこれらを集計して表示する。セッションに実績が無いときは表示専用のサンプルデータ（`app/src/data/admin-demo-sample.js`）にフォールバックし、localStorage には書き込まない。

## 境界

- `DEEPSEEK_API_KEY` / `DEEPSEEK_MODEL` は Supabase Secrets のみ。ブラウザに出さない。
- 非機密の設定は `env/config.yaml`（`deploy.pagesUrl` / `ai.dailyLimit` / `ai.maxCandidates` など）。フロントのローカル環境変数は `app/.env.local`（`VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`）。
- 主要な制約値: AI 利用は 1 ブラウザ 1 日 50 回（`dailyLimit`）、リランキング候補は 15 件（`maxCandidates`）、相談文・クエリは 200 字（Edge Function 側）。
- ソースコードは `app/` 配下。固定データは `app/src/data/`。

## 関連タスク

- 構造変更・責務移動は実装前に `docs/tasks/active/` へ task を作る。
- 確定した設計判断は `docs/adr/` またはこの文書へ昇格する。
