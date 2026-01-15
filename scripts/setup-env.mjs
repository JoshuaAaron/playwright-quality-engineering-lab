import { readFileSync, existsSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { stdin as input, stdout as output } from 'node:process'
import readline from 'node:readline/promises'

const args = new Set(process.argv.slice(2))
const force = args.has('--force')
const nonInteractive = args.has('--non-interactive')

const root = resolve(process.cwd())
const envPath = resolve(root, '.env')
const examplePath = resolve(root, '.env.example')

if (existsSync(envPath) && !force) {
  console.log('A .env file already exists. Use --force to overwrite it.')
  process.exit(0)
}

if (!existsSync(examplePath)) {
  console.error('Missing .env.example. Create it before running setup.')
  process.exit(1)
}

const rawExample = readFileSync(examplePath, 'utf-8')
const keys = rawExample
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith('#') && line.includes('='))
  .map((line) => line.split('=')[0])

const defaults = new Map([
  ['BASE_URL', 'http://localhost:5173'],
])

const collectValues = async () => {
  const values = []

  if (nonInteractive) {
    return keys.map((key) => `${key}=${defaults.get(key) ?? ''}`)
  }

  const rl = readline.createInterface({ input, output })
  for (const key of keys) {
    const defaultValue = defaults.get(key) ?? ''
    const label = defaultValue
      ? `Enter value for ${key} (${defaultValue}): `
      : `Enter value for ${key}: `
    const answer = (await rl.question(label)).trim()
    values.push(`${key}=${answer || defaultValue}`)
  }
  await rl.close()
  return values
}

const values = await collectValues()
writeFileSync(envPath, `${values.join('\n')}\n`, 'utf-8')
console.log('✅ .env file created.')
