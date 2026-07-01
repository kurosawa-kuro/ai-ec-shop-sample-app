export class AiLimitExceededError extends Error {
  constructor(limit) {
    super(`本日のAI利用回数の上限（${limit}回）に達しました。明日またご利用ください。`)
    this.name = 'AiLimitExceededError'
    this.limit = limit
  }
}

const storageKey = () => `lumiere_ai_usage_${new Date().toISOString().slice(0, 10)}`

export function consumeAiLimit() {
  const limit = __AI_DAILY_LIMIT__
  const key = storageKey()
  const current = parseInt(localStorage.getItem(key) ?? '0')
  if (current >= limit) {
    throw new AiLimitExceededError(limit)
  }
  localStorage.setItem(key, String(current + 1))
}

export function getAiUsageToday() {
  return parseInt(localStorage.getItem(storageKey()) ?? '0')
}

export function getAiDailyLimit() {
  return __AI_DAILY_LIMIT__
}
