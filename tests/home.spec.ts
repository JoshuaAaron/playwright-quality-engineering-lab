import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import {
    fillLoginForm,
    mockLoginResponse,
    submitLoginForm,
} from './utils/auth'
import { demoEmail, demoPassword } from './utils/env'

const loginCases = JSON.parse(
    readFileSync(
        fileURLToPath(new URL('./data/login-cases.json', import.meta.url)),
        'utf-8',
    ),
) as Array<{ name: string; email: string; password: string; expectedError: string }>

test.describe('login form', () => {
    test('renders the expected fields', async ({ page }) => {
        await page.goto('/')

        await expect(
            page.getByRole('heading', { name: 'Sign in to your account' }),
        ).toBeVisible()
        await expect(page.getByLabel('Email')).toBeVisible()
        await expect(page.getByLabel('Password')).toBeVisible()
        await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible()
    })

    test('shows success state on valid login', async ({ page }) => {
        await mockLoginResponse(page, {
            status: 200,
            body: { ok: true, message: 'Welcome back, Ava.' },
        })

        await page.goto('/')
        await fillLoginForm(page, {
                email: demoEmail,
                password: demoPassword,
        })

        await submitLoginForm(page)

        await expect(page.getByRole('status')).toContainText('Welcome back, Ava.')
    })

    test('surfaces invalid credentials from the API', async ({ page }) => {
        await mockLoginResponse(page, {
            status: 401,
            body: { ok: false, message: 'Invalid email or password.' },
        })

        await page.goto('/')
        await fillLoginForm(page, {
                email: demoEmail,
            password: 'WrongPassword',
        })

        await submitLoginForm(page)

        await expect(page.getByRole('alert')).toContainText(
            'Invalid email or password.',
        )
    })

    for (const loginCase of loginCases) {
        test(`validates: ${loginCase.name}`, async ({ page }) => {
            await page.goto('/')
            await fillLoginForm(page, {
                email: loginCase.email,
                password: loginCase.password,
            })

            await submitLoginForm(page)

            await expect(page.getByRole('alert')).toContainText(
                loginCase.expectedError,
            )
        })
    }
})