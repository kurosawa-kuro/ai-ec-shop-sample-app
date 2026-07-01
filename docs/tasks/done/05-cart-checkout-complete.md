# カート・注文確認・注文完了・注文履歴

## Goal

カートへの追加から注文完了・履歴表示までのフローを localStorage ベースで動かす。

## Value

「購入体験」のデモ完結。営業先に一通りの流れを見せられる。

## Scope

**カート `/cart`**
- 商品・数量・小計・削除
- 注文へ進むボタン

**注文確認 `/checkout`**（浅く作る）
- 名前・メール入力のみ
- 「デモ決済」ボタン

**注文完了 `/complete`**
- 注文番号（`DEMO-YYYYMMDD-XXX`）
- AI 相談経由フラグ（コンシェルジュ経由かどうか）
- 推薦商品名

**注文履歴 `/orders`**（浅く作る）
- localStorage から過去注文を一覧表示
- 注文日時・注文番号・商品・合計金額・AI 相談経由かどうか

## Non-scope

- 実決済・住所入力
- メール送信
- DB 保存

## Done

- 商品詳細 → カート追加 → checkout → complete → orders の流れが通る
- localStorage に注文データが保存され、orders 画面に表示される

## Evidence

目視確認（ブラウザの localStorage も確認）

## Stop / Ask Owner If

- 特になし
