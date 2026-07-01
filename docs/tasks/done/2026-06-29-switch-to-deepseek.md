# switch-to-deepseek: OpenAI → DeepSeek 切り替え

**Weight Class:** Heavy  
**Owner Approval Required:** yes（Secret 操作・paid API 変更・本番 deploy）

## Goal

Supabase Edge Function 2 本（`concierge`・`recommend-products`）の AI 呼び出しを
OpenAI から DeepSeek に切り替え、コストを削減する。

## Value

cost / dev speed

## Scope

- `supabase/functions/concierge/index.ts` — API URL・env var 参照を DeepSeek 向けに変更
- `supabase/functions/recommend-products/index.ts` — 同上
- `docs/01_requirements.md` の制約欄（OpenAI 表記）を更新
- Supabase Secret 設定手順をこのタスクノートに記録（実行は owner）

## Non-scope

- フロント側コード（Edge Function のインタフェースは変わらない）
- モデルの評価・品質比較（デモ用途のため省略）
- フォールバック動作の変更

## Risk

| リスク | 対策 |
|---|---|
| DeepSeek API の JSON 応答フォーマットが OpenAI と微妙に異なる | レスポンス解析は同じ `choices[0].message.content` パスなので互換。フォールバックが既存にある |
| Secret を間違えると全 AI 機能がフォールバックになる | 既存フォールバック動作で UI は壊れない。Secret を戻せば即復旧 |
| DeepSeek の可用性低下 | フォールバックが既にある。OpenAI より可用性が低い場合は元に戻す |

## Change Condition

コード変更前に owner の承認を得ること。

## Done Condition

- [ ] 両 Edge Function のコードが DeepSeek API を向いている
- [ ] ローカルで `deno check` が通る
- [ ] Supabase deploy 後、コンシェルジュ・リランキングが実際に応答を返す（E2E 確認）
- [ ] `docs/01_requirements.md` の OpenAI 表記が更新されている

## Owner-only Decisions

1. **env var の命名**: `DEEPSEEK_API_KEY` / `DEEPSEEK_MODEL` に rename するか、プロバイダー非依存の `AI_API_KEY` / `AI_MODEL` にするか
2. **Secret ローテーション**: 旧 `OPENAI_API_KEY` Secret を残すか削除するか
3. **デフォルトモデル**: `deepseek-chat`（V3）でよいか

## Capability Boundary

- Secret 読み書き: Supabase Dashboard / CLI で owner が実行
- Edge Function deploy: `supabase functions deploy` — owner が実行または承認

## Allowed Paths

- `supabase/functions/concierge/index.ts`
- `supabase/functions/recommend-products/index.ts`
- `docs/01_requirements.md`

## Forbidden Paths

- `app/` 以下（フロントは変更不要）
- `supabase/config.toml`
- `env/` 以下
- `.claude/` 以下

## Rollback Trigger

- DeepSeek deploy 後に E2E が通らない場合 → 即停止し owner へ報告
- Secret 設定後に HTTP 401/403 が返る場合 → 旧 OpenAI Secret に戻す

## Evidence Required

Level 4:
1. `deno check` パス（両 Function）
2. ローカル `curl` テスト or Supabase Dashboard の Function logs で 200 応答確認
3. E2E（Playwright）で UC-003 / UC-005 が通る
4. `docs/01_requirements.md` の表記更新を diff で確認
