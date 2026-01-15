export type AutomationMetricsInput = {
  suiteName: string
  totalTests: number
  passedTests: number
  failedTests: number
  durationMs: number
}

export type AutomationMetricsReport = {
  suiteName: string
  totalTests: number
  passedTests: number
  failedTests: number
  passRate: number
  defectLeakageRate: number
  durationSeconds: number
}

export const buildMetricsReport = (
  input: AutomationMetricsInput,
): AutomationMetricsReport => {
  const total = Math.max(input.totalTests, 0)
  const passed = Math.max(input.passedTests, 0)
  const failed = Math.max(input.failedTests, 0)

  const passRate = total === 0 ? 1 : passed / total
  const defectLeakageRate = total === 0 ? 0 : failed / total

  return {
    suiteName: input.suiteName,
    totalTests: total,
    passedTests: passed,
    failedTests: failed,
    passRate,
    defectLeakageRate,
    durationSeconds: Number((input.durationMs / 1000).toFixed(2)),
  }
}

export const shouldAlertOnMetrics = (
  report: AutomationMetricsReport,
  thresholds: { minPassRate: number; maxDefectLeakageRate: number },
) => {
  return (
    report.passRate < thresholds.minPassRate ||
    report.defectLeakageRate > thresholds.maxDefectLeakageRate
  )
}
