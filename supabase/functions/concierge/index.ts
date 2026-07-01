import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const DEEPSEEK_API_KEY = Deno.env.get("DEEPSEEK_API_KEY") ?? ""
const DEEPSEEK_MODEL = Deno.env.get("DEEPSEEK_MODEL") ?? "deepseek-chat"
const MAX_QUERY_LENGTH = 200
const MAX_CANDIDATES = 40
const FALLBACK_GIFT_MESSAGE = "最近忙しそうだったので、少しでもほっとできる時間になればと思って選びました。"

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
    const { mode, query, productIds, candidates, productNames } = await req.json()

    if (mode === "gift-message") {
      return json(await generateGiftMessage(query, productNames))
    }

    if (!query) {
      return json({ error: "query は必須です" }, 400)
    }

    const trimmedQuery = String(query).slice(0, MAX_QUERY_LENGTH)
    const catalog = normalizeCandidates(candidates, productIds)

    const systemPrompt = [
      "あなたは美容・ギフト ECショップの親切なAIコンシェルジュです。",
      "ユーザーの悩みや要望を聞いて、商品を3件提案してください。",
      "必ずユーザーから渡された候補カタログの中の商品IDだけを選んでください。",
      "商品名・カテゴリ・価格・tags・giftFor・description を根拠にし、IDの文字列だけから推測しないでください。",
      "例: 「肌が弱い」「敏感」には tags の「敏感肌向け」「低刺激感」「香り控えめ」を優先してください。",
      "各商品は必ず productId と理由の4観点を1セットにして返してください。productId と理由を別配列で分けないでください。",
      "reason はおすすめ理由、easyToGive は渡しやすいポイント、caution は注意したい点、fitFor は合いそうな相手条件です。",
      "提案後に、より良い提案のための追加質問を1つ返してください。",
      "回答は以下のJSONのみ（他のテキスト不要）:",
      '{"summary":"提案の一言まとめ","recommendations":[{"productId":"id1","reason":"おすすめ理由","easyToGive":"渡しやすいポイント","caution":"注意したい点","fitFor":"合いそうな相手条件"},{"productId":"id2","reason":"おすすめ理由","easyToGive":"渡しやすいポイント","caution":"注意したい点","fitFor":"合いそうな相手条件"},{"productId":"id3","reason":"おすすめ理由","easyToGive":"渡しやすいポイント","caution":"注意したい点","fitFor":"合いそうな相手条件"}],"recommendedProductIds":["id1","id2","id3"],"followUpQuestion":"追加質問"}',
      "",
      "利用可能な商品IDの一例（実際の商品IDを使うこと）:",
      "skincare-001〜006, haircare-001〜006, bodycare-001〜006,",
      "relax-001〜006, gift-001〜006, mensgift-001〜006",
      "",
      "注意: 効能・効果を断言しない。「使いやすい」「選びやすい」「ギフト感がある」「確認すると安心」などの表現を使う。",
      "caution は不安を煽らず、香り・色味・成分・相手の好みなど確認ポイントとして書いてください。",
    ].join("\n")

    const userPrompt = catalog.length > 0
      ? `相談: ${trimmedQuery}\n候補カタログJSON: ${JSON.stringify(catalog)}`
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
    return json(normalizeModelResponse(JSON.parse(content), catalog, trimmedQuery))
  } catch {
    return json(FALLBACK_RESPONSE)
  }
})

async function generateGiftMessage(query: unknown, productNames: unknown) {
  try {
    const trimmedQuery = typeof query === "string" ? query.slice(0, 220) : ""
    const names = Array.isArray(productNames)
      ? productNames.filter((name) => typeof name === "string").slice(0, 3)
      : []

    const systemPrompt = [
      "あなたは美容・ギフト EC の添え書き作成アシスタントです。",
      "購入者がギフトに添えられる自然な一言を日本語で1文だけ作ってください。",
      "40〜70字程度。親しみはあるが重すぎない文体。",
      "効能効果や肌改善を断言しない。相手を気遣う表現にする。",
      "回答はJSONのみ:",
      '{"message":"添え書きの一言"}',
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
          {
            role: "user",
            content: `相談文: ${trimmedQuery || "ギフト用"}\n商品: ${names.join("、") || "美容ギフト"}`,
          },
        ],
        max_tokens: 160,
        temperature: 0.7,
      }),
    })

    if (!res.ok) return { message: FALLBACK_GIFT_MESSAGE }

    const data = await res.json()
    const content = data.choices?.[0]?.message?.content ?? ""
    const parsed = JSON.parse(content)
    return { message: normalizeGiftMessage(parsed?.message) ?? FALLBACK_GIFT_MESSAGE }
  } catch {
    return { message: FALLBACK_GIFT_MESSAGE }
  }
}

function normalizeGiftMessage(value: unknown): string | null {
  if (typeof value !== "string") return null
  const trimmed = value.trim().replace(/^「|」$/g, "")
  return trimmed ? trimmed.slice(0, 90) : null
}

type Candidate = {
  id: string
  name?: string
  category?: string
  price?: number
  tags?: string[]
  giftFor?: string[]
  description?: string
}

type Recommendation = {
  productId: string
  reason?: string
  easyToGive?: string
  caution?: string
  fitFor?: string
}

function normalizeCandidates(candidates: unknown, productIds: unknown): Candidate[] {
  if (Array.isArray(candidates)) {
    return candidates
      .map((candidate) => {
        if (!candidate || typeof candidate !== "object") return null
        const item = candidate as Record<string, unknown>
        const id = normalizeText(item.id)
        if (!id) return null
        return {
          id,
          name: normalizeText(item.name),
          category: normalizeText(item.category),
          price: typeof item.price === "number" ? item.price : undefined,
          tags: normalizeStringArray(item.tags).slice(0, 6),
          giftFor: normalizeStringArray(item.giftFor).slice(0, 5),
          description: normalizeText(item.description),
        }
      })
      .filter((candidate): candidate is Candidate => Boolean(candidate))
      .filter((candidate, index, array) => array.findIndex((item) => item.id === candidate.id) === index)
      .slice(0, MAX_CANDIDATES)
  }

  if (Array.isArray(productIds)) {
    return productIds
      .map((id) => normalizeText(id))
      .filter((id): id is string => Boolean(id))
      .filter((id, index, array) => array.indexOf(id) === index)
      .slice(0, MAX_CANDIDATES)
      .map((id) => ({ id }))
  }

  return []
}

function normalizeModelResponse(body: Record<string, unknown>, catalog: Candidate[], query: string) {
  const candidateIds = new Set(catalog.map((candidate) => candidate.id))
  const fallbackById = new Map(FALLBACK_RESPONSE.recommendations.map((item) => [item.productId, item]))
  const candidateById = new Map(catalog.map((candidate) => [candidate.id, candidate]))
  const rawRecommendations = Array.isArray(body?.recommendations)
    ? body.recommendations
    : Array.isArray(body?.recommendedProductIds)
      ? body.recommendedProductIds.map((productId, index) => ({
        productId,
        reason: Array.isArray(body?.reasons) ? body.reasons[index] : undefined,
      }))
      : []

  const validRecommendations = rawRecommendations
    .map((recommendation) => normalizeRecommendation(recommendation))
    .filter((recommendation): recommendation is Recommendation => {
      if (!recommendation) return false
      return candidateIds.size === 0 || candidateIds.has(recommendation.productId)
    })
    .filter((recommendation, index, array) => (
      array.findIndex((item) => item.productId === recommendation.productId) === index
    ))

  const fallbackRecommendations = catalog
    .filter((candidate) => !validRecommendations.some((item) => item.productId === candidate.id))
    .map((candidate) => ({
      productId: candidate.id,
      reason: fallbackById.get(candidate.id)?.reason ?? `${candidate.name ?? "候補商品"}は、相談内容に合わせて日常で使いやすいギフトとして選びやすいです。`,
      easyToGive: fallbackById.get(candidate.id)?.easyToGive ?? "価格や用途が分かりやすく、相手に気を遣わせにくい候補です。",
      caution: fallbackById.get(candidate.id)?.caution ?? "香り・使用感・成分の好みには個人差があるため、気になる場合は事前に確認すると安心です。",
      fitFor: fallbackById.get(candidate.id)?.fitFor ?? "相手の好みや生活スタイルに自然になじむギフトを探している時に合います。",
    }))

  const recommendations = rankRecommendations([...validRecommendations, ...fallbackRecommendations], candidateById, query)
    .slice(0, 3)
    .map((recommendation) => {
      const fallback = fallbackRecommendations.find((item) => item.productId === recommendation.productId)
        ?? fallbackById.get(recommendation.productId)
      return {
        productId: recommendation.productId,
        reason: recommendation.reason ?? fallback?.reason ?? "相談内容に合わせて選びやすい候補です。",
        easyToGive: recommendation.easyToGive ?? fallback?.easyToGive ?? "用途が分かりやすく、相手に気を遣わせにくい候補です。",
        caution: recommendation.caution ?? fallback?.caution ?? "香り・使用感・成分の好みには個人差があるため、気になる場合は事前に確認すると安心です。",
        fitFor: recommendation.fitFor ?? fallback?.fitFor ?? "相手の好みや生活スタイルに自然になじむギフトを探している時に合います。",
      }
    })

  return {
    summary: normalizeText(body?.summary) ?? FALLBACK_RESPONSE.summary,
    recommendations,
    recommendedProductIds: recommendations.map((recommendation) => recommendation.productId),
    reasons: recommendations.map((recommendation) => recommendation.reason ?? ""),
    followUpQuestion: normalizeText(body?.followUpQuestion),
  }
}

function rankRecommendations(
  recommendations: Recommendation[],
  candidateById: Map<string, Candidate>,
  query: string,
): Recommendation[] {
  const isSensitiveQuery = /肌が弱|敏感|低刺激|肌荒れ|香り控えめ|香りが苦手/.test(query)
  if (!isSensitiveQuery) return recommendations

  return recommendations
    .map((recommendation, index) => ({
      recommendation,
      index,
      score: scoreSensitiveFit(candidateById.get(recommendation.productId)),
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((item) => item.recommendation)
}

function scoreSensitiveFit(candidate: Candidate | undefined): number {
  if (!candidate) return 0
  const tags = candidate.tags ?? []
  let score = 0
  if (tags.includes("敏感肌向け")) score += 10
  if (tags.includes("低刺激感")) score += 9
  if (tags.includes("香り控えめ")) score += 6
  if (candidate.category === "スキンケア") score += 2
  if (candidate.category === "ヘアケア") score += 1
  return score
}

function normalizeRecommendation(value: unknown): Recommendation | null {
  if (!value || typeof value !== "object") return null
  const item = value as Record<string, unknown>
  const productId = normalizeText(item.productId)
  if (!productId) return null

  return {
    productId,
    reason: normalizeText(item.reason),
    easyToGive: normalizeText(item.easyToGive),
    caution: normalizeText(item.caution),
    fitFor: normalizeText(item.fitFor),
  }
}

function normalizeStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.map((item) => normalizeText(item)).filter((item): item is string => Boolean(item))
    : []
}

function normalizeText(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  })
}
