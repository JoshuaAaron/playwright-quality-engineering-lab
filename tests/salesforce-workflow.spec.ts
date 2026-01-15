import { test, expect } from '@playwright/test'

test.describe('Salesforce Lightning workflow (mock)', () => {
  test('case status update flow is visible', async ({ page }) => {
    await page.setContent(`
      <section class="slds-card" aria-label="Case workflow">
        <header class="slds-card__header slds-grid">
          <h2 class="slds-text-heading_small">Case Review</h2>
        </header>
        <div class="slds-card__body">
          <label for="case-status" class="slds-form-element__label">Case Status</label>
          <select id="case-status" class="slds-select">
            <option>New</option>
            <option>In Review</option>
            <option>Approved</option>
          </select>
          <button class="slds-button slds-button_brand">Update Case</button>
        </div>
      </section>
    `)

    await expect(page.getByText('Case Review')).toBeVisible()
    await expect(page.getByLabel('Case Status')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Update Case' })).toBeVisible()
  })
})
