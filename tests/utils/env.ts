const readEnv = (key: string) => {
  const value = process.env[key]
  if (!value) {
    throw new Error(
      `Missing ${key}. Set it in .env for local runs or in CI secrets.`,
    )
  }
  return value
}

export const demoEmail = readEnv('DEMO_EMAIL')
export const demoPassword = readEnv('DEMO_PASSWORD')
