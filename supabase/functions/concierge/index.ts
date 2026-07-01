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
  recommendations: [
    {
      productId: "gift-001",
      reason: "複数アイテム入りで見栄えがよく、好みが分からない相手にも贈りやすいです。",
      easyToGive: "箱を開けた時のギフト感があり、誕生日やお礼の場面でもきちんと選んだ印象を作れます。",
      caution: "香りや使用感に敏感な方には、セット内容を事前に確認すると安心です。",
      fitFor: "相手の好みがまだ詳しく分からない時や、見栄えを重視したい相手に合います。",
    },
    {
      productId: "skincare-001",
      reason: "軽い使い心地で初めてのスキンケアギフトにも選びやすいです。",
      easyToGive: "日常使いしやすい保湿ケアなので、特別すぎず気遣いとして渡しやすいです。",
      caution: "肌に合うかは個人差があるため、敏感肌の方には成分や使い方を確認すると安心です。",
      fitFor: "美容初心者や、シンプルなケアを好む相手に合います。",
    },
    {
      productId: "relax-001",
      reason: "美容品ほど好みを選ばず、休息を気遣うギフトとして渡しやすいです。",
      easyToGive: "相手を労わる気持ちが伝わりやすく、関係性が浅くても重くなりにくいです。",
      caution: "香りに敏感な方には、無香料・控えめタイプを確認すると安心です。",
      fitFor: "仕事や日常で疲れがたまりやすい相手、リラックス時間を大切にする相手に合います。",
    },
  ],
  reasons: [
    "複数アイテム入りで見栄えがよく、好みが分からない相手にも贈りやすいです。",
    "軽い使い心地で初めてのスキンケアギフトにも選びやすいです。",
    "美容品ほど好みを選ばず、休息を気遣うギフトとして渡しやすいです。",
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
      "各商品は必ず productId と理由の4観点を1セットにして返してください。productId と理由を別配列で分けないでください。",
      "reason はおすすめ理由、easyToGive は渡しやすいポイント、caution は注意したい点、fitFor は合いそうな相手条件です。",
      "提案後に、より良い提案のための追加質問を1つ返してください。",
      "回答は以下のJSONのみ（他のテキスト不要）:",
      '{"summary":"提案の一言まとめ","recommendations":[{"productId":"id1","reason":"おすすめ理由","easyToGive":"渡しやすいポイント","caution":"注意したい点","fitFor":"合いそうな相手条件"},{"productId":"id2","reason":"おすすめ理由","easyToGive":"渡しやすいポイント","caution":"注意したい点","fitFor":"合いそうな相手条件"},{"productId":"id3","reason":"おすすめ理由","easyToGive":"渡しやすいポイント","caution":"注意したい点","fitFor":"合いそうな相手条件"}],"recommendedProductIds":["id1","id2","id3"],"followUpQuestion":"追加質問"}',
      "",
      "利用可能な商品IDの一例（実際の商品IDを使うこと）:",
      "skincare-001〜006, haircare-001〜006, bodycare-001〜006,",
      "relax-001〜006, gift-001〜006, mens-gift-001〜006",
      "",
      "注意: 効能・効果を断言しない。「使いやすい」「選びやすい」「ギフト感がある」「確認すると安心」などの表現を使う。",
      "caution は不安を煽らず、香り・色味・成分・相手の好みなど確認ポイントとして書いてください。",
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
        max_tokens: 900,
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
