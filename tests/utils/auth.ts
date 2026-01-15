import { type Page } from '@playwright/test'

type LoginPayload = {
  email: string
  password: string
}

type MockResponse = {
  status: number
  body: {
    ok: boolean
    message: string
  }
}

export const mockLoginResponse = async (page: Page, response: MockResponse) => {
  await page.route('**/api/login', async (route) => {
    const request = route.request()
    if (request.method() !== 'POST') {
      await route.fallback()
      return
    }

    await route.fulfill({
      status: response.status,
      contentType: 'application/json',
      body: JSON.stringify(response.body),
    })
  })
}

export const fillLoginForm = async (page: Page, payload: LoginPayload) => {
  await page.getByLabel('Email').fill(payload.email)
  await page.getByLabel('Password').fill(payload.password)
}

export const submitLoginForm = async (page: Page) => {
  await page.getByRole('button', { name: 'Sign in' }).click()
}

