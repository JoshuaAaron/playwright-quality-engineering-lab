import type { ClaimRecord } from './dataQuality'

export const sumApprovedClaims = (claims: ClaimRecord[]) =>
  claims
    .filter((claim) => claim.status === 'approved')
    .reduce((total, claim) => total + claim.amount, 0)

export const validateExpectedTotal = (
  claims: ClaimRecord[],
  expectedTotal: number,
  tolerance = 0.01,
) => {
  const actual = sumApprovedClaims(claims)
  const delta = Math.abs(actual - expectedTotal)

  return {
    ok: delta <= tolerance,
    actualTotal: actual,
    expectedTotal,
    delta,
  }
}
