export type ClaimRecord = {
  id: string
  memberId: string
  amount: number
  status: 'pending' | 'approved' | 'denied'
  submittedAt: string
}

const allowedStatuses: ClaimRecord['status'][] = ['pending', 'approved', 'denied']

export const validateClaims = (claims: ClaimRecord[]) => {
  const errors: string[] = []
  const seenIds = new Set<string>()

  claims.forEach((claim, index) => {
    const row = index + 1

    if (!claim.id.trim()) {
      errors.push(`Row ${row}: id is required.`)
    } else if (seenIds.has(claim.id)) {
      errors.push(`Row ${row}: duplicate id ${claim.id}.`)
    } else {
      seenIds.add(claim.id)
    }

    if (!claim.memberId.trim()) {
      errors.push(`Row ${row}: memberId is required.`)
    }

    if (!Number.isFinite(claim.amount) || claim.amount <= 0) {
      errors.push(`Row ${row}: amount must be greater than 0.`)
    }

    if (!allowedStatuses.includes(claim.status)) {
      errors.push(`Row ${row}: status ${claim.status} is invalid.`)
    }

    if (Number.isNaN(Date.parse(claim.submittedAt))) {
      errors.push(`Row ${row}: submittedAt must be a valid ISO date.`)
    }
  })

  return errors
}
