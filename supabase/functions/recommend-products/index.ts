import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const DEEPSEEK_API_KEY = Deno.env.get("DEEPSEEK_API_KEY") ?? ""
const DEEPSEEK_MODEL = Deno.env.get("DEEPSEEK_MODEL") ?? "deepseek-chat"
const MAX_QUERY_LENGTH = 200
const MAX_CANDIDATES = 15

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS })
  }

  try {
    const { query, candidates } = await req.json()

    if (!query || !Array.isArray(candidates)) {
      return json({ error: "query と candidates は必須です" }, 400)
    }

    const trimmedQuery = String(query).slice(0, MAX_QUERY_LENGTH)
    const limited = candidates.slice(0, MAX_CANDIDATES)

    const candidateText = limited
      .map((p: { id: string; name: string; price: number; tags: string[] }) =>
        `id:${p.id} name:${p.name} price:${p.price}円 tags:${(p.tags ?? []).join(",")}`
      )
      .join("\n")

    const systemPrompt = [
      "あなたは美容・ギフト EC のAIアシスタントです。",
      "ユーザーの相談文に合う候補商品を関連度順に並べ、各商品に短い理由を付けてください。",
      "回答は以下のJSONのみ（他のテキスト不要）:",
      '{"message":"並べ替えの一言説明（30字以内）","rankedProductIds":["id1","id2"],"reasons":{"id1":"理由（20字以内）"}}',
    ].join("\n")

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
          { role: "user", content: `相談: ${trimmedQuery}\n\n候補商品:\n${candidateText}` },
        ],
        max_tokens: 512,
        temperature: 0.3,
      }),
    })

    if (!res.ok) {
      return json(fallbackRanking(limited, "AIが混み合っています。通常順で表示します。"))
    }

    const data = await res.json()
    const content = data.choices?.[0]?.message?.content ?? ""
    return json(JSON.parse(content))
  } catch {
    return json(fallbackRanking([], "AIが混み合っています。通常順で表示します。"))
  }
})

function fallbackRanking(candidates: { id: string }[], message: string) {
  return { message, rankedProductIds: candidates.map((c) => c.id), reasons: {} }
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  })
}
