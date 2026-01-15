# QA Automation Practice Login

[![CI](https://github.com/JoshuaAaron/playwright-quality-engineering-lab/actions/workflows/ci.yml/badge.svg)](https://github.com/JoshuaAaron/playwright-quality-engineering-lab/actions/workflows/ci.yml)

This project is a focused practice app for QA automation interviews. It includes a React + TypeScript login screen and Playwright tests that cover:

- UI validation and accessibility assertions
- Positive and negative login flows
- Mocked API responses for deterministic tests
- Data-driven validation cases loaded from JSON
- API contract checks and metrics reporting
- Data quality validation for JSON/CSV pipelines
- SQL/Athena-style rollup validation
- Salesforce Lightning-style workflow mock
- CI workflow example for regression coverage

## Demo credentials

Set demo credentials in `.env` (local) or GitHub Secrets (CI). See `.env.example` for the required keys.

## Scripts

The following scripts are available in `package.json`:

- `npm run dev` – start the Vite dev server
- `npm run test:e2e` – run Playwright tests
- `npm run test:e2e:ui` – open Playwright UI mode
- `npm run lint` – run lint checks
- `npm run build` – build the app

## Notes for interview practice

- The login form calls `/api/login`. Playwright tests mock this request.
- If the API request fails (e.g., no backend running), the UI falls back to a local in-memory demo user list.
- Demo credentials are sourced from `.env` and GitHub Actions secrets (Vite uses `VITE_` prefixed keys).
- Validation edge cases live in `tests/data/login-cases.json` for data-driven coverage.
- Data quality checks in `tests/data-quality.spec.ts` validate JSON and CSV “pipeline” data using helpers in `src/utils`.
- API contract checks live in `tests/api-contract.spec.ts` and run against a local mock server.
- SQL/Athena-style rollup validation is in `tests/sql-validation.spec.ts` using `src/utils/sqlValidation.ts`.
- Metrics examples are in `tests/metrics.spec.ts` with alert thresholds in `src/utils/metrics.ts`.
- A sample CI workflow is in `.github/workflows/ci.yml`.
- `tests/salesforce-workflow.spec.ts` mocks a Salesforce Lightning-style workflow for UI assertions.

## Test plan artifact

- `docs/test-plan.md` includes a lightweight test plan and risk list to mirror Jira-style documentation.

## CI badge setup

Replace `<OWNER>` and `<REPO>` in the badge URL with your GitHub org/user and repository name.

  ## Notes for interview practice

  - The login form calls `/api/login`. Playwright tests mock this request.
  - If the API request fails (e.g., no backend running), the UI falls back to a local in-memory demo user list.
  - Validation edge cases live in `tests/data/login-cases.json` for data-driven coverage.
  - Data quality checks in `tests/data-quality.spec.ts` validate JSON and CSV “pipeline” data using helpers in `src/utils`.
  - API contract checks live in `tests/api-contract.spec.ts` and run against a local mock server.
  - SQL/Athena-style rollup validation is in `tests/sql-validation.spec.ts` using `src/utils/sqlValidation.ts`.
  - Metrics examples are in `tests/metrics.spec.ts` with alert thresholds in `src/utils/metrics.ts`.
  - A sample CI workflow is in `.github/workflows/ci.yml`.
  - `tests/salesforce-workflow.spec.ts` mocks a Salesforce Lightning-style workflow for UI assertions.

  ## Test plan artifact

  - `docs/test-plan.md` includes a lightweight test plan and risk list to mirror Jira-style documentation.

