import { createClient } from '@supabase/supabase-js'
import { consumeAiLimit } from './aiLimit'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

// AI 検索リランキング
export async function recommendProducts(query, candidates) {
  if (!supabase) throw new Error('Supabase client is not configured')
  consumeAiLimit()
  const { data, error } = await supabase.functions.invoke('recommend-products', {
    body: { query, candidates },
  })
  if (error) throw error
  return data
}

// AI コンシェルジュ
export async function askConcierge(query, productIds = []) {
  if (!supabase) throw new Error('Supabase client is not configured')
  consumeAiLimit()
  const { data, error } = await supabase.functions.invoke('concierge', {
    body: { query, productIds },
  })
  if (error) throw error
  return data
}
