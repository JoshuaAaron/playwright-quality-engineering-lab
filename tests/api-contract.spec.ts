import { test, expect } from '@playwright/test'
import { startMockApiServer } from './utils/mockApiServer'
import { demoEmail, demoPassword } from './utils/env'

let server: Awaited<ReturnType<typeof startMockApiServer>>

test.beforeAll(async () => {
  server = await startMockApiServer()
})

test.afterAll(async () => {
  await server.close()
})

test.describe('API contract checks', () => {
  test('health endpoint reports healthy', async ({ request }) => {
    const response = await request.get(`${server.url}/health`)

    expect(response.ok()).toBeTruthy()
    await expect(response.json()).resolves.toEqual({ ok: true, status: 'healthy' })
  })

  test('login returns 200 on valid credentials', async ({ request }) => {
    const response = await request.post(`${server.url}/login`, {
      data: { email: demoEmail, password: demoPassword },
    })

    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body).toMatchObject({ ok: true, userId: 'usr_001' })
  })

  test('login returns 401 on invalid credentials', async ({ request }) => {
    const response = await request.post(`${server.url}/login`, {
      data: { email: demoEmail, password: 'BadPassword' },
    })

    expect(response.status()).toBe(401)
    const body = await response.json()
    expect(body).toEqual({ ok: false, message: 'Invalid credentials.' })
  })
})
