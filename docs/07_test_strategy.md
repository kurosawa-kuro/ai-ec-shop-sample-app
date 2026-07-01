# 07 テスト戦略

## 方針

Playwright E2E を品質ゲートとして使う。
CI は未導入だが、ローカルでは `build` / `lint` / `playwright test` を完了条件にする。
Motion / View Transitions は体感品質に直結するため、自動テストに加えて headed 実行で目視確認する。

## 品質ゲート

```bash
make build        # ビルドエラーがないことを確認
make lint         # oxlint
cd app && npx playwright test   # E2E 15件
```

`make test` は現時点では no-op のため、品質ゲートとして使わない。

## テスト範囲

| 範囲 | コマンド | 備考 |
|---|---|---|
| ルートスモーク | `cd app && npx playwright test app/e2e/routes.spec.js` | 9パスが開くことを確認 |
| 商品一覧 UI | `cd app && npx playwright test app/e2e/products-ui.spec.js` | 36件表示、カテゴリ絞り込み、トップ相談導線 |
| デモ主要導線 | `cd app && npx playwright test app/e2e/demo-flow.spec.js` | AIフォールバック、詳細→カート→注文完了→履歴、Admin集計 |
| アニメーション目視 | `make debug` | 商品画像からカートへの飛び演出、badge bounce、ranking reveal、View Transitions |
| AI 実接続 | `make debug` + 手動操作 | OpenAI → Supabase Edge Function → レスポンス |
| ユニットテスト | なし | カートなどは E2E と手動で担保。必要になれば `app/src/lib/*` から追加 |
| CI | なし | 今回は省略 |

## Playwright 設定

| 設定 | 値 | 理由 |
|---|---|---|
| `headless` | `false` | ブラウザを表示して目視確認 |
| `slowMo` | 300ms | 操作を遅らせて見やすくする |
| `screenshot` | `only-on-failure` | 失敗時のみ保存 |
| ブラウザ | Chromium のみ | 最速インストール |

```bash
make debug        # ブラウザを開いてスモークテスト実行
make debug-ui     # Playwright UI モード（インタラクティブデバッグ）
```

## アニメーション検証観点

- `MotionConfig reducedMotion="user"` と CSS の `prefers-reduced-motion` が効くこと
- 商品追加時の fly-to-cart が `.product-image` 起点に見えること
- 商品一覧の stagger が長すぎず、操作可能になるまで待たされないこと
- AI並べ替え時にカードの `layout` アニメーションが破綻しないこと
- View Transitions 未対応ブラウザでも通常の React Router 遷移ができること
- JS bundle warning はデモでは許容。ただし大きく増える場合は Motion-heavy 画面の lazy import を検討する

## エラー / フォールバック検証観点

- `recommend-products` 失敗時は通常検索順で表示を維持する
- `concierge` 失敗時は定番ギフト候補を表示する
- Supabase 環境変数未設定時もフロントが白画面にならない
- localStorage / sessionStorage 破損時は空状態へ戻せる

## タスク完了条件

各 task は、完了前に以下を `Verification` に残す。

- 実行したコマンドと結果の要約
- `make build` / `make lint` / `cd app && npx playwright test` の結果
- 目視した UI / アニメーション導線
- 実行できなかった検証と理由
- 残るリスク
