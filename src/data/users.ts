type EnvironmentSource = Record<string, string | undefined>

const readEnv = (key: string) => {
  const metaEnv = (import.meta as ImportMeta & { env?: EnvironmentSource }).env
  if (metaEnv?.[key]) {
    return metaEnv[key]
  }

  const nodeEnv = (globalThis as { process?: { env?: EnvironmentSource } })
    .process?.env
  if (nodeEnv?.[key]) {
    return nodeEnv[key]
  }

  return undefined
}

const demoEmail = readEnv('VITE_DEMO_EMAIL') || readEnv('DEMO_EMAIL')
const demoPassword = readEnv('VITE_DEMO_PASSWORD') || readEnv('DEMO_PASSWORD')
const demoName = readEnv('DEMO_USER_NAME')

export type UserRecord = {
  id: string
  name: string
  email: string
  password: string
}

export const demoUser =
  demoEmail && demoPassword
    ? {
        id: 'usr_001',
        name: demoName || 'Demo User',
        email: demoEmail,
        password: demoPassword,
      }
    : null

export const users: UserRecord[] = demoUser ? [demoUser] : []
