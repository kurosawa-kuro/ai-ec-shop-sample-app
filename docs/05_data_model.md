# 05 データモデル — 黒澤 Workbench

## 設定

| 種別 | 場所 | 内容 |
|---|---|---|
| 一般設定 | `env/config.yaml` | プロジェクト名・Supabase URL・AI 制限値 |
| ローカル秘密情報 | `app/.env.local`（.gitignore 済み） | Supabase ANON_KEY |
| 共有 / 本番クレデンシャル | Supabase Secrets | `DEEPSEEK_API_KEY`, `DEEPSEEK_MODEL`（ブラウザ非公開） |

## 永続化

| データ | 場所 | 補足 |
|---|---|---|
| エンジニアプロファイル | `app/src/data/engineer-profile.js`（固定 JS） | `engineerProfile` オブジェクト + `buildSystemPrompt()` |
| AI 相談履歴 | `localStorage['workbench-consultations']` | ConsultResult の JSON 配列。最大 50 件 |

## データ構造

### EngineerProfile（`app/src/data/engineer-profile.js`）

```js
{
  name:         "黒澤俊文",
  title:        "GCP AI 基盤専門家 / リーダー・技術コンサルタント",
  location:     "札幌（フルリモートのみ）",
  summary:      "...",
  strengths:    [{ area, strength: "high"|"medium", detail, keywords[] }],
  ngConditions: [{ condition, reason }],
  workStyle:    { remote, engagement[], notes },
  credentials:  ["..."]
}
```

### Inquiry（案件相談フォーム入力）

```js
{
  inquiry:       "Next.js と Supabase で予約管理アプリを作りたい",  // 必須
  stack:         "Next.js, Supabase",                               // 任意
  budget:        "30万円前後",                                       // 任意
  deadline:      "2週間",                                           // 任意
  existingCode:  "なし",                                            // 任意
  involvement:   "相談しながら"                                      // 任意
}
```

### ConsultResult（AI 相談結果、localStorage）

```js
{
  fit:            "high",        // "high" | "medium" | "low" | "ng"
  canHandle:      true,
  summary:        "対応可能です。React/Supabase 構成の MVP 開発として相性が良いです。",
  suggestedScope: ["要件整理", "UI実装", "DB設計"],
  risks:          ["2週間の場合、決済や複雑な管理画面は後回し推奨"],
  questions:      ["認証は必要ですか？", "管理者画面は必要ですか？"],
  draftInquiry:   "React と Supabase で予約管理 MVP を...",
  createdAt:      "2026-06-29T10:00:00Z"
}
```

## Edge Function I/O

詳細は `docs/02_architecture.md` の「Edge Function: consult-engineer」節を参照。

## 関連タスク

- schema・設定・永続化方式の変更は task に目的・移行手順・検証方法を残す。
