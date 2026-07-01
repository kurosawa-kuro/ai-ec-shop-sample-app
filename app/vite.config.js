import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const configYaml = readFileSync(resolve(__dirname, '../env/config.yaml'), 'utf8')
const dailyLimitMatch = configYaml.match(/^\s*dailyLimit:\s*(\d+)/m)
const AI_DAILY_LIMIT = dailyLimitMatch ? parseInt(dailyLimitMatch[1]) : 50

export default defineConfig({
  plugins: [react()],
  publicDir: '../data',
  define: {
    __AI_DAILY_LIMIT__: AI_DAILY_LIMIT,
  },
})
