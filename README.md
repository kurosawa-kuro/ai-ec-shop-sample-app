# Lumière Select

**「AI で困りごとを解決する」EC ショップ**のデモ。

「肌が弱い女友達に贈るギフト、どれが適切か分からない」——そんな困りごとを言葉で伝えると、AI が 36 品のカタログから適切な商品を理由つきで提案して解決し、そのまま買えるところまで導く。若い女性向けの美容・ギフトセレクトショップという設定の営業デモサイト。

## 目玉機能

### 1. AI ギフトコンシェルジュ

予算・相手・シーンをそのまま入力すると、AI が 36 品のカタログから渡しやすい 3 つを理由つきで提案する。

**入力例:**
> 予算5,000円で、美容に詳しくない友人へのプチギフト

**AI の返答:**
- おすすめ 3 品（商品名・価格・カテゴリ）
- それぞれを「なぜ渡しやすいか」の一言理由
- そのままカートに追加できる導線

### 2. 商品一覧の AI リランキング

商品一覧でフリーワード（例: 「彼女 高見え 保湿」）を入力すると、AI が候補をおすすめ順に並べ替える。

購入フロー（カート → 注文者情報 → 注文完了 → 注文履歴）と、店舗側デモの店舗インサイト画面（`/admin-demo`）も含む。店舗インサイトは相談・注文・売れ筋・改善提案を集計して見せる。セッションに実績が無いときは、営業デモで「全部 0」に崩れないよう表示専用のサンプルデータにフォールバックする。

## 技術スタック

| レイヤー | 技術 |
|---------|------|
| フレームワーク | React 19 + Vite 8 |
| UI | Pico.css + 独自 CSS + Motion + View Transitions |
| データ | 固定 JS（`products.js`）+ localStorage（DB なし） |
| インフラ | Cloudflare Pages / Supabase Edge Functions |
| AI | DeepSeek API（Supabase Secrets 経由、ブラウザ非公開） |

## セットアップ

```bash
make setup    # 依存取得 + ビルド
make dev      # 開発サーバー起動 (http://localhost:5173)
make build    # 本番ビルド
cd app && npx playwright test  # E2E 確認
```

`DEEPSEEK_API_KEY` / `DEEPSEEK_MODEL` は Supabase Secrets に置く。ブラウザに出さない。AI 呼び出しが未設定・失敗しても、定番候補にフォールバックして動く。

## ディレクトリ構成

```
.
├── app/                           # React + Vite SPA
│   ├── index.html                 # data-theme="light" 固定（Pico のダーク化を無効化）
│   └── src/
│       ├── data/
│       │   ├── products.js            # 商品カタログ（36品）
│       │   └── admin-demo-sample.js   # 店舗インサイトの表示専用サンプルデータ
│       ├── lib/                   # cart / aiLimit / supabase（Edge Function 呼び出し）
│       └── pages/                 # Top / Products / ProductDetail / Concierge
│                                  # Cart / Checkout / Complete / Orders / AdminDemo
├── supabase/functions/
│   ├── concierge/                 # AI ギフト相談 Edge Function
│   └── recommend-products/        # AI 検索リランキング Edge Function
├── env/config.yaml                # 非機密設定（デプロイ先 URL・AI 上限など）
└── docs/                          # ドキュメント
```

## ドキュメント

- [`docs/01_requirements.md`](docs/01_requirements.md) — 目的・ユースケース・制約
- [`docs/02_architecture.md`](docs/02_architecture.md) — 構成・Edge Function I/O・設計境界
