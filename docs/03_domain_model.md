# 03 ドメインモデル — 黒澤 Workbench

## 用語

| 用語 | 意味 |
|---|---|
| EngineerProfile | 黒澤のプロファイル。得意領域・NG条件・仕事スタイル・資格を持つ。`app/src/data/engineer-profile.js` |
| Strength | 得意領域の1エントリ。`{ area, strength: "high"｜"medium", detail, keywords[] }` |
| NgCondition | 対応外条件の1エントリ。`{ condition, reason }` |
| Inquiry | 案件相談の入力。`{ inquiry, stack, budget, deadline, existingCode, involvement }` |
| ConsultResult | AI 相談の結果。`{ fit, canHandle, summary, suggestedScope[], risks[], questions[], draftInquiry, createdAt }` |
| ConsultHistory | 過去の相談履歴。localStorage に保持する ConsultResult の配列 |

## 状態 / ライフサイクル

```text
Inquiry
  入力フォーム → 送信 → thinking state → consult-engineer Edge Function 呼び出し
    → ConsultResult 表示（fit / summary / suggestedScope / risks / questions / draftInquiry）
    → localStorage に ConsultHistory として保存
    （AI 障害時 → フォールバックメッセージを表示）

ConsultResult.fit の判定基準
  "high" — 主力スタック。スムーズに対応できる
  "medium" — 対応可能だが主軸ではない、スコープ確認が必要
  "low" — 対応可能だが苦手領域が多い、大幅なスコープ調整が必要
  "ng" — 常駐必須 / NG条件に該当、対応不可
```

## 制約

- DB なし。EngineerProfile は固定 JS。ConsultHistory はブラウザの localStorage のみ。
- 案件情報をサーバーサイドに保存しない。AI API に渡すのみ。
- フォールバック時は ConsultResult を生成せず、エラーメッセージのみ表示する。

## 関連タスク

- 用語・状態・ライフサイクルの変更は task に背景と影響範囲を残してから反映する。
- 未確定の業務ルールはこの文書へ入れず `docs/tasks/backlog/` で管理する。
