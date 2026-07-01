# fix-product-images: 商品画像36枚＋ショップ固定画像のローカル化

**Weight Class:** Standard

## Goal

商品画像（36枚）とショップ固定画像（ヒーロー・OGP 等）を
`data/images/` に格納し、Unsplash 外部 URL 依存をなくす。

## Value

integrity / dev speed（外部 URL 切断・ネット断でも画像が表示される）

## Context

現在 `app/src/data/products.js` は全商品の `imageUrl` を Unsplash 外部 URL で指定。
ネット環境や Unsplash の可用性に依存しており、デモ環境での安定表示に不安がある。
`data/` ディレクトリは空で、ローカル画像の置き場として確保済み。

ショップ画像は `app/src/assets/hero.png`（13 KB・未使用）のみが存在する。
ヒーローセクションは現在 CSS のみで構成されており、画像ファイルは参照されていない。

## Scope

- `data/images/products/` に商品画像 36 枚を配置
  - ファイル名: `skincare-001.webp` 〜 `mensgift-006.webp`（product ID に対応）
- `data/images/shop/` にショップ固定画像を配置
  - `hero.webp`（トップページヒーロー）
  - `ogp.webp`（OGP 用サムネイル、任意）
- `app/vite.config.js` の `publicDir` を `../data` に変更
  - フロントから `/images/products/skincare-001.webp` で参照可能にする
- `app/src/data/products.js` の `imageUrl` をローカルパスに更新
  - `img()` ヘルパーを廃止し、`/images/products/${id}.webp` 形式に統一
- ヒーロー画像を Top.jsx / CSS で参照する（shop/hero.webp）

## Non-scope

- 画像の品質評価・ABテスト
- 画像最適化 CDN の導入
- 商品データ（name / price / tags 等）の変更
- 既存 `app/src/assets/hero.png` の削除（使用確認後の別タスク）
- OGP メタタグの設定（別タスク）

## Plan

1. **画像生成・収集**（owner 作業 or AI 生成ツール利用）
   - 商品 36 枚: カテゴリ別に美容・ギフト系の画像を用意（480×480 WebP 推奨）
   - ヒーロー 1 枚: ショップのビジュアルイメージ（1200×630 以上 WebP 推奨）
   - OGP 1 枚（任意）: 1200×630 WebP

2. **ディレクトリ配置**
   ```
   data/
   └── images/
       ├── products/
       │   ├── skincare-001.webp
       │   ├── skincare-002.webp
       │   │   ... (36枚)
       │   └── mensgift-006.webp
       └── shop/
           ├── hero.webp
           └── ogp.webp
   ```

3. **Vite publicDir 変更** (`app/vite.config.js`)
   ```js
   export default defineConfig({
     plugins: [react()],
     publicDir: '../data',   // ← 追加
     define: { ... },
   })
   ```

4. **products.js 更新**
   - `const BASE / const Q / const img` を削除
   - 各商品の `imageUrl` を `/images/products/${id}.webp` に変更

5. **ヒーロー画像の組み込み**（Top.jsx or index.css）
   - `background-image: url('/images/shop/hero.webp')` or `<img src="/images/shop/hero.webp">`

6. **動作確認**: `make dev` でローカル表示、全商品画像・ヒーローが表示されること

## Acceptance Criteria

- [ ] `data/images/products/` に 36 ファイルが存在する
- [ ] `data/images/shop/hero.webp` が存在する
- [ ] `make dev` で全商品カード・詳細ページの画像がローカルから読み込まれる
- [ ] `make dev` でトップページのヒーロー画像が表示される
- [ ] ネットワークタブで Unsplash ドメインへのリクエストがゼロになる
- [ ] `products.js` に `unsplash` 文字列が残っていない

## Stop / Ask Owner If

- 画像生成ツール・素材ソースが決まっていない（AI 生成? Pexels/Pixabay 等フリー素材?）
- ヒーロー画像のビジュアルイメージ・雰囲気に確認が必要
- WebP 以外のフォーマット（JPEG / PNG）を希望する場合
- OGP 画像の要否

## 商品 ID 一覧（画像ファイル名の対応）

| カテゴリ | ID | 商品名 |
|---|---|---|
| スキンケア | skincare-001 | モイストバランス ローション |
| スキンケア | skincare-002 | クリアコンフォート ジェル |
| スキンケア | skincare-003 | ナイトリペア クリーム |
| スキンケア | skincare-004 | デイリーUV ミルク |
| スキンケア | skincare-005 | ソフトクレンズ バーム |
| スキンケア | skincare-006 | ミニマルケア セラム |
| ヘアケア | haircare-001 | シルキーリペア シャンプー |
| ヘアケア | haircare-002 | グロッシー トリートメント |
| ヘアケア | haircare-003 | スカルプクリア ブラシ |
| ヘアケア | haircare-004 | モーニング ヘアオイル |
| ヘアケア | haircare-005 | ナイトキャップ サテン |
| ヘアケア | haircare-006 | リフレッシュ ドライミスト |
| ボディケア | bodycare-001 | ハンドクリーム トリオ |
| ボディケア | bodycare-002 | ボディミルク ホワイトティー |
| ボディケア | bodycare-003 | シュガースクラブ ミニ |
| ボディケア | bodycare-004 | バスソルト リラックス |
| ボディケア | bodycare-005 | フットケア バーム |
| ボディケア | bodycare-006 | ボディケア ポーチセット |
| 香り・リラックス | relax-001 | ピローミスト ラベンダー |
| 香り・リラックス | relax-002 | アロマキャンドル シトラス |
| 香り・リラックス | relax-003 | リードディフューザー ホワイトムスク |
| 香り・リラックス | relax-004 | ハーブティー リラックス缶 |
| 香り・リラックス | relax-005 | アイピロー ウォーム |
| 香り・リラックス | relax-006 | ルームスプレー グリーン |
| ギフトセット | gift-001 | ビューティーギフト スターター |
| ギフトセット | gift-002 | ナイトケア ギフトボックス |
| ギフトセット | gift-003 | プチギフト アソート |
| ギフトセット | gift-004 | リラックスホーム セット |
| ギフトセット | gift-005 | トラベルケア キット |
| ギフトセット | gift-006 | プレミアム セルフケアボックス |
| メンズから贈るギフト | mensgift-001 | ファーストギフト ハンドケア |
| メンズから贈るギフト | mensgift-002 | 彼女向け リラックスセット |
| メンズから贈るギフト | mensgift-003 | 記念日 ビューティーボックス |
| メンズから贈るギフト | mensgift-004 | 予算内プチギフト セレクト |
| メンズから贈るギフト | mensgift-005 | 香り控えめ ケアセット |
| メンズから贈るギフト | mensgift-006 | 相談から選ぶ 定番ギフト |
