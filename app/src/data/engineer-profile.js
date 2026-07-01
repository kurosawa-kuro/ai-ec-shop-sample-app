/**
 * 黒澤俊文 — エンジニアプロファイル
 * consult-engineer Edge Function の AI プロンプトに埋め込むデータ。
 * 得意領域・NG条件・仕事スタイルを構造化し、AI が fit 判定・スコープ提案を行う根拠にする。
 */

export const engineerProfile = {
  name: "黒澤俊文",
  title: "GCP AI 基盤専門家 / リーダー・技術コンサルタント",
  location: "札幌（フルリモートのみ）",
  experience: "10年超（要件定義〜実装〜運用まで一人称で完遂）",

  /** 一言キャッチ — サイトの AI 相談 UI にも表示 */
  summary:
    "GCP AI 基盤（Vertex AI Pipelines / Vertex Vector Search / BigQuery）を軸に、" +
    "問題定義・ヒアリング・要件整理・PoC・スライド・プレゼンまで上流から一気通貫で担えるリーダー兼コンサルタント。",

  /**
   * 得意領域 — fit 判定の主軸
   * strength: "high" | "medium"
   */
  strengths: [
    {
      area: "GCP AI 基盤整備",
      strength: "high",
      detail:
        "Vertex AI Pipelines / Vertex Vector Search / Vertex AI Feature Store / BigQuery / Dataform / Cloud Run。" +
        "学習〜サービング〜監視〜自動再学習ループを一人で設計・構築できる。",
      keywords: ["Vertex AI", "BigQuery", "GCP", "MLOps", "ML パイプライン", "特徴量管理", "再学習"],
    },
    {
      area: "上流コンサルティング",
      strength: "high",
      detail:
        "ヒアリング・問題定義・要件整理・PoC 設計・サンプルコード実装・スライド作成・プレゼンまで主導。" +
        "技術者と経営層の両方に伝わる資料を作れる。",
      keywords: ["要件定義", "ヒアリング", "PoC", "スライド", "プレゼン", "コンサル", "提案", "上流"],
    },
    {
      area: "MLOps・ML 基盤",
      strength: "high",
      detail:
        "LightGBM (LambdaRank 含む) / scikit-learn / ONNX / MLflow / Airflow / Kubeflow / KServe。" +
        "モデル CI・自動再学習・推論 API サービングまでカバー。",
      keywords: ["LightGBM", "GBDT", "機械学習", "モデルサービング", "推論 API", "再学習", "実験管理"],
    },
    {
      area: "検索基盤・ランキング",
      strength: "high",
      detail:
        "Elasticsearch (BM25 / analyzer) + multilingual-e5 によるベクトル検索 + LightGBM LambdaRank の二段構成検索基盤の設計・実装経験あり。",
      keywords: ["Elasticsearch", "ベクトル検索", "RAG 基盤", "検索改善", "リランキング", "Vertex Vector Search"],
    },
    {
      area: "バックエンド・API 開発",
      strength: "high",
      detail:
        "Python (FastAPI / Pydantic) / Go (Gin) / TypeScript (NestJS / Express) / Java (Spring Boot)。" +
        "本番 API・マイクロサービス・BFF の実装経験豊富。",
      keywords: ["FastAPI", "Go", "TypeScript", "NestJS", "Spring Boot", "REST API", "マイクロサービス"],
    },
    {
      area: "インフラ・IaC・DevOps",
      strength: "high",
      detail:
        "Terraform (GCP / AWS) / Kubernetes (EKS / kind) / Helm / Argo CD / GitHub Actions (WIF)。" +
        "PoC から本番まで同一マニフェストで昇格できる構成を設計できる。",
      keywords: ["Terraform", "Kubernetes", "IaC", "CI/CD", "DevOps", "EKS", "Cloud Run", "インフラ自動化"],
    },
    {
      area: "フロントエンド",
      strength: "medium",
      detail:
        "Next.js / React / TypeScript / Tailwind CSS。" +
        "フルスタック案件でフロントを担当した実績あり。専業フロントエンドよりもバックエンド・インフラとの一体型で強みが出る。",
      keywords: ["Next.js", "React", "TypeScript", "フルスタック", "SPA", "SSR"],
    },
    {
      area: "データ基盤・DWH",
      strength: "medium",
      detail:
        "BigQuery / Dataform / Snowflake / Redshift / dbt / Airflow / Elasticsearch。" +
        "特徴量マートや分析基盤の設計・実装経験あり。",
      keywords: ["BigQuery", "Snowflake", "dbt", "データ基盤", "DWH", "データパイプライン", "ELT"],
    },
    {
      area: "生成 AI 活用指導・チーム展開",
      strength: "medium",
      detail:
        "GitHub Copilot を活用した AI プログラミング指導、動画によるノウハウ伝授、開発ハーネス整備のチーム展開経験あり。",
      keywords: ["GitHub Copilot", "生成 AI 活用", "AI 研修", "チーム指導", "ナレッジ共有", "生産性向上"],
    },
    {
      area: "ブロックチェーン",
      strength: "medium",
      detail:
        "Solidity / Hyperledger Fabric 。テックリードとして設計・実装した経験あり。" +
        "常時対応ではないが要件に応じて対応可能。",
      keywords: ["Solidity", "Hyperledger Fabric", "ブロックチェーン", "スマートコントラクト"],
    },
  ],

  /**
   * NG 条件・対応外 — fit: "ng" を返す根拠
   */
  ngConditions: [
    {
      condition: "常駐・出社必須",
      reason: "フルリモートのみ対応。札幌在住のため出社不可。",
    },
    {
      condition: "DL モデル本体のチューニング・研究専業",
      reason:
        "LightGBM / GBDT が中心。PyTorch / TensorFlow の周辺インフラ・パイプラインは対応可能だが、" +
        "モデルアーキテクチャの研究・論文実装専業の案件は対象外。",
    },
    {
      condition: "デザイン専業・UI/UX デザイン",
      reason: "フロント実装は可能だが、ビジュアルデザイン・UIデザイン専業の案件は対象外。",
    },
    {
      condition: "実決済・個人情報の本番管理",
      reason:
        "実決済（Stripe 本番統合など）や個人情報管理の本番運用は対象外。PoC・デモ・設計レビューは対応可。",
    },
    {
      condition: "薬機法対応の医療・美容効能表現",
      reason: "薬機法に抵触するコンテンツ・表現を含む実装は対応外。",
    },
  ],

  /**
   * 仕事スタイル・関わり方
   */
  workStyle: {
    remote: "フルリモートのみ",
    engagement: [
      "要件定義〜PoC〜スライド〜実装〜デプロイの一気通貫",
      "上流（ヒアリング・要件整理・技術提案）のみ",
      "実装支援（既存チームのレビュー・設計相談）",
      "MLOps 基盤整備のチームリーダー",
    ],
    notes:
      "複雑な権限管理・認証システム・大規模決済が含まれる場合はスコープ調整が必要。" +
      "PoC 段階からの参画が最も価値を発揮しやすい。",
  },

  /**
   * 資格・実績（AI が根拠として参照する）
   */
  credentials: [
    "AWS Solutions Architect Associate（取得済）",
    "OSS-DB Silver（取得済）",
    "GCP Professional ML Engineer（学習中・直近取得予定）",
    "CAPM（取得予定）",
    "Qiita 技術記事 100 本超",
    "大手製造業向け GCP MLOps 基盤整備チームリーダー（2026〜現在）",
    "大手 SIer・某省庁向けブロックチェーントレーサビリティ PoC（2025）",
  ],
};

/**
 * AI プロンプトへの埋め込み用テキスト生成
 * consult-engineer Edge Function の system prompt に挿入する。
 */
export function buildSystemPrompt() {
  const strengths = engineerProfile.strengths
    .map((s) => `- ${s.area}（得意度: ${s.strength === "high" ? "高" : "中"}）: ${s.detail}`)
    .join("\n");

  const ng = engineerProfile.ngConditions
    .map((n) => `- ${n.condition}: ${n.reason}`)
    .join("\n");

  return `あなたは「${engineerProfile.name}」の案件マッチング AI です。
訪問者から案件の概要を受け取り、黒澤が対応できるかを判定して JSON で返してください。

## 黒澤俊文のプロファイル

${engineerProfile.summary}

### 得意領域
${strengths}

### 対応外（NG）条件
${ng}

### 仕事スタイル
- 勤務形態: ${engineerProfile.workStyle.remote}
- 関わり方: ${engineerProfile.workStyle.engagement.join(" / ")}
- 補足: ${engineerProfile.workStyle.notes}

## 返答形式

以下の JSON のみを返してください。説明文は JSON の各フィールドに含めてください。

{
  "fit": "high | medium | low | ng",
  "canHandle": true または false,
  "summary": "1〜2文で対応可否と理由を説明",
  "suggestedScope": ["作業項目1", "作業項目2", ...],
  "risks": ["リスク・注意点1", ...],
  "questions": ["確認したい質問1", ...],
  "draftInquiry": "訪問者がそのままコピーして送れる問い合わせ文"
}

fit の基準:
- high: 主力スタックで経験豊富、スムーズに対応できる
- medium: 対応可能だが主軸ではない、スコープ確認が必要
- low: 対応可能だが苦手領域が多い、大幅なスコープ調整が必要
- ng: 常駐必須 / フルリモート不可 / NG条件に該当、対応不可`;
}
