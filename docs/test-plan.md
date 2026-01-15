# QA Automation Practice Test Plan

## Goal
Validate the login experience, data pipelines, and API contracts with reusable automation.

## Scope
- UI login workflow and validation states
- API contract checks for login and health endpoints
- Data quality validation for JSON/CSV pipeline inputs
- SQL/Athena-style rollups for claims totals
- Mocked Salesforce Lightning workflow UI checks
- S3-style ingestion simulated by JSON/CSV drops in `tests/data`
- Automation metrics and alert thresholds

## Risks & Edge Cases
- Missing or malformed email/password
- Incorrect credentials
- Empty or duplicate claim IDs
- Negative or zero claim amounts
- Invalid status values
- Corrupted timestamps

## Test Strategy
- **Playwright UI tests** for end-to-end flow
- **Playwright API tests** with a mocked local server
- **Data validation tests** for JSON + CSV pipelines
- **Metrics checks** for pass rate and defect leakage thresholds
- **Pre-run environment validation** to ensure demo credentials are present locally

## Tooling
- React + TypeScript UI
- Playwright for UI + API automation
- Lightweight data utilities for validation and parsing
- CI workflow (GitHub Actions example)
