import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { parseCsv } from '../src/utils/csv'
import { validateClaims, type ClaimRecord } from '../src/utils/dataQuality'

const readJson = (relativePath: string) =>
  JSON.parse(
    readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), 'utf-8'),
  )

const readText = (relativePath: string) =>
  readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), 'utf-8')

const csvRowToClaim = (row: Record<string, string>): ClaimRecord => ({
  id: row.id,
  memberId: row.memberId,
  amount: Number(row.amount),
  status: row.status as ClaimRecord['status'],
  submittedAt: row.submittedAt,
})

test.describe('data quality checks', () => {
  test('valid claim JSON passes validation', () => {
    const claims = readJson('./data/claims.json') as ClaimRecord[]

    const errors = validateClaims(claims)

    expect(errors).toHaveLength(0)
  })

  test('invalid claim JSON surfaces issues', () => {
    const claims = readJson('./data/claims-invalid.json') as ClaimRecord[]

    const errors = validateClaims(claims)

    expect(errors.length).toBeGreaterThan(0)
    expect(errors).toEqual(
      expect.arrayContaining([
        expect.stringContaining('memberId is required'),
        expect.stringContaining('amount must be greater than 0'),
        expect.stringContaining('duplicate id'),
        expect.stringContaining('status'),
        expect.stringContaining('submittedAt'),
      ]),
    )
  })

  test('CSV pipeline data can be normalized and validated', () => {
    const csv = readText('./data/claims.csv')
    const rows = parseCsv(csv)
    const claims = rows.map(csvRowToClaim)

    const errors = validateClaims(claims)

    expect(errors).toHaveLength(0)
  })
})
