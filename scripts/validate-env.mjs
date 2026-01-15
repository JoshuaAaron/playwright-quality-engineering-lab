import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const envPath = resolve(process.cwd(), '.env')

if (existsSync(envPath)) {
  const raw = readFileSync(envPath, 'utf-8')
  raw.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) {
      return
    }
    const [key, ...rest] = trimmed.split('=')
    const value = rest.join('=').trim()
    if (key && process.env[key] === undefined) {
      process.env[key] = value
    }
  })
}

const required = ['DEMO_EMAIL', 'DEMO_PASSWORD', 'VITE_DEMO_EMAIL', 'VITE_DEMO_PASSWORD']
const missing = required.filter((key) => !process.env[key])

if (missing.length > 0) {
  console.error(
    `Missing required env vars: ${missing.join(', ')}. ` +
      'Set them in .env or your shell before running tests.',
  )
  process.exit(1)
}

console.log('✅ Required env vars found for local testing.')
