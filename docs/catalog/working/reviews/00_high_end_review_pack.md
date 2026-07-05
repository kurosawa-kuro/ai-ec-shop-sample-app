# High-End Review Pack

Review this Decision Catalog Draft as a hard critic of catalog quality. Do not read the full repo; use only the model-facing draft content. Machine provenance stays in sidecars.

Mandatory review lenses:
- Is each meaning grounded in its paired fact and useful for high-end model judgment or new feature ideation?
- Are there important coverage holes in files, grep categories, entrypoints, env/config, dependencies, or change signals?
- Does each `meaning.role` match what the evidence shows the file or item is?
- Do `meaning.current_implication` entries stay descriptive and current-state only?
- Is inference or risk language leaking into `fact`?
- Is any advice, recommendation, next action, validation plan, rollback plan, or change boundary present?

## Draft Under Review

review_status: draft

id: decision_catalog_ai_ec_shop_sample_app
domain: web application (frontend with Supabase-backed AI functions)
confidence: high
confidence_policy: capped_to_high (freshness=fresh, catalog_items=10, distinct_evidence_artifacts=34)
evidence_freshness: high
coverage_confidence: high
meaning_quality: medium
high_end_ready: medium

# Decision Catalog (Draft)

fact_source: non_llm_scan
evidence_run_id: 20260705T050205Z_14eead9e900b
machine_provenance: docs/catalog/evidence/evidence_index.jsonl

## scan_summary

### static_signals_counts
- summary: 静的シグナル集計は job_lifecycle（39 ヒット）、env_secret（56 ヒット、パス赤字化）、high_risk_ops（20 ヒット）、auth_permission（123 ヒット）、infra_surface（12 ヒット）を報告している。これらは行レベルの grep シグナルであり、no-hit は不存在の証明ではない。

### file_tree_counts
- summary: リポジトリはフロントエンド（app/）と supabase 関数の構成を含み、E2E テストや画像資産、ドキュメントを備える単一ページアプリケーション形式である（ファイルツリーの要約）。

### manifest_and_extractor_notes
- summary: スキャンは infra+web プロファイルで実行され、抽出は heuristic ベースで行われた旨が記載されている（シンボル抽出は完全ではない可能性あり）。

## flow_items

### primary_concierge_interaction_candidate  {subject_kind: evidence_inferred_flow}
- id: primary_concierge_interaction_candidate
- flow_type: primary_candidate
- grounding_level: weak
- basis:
  - app/src/pages/Concierge.jsx
  - app/src/lib/supabase.js
  - supabase/functions/concierge/index.ts
  - app/src/lib/aiLimit.js
- steps:
  - order: 1
    user_intent: コンシェルジュへ質問や要望を送信して推奨やメッセージを取得する
    surface: candidate user message submission
    components: app/src/pages/Concierge.jsx
    data_effect: ユーザ入力（質問/要件）を受け取り、UI 上に送信イベントを発生させる
    confidence: weak
  - order: 2
    user_intent: クエリが外部 AI 利用枠に関する制約内で実行できるか確認する
    surface: candidate AI usage quota check
    components: app/src/lib/aiLimit.js
    data_effect: AI 利用回数の消費を試み、日次上限に達している場合はエラーを発生させる（AiLimitExceededError）
    confidence: medium
  - order: 3
    user_intent: バックエンドで生成された推薦やメッセージを取得する
    surface: candidate call to backend concierge function
    components: app/src/lib/supabase.js
    data_effect: バックエンドのコンシェルジュエンドポイントへリクエストを送り、応答を受け取る（recommend/concierge API 呼び出し）
    confidence: medium
  - order: 4
    user_intent: ユーザに対する最適な推薦やギフトメッセージを得る
    surface: server-side candidate normalization and ranking
    components: supabase/functions/concierge/index.ts
    data_effect: 入力正規化・候補生成・ランキング処理がサーバ側で実行され、最終的な推薦/メッセージレスポンスが生成される
    confidence: medium
  - order: 5
    user_intent: 推薦を確認し、選択商品を購入プロセスへ進める（カートへ追加）
    surface: candidate display of recommendations and optional add-to-cart
    components: app/src/pages/Concierge.jsx, app/src/lib/cart.js
    data_effect: 受け取った推薦を UI に表示し、ユーザが推薦をカートへ追加する操作を通じて cart モジュールが更新される可能性がある
    confidence: weak
- cannot_conclude:
  - クライアントからバックエンドへの実際の API 呼び出し順序や呼び出し条件は呼び出しグラフ/実行トレースがないため確定できない。
  - UI 表示・対話シーケンスがユーザ体験上の主要経路であるかは設計文書やトラフィック実測が無いため断定できない。

### clear_all_surface_candidate  {subject_kind: evidence_inferred_flow}
- id: clear_cart_surface_candidate
- flow_type: destructive_surface_candidate
- grounding_level: strong
- basis:
  - app/src/lib/cart.js
- steps:
  - order: 1
    user_intent: カート内の全アイテムを削除する意図を表明する
    surface: candidate clear operation (UI trigger)
    components: app/src/pages/Cart.jsx, app/src/components/Header.jsx
    data_effect: ユーザがカート画面やヘッダの操作で全消去の UI 操作を行う（候補）
    confidence: weak
  - order: 2
    user_intent: 全アイテムを永続ストアから削除してカートを空にする
    surface: candidate clear operation (implementation)
    components: app/src/lib/cart.js::clearCart
    data_effect: ローカル永続化（CART_KEY 等）をクリアし、カート状態を空にする（破壊的操作）
    confidence: strong
- cannot_conclude:
  - clearCart 関数が UI 上の単一アクション（例：ボタン）と直接紐づくかはコード呼び出し箇所の解析が必要である。
  - この操作がユーザ主導の明示的な全削除か、テスト/デバッグ用の内部ユーティリティかはこの証拠だけでは判定できない。

## catalog_items

### supabase/functions/concierge/index.ts  {subject_kind: file}
- 事実: supabase/functions/concierge/index.ts に会話型コンシェルジュ用のサーバレス関数群（例：generateGiftMessage、rankRecommendations、normalizeCandidates 等）が定義されている。環境変数として DeepSeek モデル名や最大クエリ長、候補数などの設定が参照される形跡がある。
- 意味あい:
  - 役割: サーバレス AI コンシェルジュのバックエンド実装
  - 含意: このファイルはバックエンドで動作する AI ベースの会話/推薦ロジックを提供するサーバレス関数実装である。
  - 含意: モデル選択や入力長、候補数などの設定を用いてリクエスト処理・正規化・ランキングを行う責務を持つことが示唆される。
  - confidence: high

### supabase/functions/recommend-products/index.ts  {subject_kind: file}
- 事実: supabase/functions/recommend-products/index.ts に製品推薦を提供するサーバレス関数（fallbackRanking 等）が存在する。
- 意味あい:
  - 役割: サーバレス製品推薦 API
  - 含意: 製品推薦用のサーバ側エンドポイントがあり、メインモデル応答が得られない場合のフォールバックランキングロジックを含んでいる可能性が高い。
  - 含意: クライアント側から推薦リクエストを受け、ランキングを返す役割を担っている。
  - confidence: high

### app/src/lib/supabase.js  {subject_kind: module}
- 事実: app/src/lib/supabase.js に recommendProducts、askConcierge、generateGiftMessage などのクライアント側 API ラッパー関数が存在し、VITE_SUPABASE_URL と VITE_SUPABASE_ANON_KEY を参照している。
- 意味あい:
  - 役割: フロントエンドの Supabase エッジ関数クライアント
  - 含意: このモジュールはフロントエンドから Supabase のエッジ関数（バックエンド）へアクセスするためのクライアント API 層として機能している。
  - 含意: 環境変数（VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY）を利用して外部 API に接続する責務を持つ。
  - confidence: high

### app/src/lib/aiLimit.js  {subject_kind: module}
- 事実: app/src/lib/aiLimit.js に AiLimitExceededError クラスと消費関数（consumeAiLimit）、日次利用取得関数（getAiDailyLimit）など AI 利用制限を扱う実装が存在する。
- 意味あい:
  - 役割: フロントエンド AI 利用制限ライブラリ
  - 含意: フロントエンドにおいて AI 利用を日次で制限する仕組みが実装されており、超過時の専用エラークラスが用意されている。
  - 含意: AI を用いる UI 操作（例：コンシェルジュ呼び出し、推薦の再計算等）でレート制御やエラーハンドリングがこのモジュール経由で行われる想定である。
  - confidence: high

### app/src/lib/cart.js  {subject_kind: module}
- 事実: app/src/lib/cart.js にローカルストレージ操作用のキー定数（CART_KEY, ORDERS_KEY, AI_CONTEXT_KEY 等）とカート操作関数（getCart、saveCart、addToCart、updateCartQuantity、removeFromCart、clearCart 等）が定義されている。
- 意味あい:
  - 役割: ブラウザ側カート/注文/AI コンテキスト永続化レイヤ
  - 含意: このモジュールはブラウザ側でカート・注文・AI コンテキスト等を永続化・操作する責務を負っている。
  - 含意: 個々の UI 操作（追加、数量変更、削除、全消去）はこのモジュールの関数を通じてデータ効果（ローカル永続化の更新）を引き起こす。
  - confidence: high

### app/src/index.css  {subject_kind: file}
- 事実: app/src/index.css に多数のカスタムプロパティ（--bg, --surface, --ink, --space-1..-8, --tap-min 等）やコンポーネント用セレクタ（.hero-section, .product-card, .cart-line, .checkout-layout, .chat-panel 等）が定義されている。scan はこのファイルに対する最近の変更シグナルを報告している。
- 意味あい:
  - 役割: デザイントークンと全体レイアウトを提供するスタイル定義
  - 含意: この CSS ファイルはアプリ全体のデザイントークンとレイアウト・コンポーネントのスタイル定義を担っている。
  - 含意: 最近の変更シグナルはスタイル調整やレイアウト修正が進行中である可能性を示す（ただし変更の目的や影響範囲はこの証拠だけでは示されない）。
  - confidence: high

### env:VITE_SUPABASE_URL / env:VITE_SUPABASE_ANON_KEY  {subject_kind: env}
- 事実: 環境変数 VITE_SUPABASE_URL と VITE_SUPABASE_ANON_KEY がコード内で参照されている（app/src/lib/supabase.js にて）。値は redacted として報告されているが、必須/任意の区別は未確定である。
- 意味あい:
  - 役割: フロントエンドと Supabase 接続のランタイム設定参照
  - 含意: フロントエンドは Supabase へのランタイム接続設定を環境変数で受け取る設計である。
  - 含意: これらの環境変数はクライアントからバックエンドエンドポイント（エッジ関数等）へアクセスするために使われる参照情報であるが、requiredness は証拠上で確定していない。
  - confidence: medium

### app/src/pages/Concierge.jsx  {subject_kind: file}
- 事実: app/src/pages/Concierge.jsx にコンシェルジュ UI 用のページコンポーネント（concierge 等）と関連ユーティリティ（normalizeRecommendation 等）が存在し、変更シグナルが観測されている。
- 意味あい:
  - 役割: ユーザ向けコンシェルジュ UI ページ
  - 含意: フロントエンドにはユーザと会話するコンシェルジュ UI が実装されており、バックエンドのコンシェルジュ関数やクライアント API と連携する役割を持つ。
  - 含意: 最近の変更シグナルはこの UI/フローが開発・調整中である可能性を示すが、具体的な変更内容はこの証拠だけでは明示されない。
  - confidence: high

### app/src/pages/AdminDemo.jsx  {subject_kind: file}
- 事実: app/src/pages/AdminDemo.jsx に管理者向けの分析機能（rankConsultationTopics、rankProducts、detectProductGaps、countMatchingProducts 等）を提供するページが存在する。
- 意味あい:
  - 役割: 管理者向け分析ダッシュボードページ
  - 含意: このページは管理者向けに製品ギャップ検出やランキング集計などの分析的役割を提供するコンポーネントである。
  - 含意: 分析機能はフロントエンドでデータ集計やランキングのトリガーを行い、バックエンド API と連携することが想定される。
  - confidence: medium

### test_surface  {subject_kind: test_surface}
- 事実: テスト証跡に aiLimit.js の関数（consumeAiLimit, getAiDailyLimit）と supabase/functions/concierge/index.ts に関連するテストが含まれる（test_count=3 全体）。
- 意味あい:
  - 役割: 限定的に存在するユニット/機能テストの表明
  - 含意: AI 利用制限やコンシェルジュのコアロジックに対してユニット/機能テストが存在することを示唆する。
  - 含意: ただし全体のテストカバレッジや網羅性はスキャン情報だけでは評価できない。
  - confidence: medium

## evidence_appendix

### scan_manifest_metrics
- summary: スキャンは infra+web プロファイルで実行され、194 ファイル・577 シンボル・テスト数 3・エントリポイント数 3 を検出している。抽出は行ベースのヒューリスティックである旨が注記されている。

### parser_and_search_limitations
- summary: シンボル抽出は行ベースのヒューリスティックであり、動的生成やマクロ生成は取りこぼす可能性がある。grep no-hit は不存在の証明ではないことが明記されている。

### static_signal_summary
- summary: 静的シグナル集計として job_lifecycle（39 ヒット）、env_secret（56 ヒット、パスは redacted）、high_risk_ops（20 ヒット）、auth_permission（123 ヒット）、infra_surface（12 ヒット）などが報告されている。これらはさらなる行のレビューを要求する観測信号であり、単独での決定は不十分である。

### file_tree_overview
- summary: リポジトリには app/ と supabase/functions/ 以下のファイル群（フロントエンド SPA とサーバレス関数）、および env 設定ファイルと E2E テスト、画像資産などが含まれていることが記載されている。

### env_inventory_and_redaction
- summary: VITE_SUPABASE_URL と VITE_SUPABASE_ANON_KEY が参照されていると記録されており、値は redacted されている。requiredness やデフォルト値は不明である旨が示されている。

### symbols_index_summary
- summary: シンボルインデックスにより、主要な React ページコンポーネント、UI コンポーネント、ユーティリティ（cart, aiLimit, supabase クライアント等）および supabase 関数の公開シンボルが列挙されている。
