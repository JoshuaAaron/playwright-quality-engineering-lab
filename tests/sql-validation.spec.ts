import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { validateExpectedTotal } from '../src/utils/sqlValidation'
import type { ClaimRecord } from '../src/utils/dataQuality'

const readClaims = () =>
  JSON.parse(
    readFileSync(fileURLToPath(new URL('./data/claims.json', import.meta.url)), 'utf-8'),
  ) as ClaimRecord[]

test.describe('SQL/Athena validation checks', () => {
  test('approved claims total matches expected rollup', () => {
    const claims = readClaims()

    const result = validateExpectedTotal(claims, 1250.5)

    expect(result.ok).toBe(true)
    expect(result.delta).toBeLessThanOrEqual(0.01)
  })
})
