# フロントエンドデザイン再構築 Runbook

## 目的

Lumière Select を「動く EC デモ」から「営業で見せられる AI ギフト EC プロダクト」に引き上げるための実行手順。

この runbook は、色の微調整ではなく、以下を優先する。

- 基本的なシステム UI の骨格
- 商品を選ぶ体験
- AI が購買体験を動かしている印象
- 管理画面の業務ダッシュボード感
- デスクトップ / モバイル双方の見え方

## 前提

- フロントエンドは `app/` 配下。
- 商品データは `app/src/data/products.js`。
- Pico.css は最低限の根本スタイルとして残してよい。
- カード、レイアウト、商品一覧、AI 提案、Admin dashboard は自前 UI として扱う。
- バックエンド業務ロジックは薄いので、フロント表現を強めに入れてよい。
- アニメーション計画は `docs/tasks/backlog/アニメーション対策.md` を参照する。

## ツール: frontend-design プラグイン

デザインの方向づけ（配色・タイポ・レイアウト・「テンプレに見えない」判断）は、Claude Code の `frontend-design` プラグインに任せられる。新規 UI や見た目の作り直しのときに使う。

### 導入（1 回だけ / ユーザー単位）

```bash
# 1. マーケットプレイスを追加（claude-code-plugins を on disk 化。user settings に記録される）
claude plugin marketplace add anthropics/claude-code

# 2. プラグインを導入（scope: user）
claude plugin install frontend-design@claude-code-plugins
```

- **scope は user**。このリポジトリではなく実行ユーザーに紐づく。リポジトリには何もコミットされないため、別メンバーやクリーン環境では各自が上記を実行する。
- 導入済みかは `claude plugin list` で確認できる。

### 使い方

- Claude Code のセッション内で `/frontend-design`（スキル `frontend-design:frontend-design`）を起動する。設計プランを先に立て、テンプレ的な既定に寄っていないか自己批評してから実装するワークフローになっている。
- 対象は「見た目を決める」画面 — トップ、商品一覧、コンシェルジュ、Admin ダッシュボードなど。
- ブランド体系（配色トークン、Cormorant Garamond の見出し、余白コントラクト）は既に `app/src/index.css` に固まっている。全面リセットではなく、**既存トークンを活かした「仕上げ」**として使う。
- 生成後は必ず本 runbook の「検証」（build / lint / Playwright）と、デスクトップ 1440px・モバイル 390px の目視まで通す。UI 文言を変えたら E2E（`app/e2e/`）も同じ変更で追随させる。

## デプロイ先 URL

営業デモや目視確認は、以下の Cloudflare Pages 本番 URL を使う。

- 本番（安定 URL）: <https://lumiere-select.pages.dev>
- Admin dashboard: <https://lumiere-select.pages.dev/admin-demo>

デプロイ直後のプレビュー URL（`https://<hash>.lumiere-select.pages.dev` 形式）は毎回変わるため、正本は `env/config.yaml` の `deploy.pagesUrl` を参照する。最新デプロイのプレビュー URL は同ファイルの `deploy.latestDeployment` に入る。

## 評価基準

### Good

- 画面を見た瞬間に「AI 付きギフト EC」と分かる。
- 商品一覧が「読む画面」ではなく「選ぶ画面」になっている。
- コンシェルジュの相談 → thinking → 推薦の流れが自然。
- カート追加や checkout がページ遷移頼みではなく、状態変化として伝わる。
- Admin が単なるカード配置ではなく、店舗改善ダッシュボードとして読める。
- モバイルでヘッダー、カード、CTA が詰まらない。

### Bad

- 商品カードに説明文が多すぎる。
- 画像なしカードが大量に並び、プレースホルダー感が強い。
- CTA がテキストリンクだけで、行動が弱い。
- AI の結果が静的なカードリストに見える。
- Admin の見出しや文言が開発用のまま。
- テストが古い UI 文言を追って失敗している。

## 実行順序

### 1. 現状確認

```bash
cd app
npm run build
npm run lint
npx playwright test
```

失敗した場合は、まず以下に分類する。

| 分類 | 例 | 対応 |
|---|---|---|
| アプリ不具合 | ボタンを押しても遷移しない | 実装修正 |
| テスト期待値の古さ | UI 文言変更に追随していない | E2E 更新 |
| デザイン劣化 | モバイルでヘッダーが詰まる | CSS / レイアウト修正 |

### 2. スクリーンショット確認

デスクトップとモバイルを必ず見る。

```bash
cd app
npm run dev -- --host 0.0.0.0
```

確認対象:

- `/`
- `/products`
- `/products/skincare-001`
- `/concierge`
- `/cart`
- `/checkout`
- `/complete`
- `/orders`
- `/admin-demo`

見る観点:

- ファーストビューで価値が伝わるか
- CTA が自然に押せるか
- 商品画像と価格が主役になっているか
- AI 提案理由が必要な場面だけ出ているか
- 余白と文字サイズが画面ごとに揃っているか
- モバイルで横詰まり・文字潰れがないか

### 3. 商品一覧の再確認

商品一覧は EC 体験の中心なので、最優先で見る。

チェックリスト:

- 4列グリッドがデスクトップで成立している。
- モバイルは 2列または 1列で読みやすい。
- 商品名、価格、タグ、CTA の優先順位が明確。
- 説明文を出しすぎない。
- AI 理由は通常時に常時表示せず、AI リランキング後に出す。
- 「詳細」と「追加」が明確に分かれている。
- カート追加後にページ離脱しない。
- カートバッジが即時更新される。

改善優先度:

1. 画像なしカードの品質改善
2. モバイルカードの文字サイズ改善
3. CTA の押しやすさ改善
4. AI リランキング状態の見せ方改善

### 4. トップ画面の再確認

トップは「AI ギフト EC」としての第一印象を決める。

チェックリスト:

- ヒーローで AI 相談価値が一瞬で伝わる。
- 入力欄とチップがすぐ見える。
- ヒーロー下に次のセクションがあり、ページがそこで終わらない。
- 第2セクションが単なる説明カードになっていない。

改善案:

- 「AI ギフト EC が選ばれる理由」よりも、体験ステップに寄せる。
  - 相談する
  - AI が候補を絞る
  - そのまま買える
- ヒーロー右側の商品カードは画像品質を優先する。
- CTA は `AIに相談する` を主、`商品を見る` を副にする。

### 5. コンシェルジュ画面の再確認

コンシェルジュは主役機能。静的カードリストに見えないことが重要。

チェックリスト:

- 初期状態と回答後状態が分かれている。
- 初期状態で「AIが混み合っています」と表示しない。
- 送信後に thinking state がある。
- 推薦カードは 1枚ずつ理由付きで出るとよい。
- 推薦カードの画像は小さすぎない。
- 追加ボタンでカートに入ることが伝わる。
- 追加後のフィードバックがある。

改善優先度:

1. 初期状態の改善
2. thinking state
3. 推薦カードの見た目
4. カート追加 feedback

### 6. 購入フローの再確認

カート、checkout、complete はステップ UI として一貫させる。

チェックリスト:

- `Cart` / `Checkout` / `Complete` の開発用見出しを使わない。
- ステップインジケーターが自然。
- 次の行動が 1つに絞られている。
- checkout はデモ決済であることが明確。
- complete で注文番号、AI相談経由、推薦商品が見える。
- orders に注文が反映される。

E2E は現在の UI 文言に合わせる。

### 7. Admin dashboard の再確認

Admin は「店舗改善 AI デモ」に見えることが重要。

チェックリスト:

- アプリ内導線から `/admin-demo` に到達できる。
  - デスクトップでは Header に `店舗インサイト` などのリンクを出す。
  - モバイルではヘッダーが詰まる場合、リンクを隠してもよいが、営業デモ手順には URL を明記する。
- 見出しが `AdminDemo` のままになっていない。
- KPI は 3〜4 件で情報優先度が明確。
- AI 相談 → 購入率があると説明しやすい。
- ランキングに順位がある。
- 改善提案はタイトル、本文、次のアクションが分かれている。
- 空状態でも営業説明に耐える。

改善案:

- 見出しを `AI Store Dashboard` または `店舗インサイト` にする。
- 改善提案カードは番号、タイトル、本文、リンクを持つ。
- Inline style は CSS クラスへ移す。

## アニメーション導入手順

### Phase 1: Motion

```bash
cd app
npm install motion
```

導入対象:

- page reveal
- product card stagger
- concierge recommendation reveal
- cart add feedback
- checkout step transition
- admin KPI reveal

注意:

- `prefers-reduced-motion` を尊重する。
- アニメーションで操作を遅くしない。
- layout shift を起こさない。

### Phase 2: GSAP

GSAP は見せ場だけに使う。

候補:

- トップヒーロー
- AI が候補をスキャンしている演出
- Admin dashboard 初回ロード

全面採用したくなったら一度停止して判断する。

### Phase 3: View Transitions

候補:

- 商品一覧 → 商品詳細
- コンシェルジュ → 商品詳細
- カート → checkout → complete

未対応ブラウザでは通常遷移にフォールバックする。

## 検証

最低限:

```bash
cd app
npm run build
npm run lint
npx playwright test
```

目視:

- Desktop: 1440px 幅
- Mobile: 390px 幅
- `/products` のカード密度
- `/concierge` の初期状態と回答後状態
- `/admin-demo` の空状態とデータあり状態

## 完了条件

- 商品一覧が EC として選びやすい。
- トップがヒーローだけで終わらない。
- コンシェルジュが静的な結果表示に見えない。
- 購入フローが一貫したステップ UI になっている。
- Admin が店舗改善ダッシュボードとして見える。
- モバイルでヘッダーと商品カードが詰まらない。
- E2E が現在 UI 文言に追随している。
- build / lint / Playwright が通る。

## Stop / Ask Owner If

- 商品画像素材が足りず、プレースホルダーが品質の上限になる場合。
- GSAP を広範囲に入れたくなる場合。
- View Transitions の対応差で実装が複雑になりすぎる場合。
- アニメーションが操作性や可読性を下げる場合。
- 色やブランドトーンの大幅変更が必要になった場合。
