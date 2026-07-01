export class AiLimitExceededError extends Error {
  constructor(limit) {
    super(`本日のAI利用回数の上限（${limit}回）に達しました。明日またご利用ください。`)
    this.name = 'AiLimitExceededError'
    this.limit = limit
  }
}

const usageKeyPrefix = 'lumiere_ai_usage_'
const limitSignatureKey = 'lumiere_ai_usage_limit'

const storageKey = () => `${usageKeyPrefix}${new Date().toISOString().slice(0, 10)}`

function ensureCurrentLimitSignature() {
  const signature = String(__AI_DAILY_LIMIT__)
  if (localStorage.getItem(limitSignatureKey) === signature) return

  Object.keys(localStorage)
    .filter((key) => key.startsWith(usageKeyPrefix))
    .forEach((key) => localStorage.removeItem(key))

  localStorage.setItem(limitSignatureKey, signature)
}

export function consumeAiLimit() {
  ensureCurrentLimitSignature()
  const limit = __AI_DAILY_LIMIT__
  const key = storageKey()
  const current = parseInt(localStorage.getItem(key) ?? '0')
  if (current >= limit) {
    throw new AiLimitExceededError(limit)
  }
  localStorage.setItem(key, String(current + 1))
}

export function getAiUsageToday() {
  ensureCurrentLimitSignature()
  return parseInt(localStorage.getItem(storageKey()) ?? '0')
}

export function getAiDailyLimit() {
  return __AI_DAILY_LIMIT__
}
