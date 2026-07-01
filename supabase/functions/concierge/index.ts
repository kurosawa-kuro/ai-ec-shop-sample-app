import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const DEEPSEEK_API_KEY = Deno.env.get("DEEPSEEK_API_KEY") ?? ""
const DEEPSEEK_MODEL = Deno.env.get("DEEPSEEK_MODEL") ?? "deepseek-chat"
const MAX_QUERY_LENGTH = 200

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

// 固定フォールバック: AI障害時に返す定番候補
const FALLBACK_RESPONSE = {
  summary: "AIが混み合っています。定番ギフト候補を表示します。",
  recommendedProductIds: ["gift-001", "skincare-001", "relax-001"],
  reasons: [
    "人気の定番ギフトセットです",
    "失敗しにくい保湿スキンケアです",
    "香りが控えめで使いやすいです",
  ],
  followUpQuestion: null,
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS })
  }

  try {
    const { query, productIds } = await req.json()

    if (!query) {
      return json({ error: "query は必須です" }, 400)
    }

    const trimmedQuery = String(query).slice(0, MAX_QUERY_LENGTH)

    const systemPrompt = [
      "あなたは美容・ギフト ECショップの親切なAIコンシェルジュです。",
      "ユーザーの悩みや要望を聞いて、商品を3件提案してください。",
      "提案後に、より良い提案のための追加質問を1つ返してください。",
      "回答は以下のJSONのみ（他のテキスト不要）:",
      '{"summary":"提案の一言まとめ","recommendedProductIds":["id1","id2","id3"],"reasons":["id1の理由","id2の理由","id3の理由"],"followUpQuestion":"追加質問"}',
      "",
      "利用可能な商品IDの一例（実際の商品IDを使うこと）:",
      "skincare-001〜006, haircare-001〜006, bodycare-001〜006,",
      "relax-001〜006, gift-001〜006, mens-gift-001〜006",
      "",
      "注意: 効能・効果を断言しない。「使いやすい」「失敗しにくい」「ギフト感がある」などの表現を使う。",
    ].join("\n")

    const availableIds = productIds ?? []
    const userPrompt = availableIds.length > 0
      ? `相談: ${trimmedQuery}\n利用可能な商品ID: ${availableIds.join(", ")}`
      : `相談: ${trimmedQuery}`

    const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 512,
        temperature: 0.5,
      }),
    })

    if (!res.ok) {
      return json(FALLBACK_RESPONSE)
    }

    const data = await res.json()
    const content = data.choices?.[0]?.message?.content ?? ""
    return json(JSON.parse(content))
  } catch {
    return json(FALLBACK_RESPONSE)
  }
})

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  })
}
