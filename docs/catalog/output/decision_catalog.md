review_status: adopted
id: decision_catalog_ai_ec_shop_sample_app
domain: web application (frontend with Supabase-backed AI functions)
confidence: high

# Decision Catalog

fact_source: non_llm_scan
evidence_run_id: 20260705T050205Z_14eead9e900b
machine_provenance: docs/catalog/evidence/evidence_index.jsonl

purpose: upper_model_input
catalog_id: decision_catalog_ai_ec_shop_sample_app
domain: web application (frontend with Supabase-backed AI functions)
high_end_ready: medium

## repo_topology

- kind: software_project
- core_files:
- runtime_surfaces:
  - CLI arguments
  - file_based_task_storage
- data_surfaces:
  - Store file read/write/remove/clear/flush

## coverage_map

- scan_included_files: 194
- topology_files: 0
- catalog_core_items: 10
- covered_as_core:
  - supabase/functions/concierge/index.ts
  - supabase/functions/recommend-products/index.ts
  - app/src/lib/supabase.js
  - app/src/lib/aiLimit.js
  - app/src/lib/cart.js
  - app/src/index.css
  - env:VITE_SUPABASE_URL / env:VITE_SUPABASE_ANON_KEY
  - app/src/pages/Concierge.jsx
  - app/src/pages/AdminDemo.jsx
- covered_as_appendix:
  - test_surface
- omitted_or_low_signal:
  - reason: generated/vendor/test fixture/low-signal or scan metadata only

## scan_summary

- profile: infra+web
- profile_resolution: requested=auto detected=css,html,infra,node,typescript profiles_run=infra+web language=infra+web
- scan_included_files: 194
- symbols: 577
- entrypoints: 3
- tests_detected: 3
- high_risk_ops_hits: 20
- no_hit_is_not_absence: true

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
- role: サーバレス AI コンシェルジュのバックエンド実装
- implications:
  - このファイルはバックエンドで動作する AI ベースの会話/推薦ロジックを提供するサーバレス関数実装である。
  - モデル選択や入力長、候補数などの設定を用いてリクエスト処理・正規化・ランキングを行う責務を持つことが示唆される。

### supabase/functions/recommend-products/index.ts  {subject_kind: file}
- role: サーバレス製品推薦 API
- implications:
  - 製品推薦用のサーバ側エンドポイントがあり、メインモデル応答が得られない場合のフォールバックランキングロジックを含んでいる可能性が高い。
  - クライアント側から推薦リクエストを受け、ランキングを返す役割を担っている。

### app/src/lib/supabase.js  {subject_kind: module}
- role: フロントエンドの Supabase エッジ関数クライアント
- implications:
  - このモジュールはフロントエンドから Supabase のエッジ関数（バックエンド）へアクセスするためのクライアント API 層として機能している。
  - 環境変数（VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY）を利用して外部 API に接続する責務を持つ。

### app/src/lib/aiLimit.js  {subject_kind: module}
- role: フロントエンド AI 利用制限ライブラリ
- implications:
  - フロントエンドにおいて AI 利用を日次で制限する仕組みが実装されており、超過時の専用エラークラスが用意されている。
  - AI を用いる UI 操作（例：コンシェルジュ呼び出し、推薦の再計算等）でレート制御やエラーハンドリングがこのモジュール経由で行われる想定である。

### app/src/lib/cart.js  {subject_kind: module}
- role: ブラウザ側カート/注文/AI コンテキスト永続化レイヤ
- implications:
  - このモジュールはブラウザ側でカート・注文・AI コンテキスト等を永続化・操作する責務を負っている。
  - 個々の UI 操作（追加、数量変更、削除、全消去）はこのモジュールの関数を通じてデータ効果（ローカル永続化の更新）を引き起こす。

### app/src/index.css  {subject_kind: file}
- role: デザイントークンと全体レイアウトを提供するスタイル定義
- implications:
  - この CSS ファイルはアプリ全体のデザイントークンとレイアウト・コンポーネントのスタイル定義を担っている。
  - 最近の変更シグナルはスタイル調整やレイアウト修正が進行中である可能性を示す（ただし変更の目的や影響範囲はこの証拠だけでは示されない）。

### env:VITE_SUPABASE_URL / env:VITE_SUPABASE_ANON_KEY  {subject_kind: env}
- role: フロントエンドと Supabase 接続のランタイム設定参照
- implications:
  - フロントエンドは Supabase へのランタイム接続設定を環境変数で受け取る設計である。
  - これらの環境変数はクライアントからバックエンドエンドポイント（エッジ関数等）へアクセスするために使われる参照情報であるが、requiredness は証拠上で確定していない。

### app/src/pages/Concierge.jsx  {subject_kind: file}
- role: ユーザ向けコンシェルジュ UI ページ
- implications:
  - フロントエンドにはユーザと会話するコンシェルジュ UI が実装されており、バックエンドのコンシェルジュ関数やクライアント API と連携する役割を持つ。
  - 最近の変更シグナルはこの UI/フローが開発・調整中である可能性を示すが、具体的な変更内容はこの証拠だけでは明示されない。

### app/src/pages/AdminDemo.jsx  {subject_kind: file}
- role: 管理者向け分析ダッシュボードページ
- implications:
  - このページは管理者向けに製品ギャップ検出やランキング集計などの分析的役割を提供するコンポーネントである。
  - 分析機能はフロントエンドでデータ集計やランキングのトリガーを行い、バックエンド API と連携することが想定される。

### test_surface  {subject_kind: test_surface}
- role: 限定的に存在するユニット/機能テストの表明
- implications:
  - AI 利用制限やコンシェルジュのコアロジックに対してユニット/機能テストが存在することを示唆する。
  - ただし全体のテストカバレッジや網羅性はスキャン情報だけでは評価できない。

## evidence_appendix

- pointer: docs/catalog/evidence/evidence_index.jsonl
- pointer: docs/catalog/evidence/current_run_id
