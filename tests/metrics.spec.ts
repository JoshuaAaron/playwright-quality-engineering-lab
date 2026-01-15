import { test, expect } from '@playwright/test'
import { buildMetricsReport, shouldAlertOnMetrics } from '../src/utils/metrics'

test.describe('automation metrics', () => {
  test('builds a metrics report with rates', () => {
    const report = buildMetricsReport({
      suiteName: 'smoke',
      totalTests: 20,
      passedTests: 18,
      failedTests: 2,
      durationMs: 12650,
    })

    expect(report.passRate).toBeCloseTo(0.9)
    expect(report.defectLeakageRate).toBeCloseTo(0.1)
    expect(report.durationSeconds).toBeCloseTo(12.65)
  })

  test('flags alert-worthy thresholds', () => {
    const report = buildMetricsReport({
      suiteName: 'regression',
      totalTests: 40,
      passedTests: 34,
      failedTests: 6,
      durationMs: 40000,
    })

    const shouldAlert = shouldAlertOnMetrics(report, {
      minPassRate: 0.9,
      maxDefectLeakageRate: 0.05,
    })

    expect(shouldAlert).toBe(true)
  })
})
