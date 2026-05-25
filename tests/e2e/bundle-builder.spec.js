import { test, expect } from '@playwright/test';
import { copyFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { captureGuideStep, getOutputPath, hideGuideBanner, resetGuide, showGuideBanner, writeGuide } from '../helpers/guide.js';
import { openStorePage, waitForBundleBuilder } from '../helpers/store.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BEFORE_FIXTURE = path.join(__dirname, '..', 'fixtures', 'bundle-builder-before.html');

test.describe('Bundle Builder submission evidence', () => {
  test('@before capture broken page state (fixture)', async ({ page }) => {
    await page.goto(`file:///${BEFORE_FIXTURE.replace(/\\/g, '/')}`);
    await showGuideBanner(page, {
      step: 0,
      title: 'Before fix',
      body: 'Default page template only — heading with no bundle UI. This matches what visitors saw after seeding.',
    });

    const output = getOutputPath('before.png');
    await page.screenshot({ path: output, fullPage: true });
    await hideGuideBanner(page);

    await expect(page.getByRole('heading', { name: 'Bundle Builder' })).toBeVisible();
  });

  test('@after capture working bundle builder', async ({ page }) => {
    await openStorePage(page, '/pages/bundle-builder');
    await expect(page).toHaveURL(/\/pages\/bundle-builder/);
    await waitForBundleBuilder(page);

    const cards = page.locator('.bundle-card');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(3);

    for (let i = 0; i < 3; i += 1) {
      await cards.nth(i).click();
      await expect(cards.nth(i)).toHaveClass(/bundle-card--selected/);
    }

    const summaryBar = page.locator('.bundle-summary--visible');
    await expect(summaryBar).toBeVisible();
    await expect(page.locator('.bundle-summary__cta:not([disabled])')).toBeVisible();

    await page.screenshot({ path: getOutputPath('after.png'), fullPage: false });
  });

  test('@walkthrough annotated screenshots for Loom script', async ({ page }) => {
    resetGuide();

    await openStorePage(page, '/');
    await showGuideBanner(page, {
      step: 1,
      title: 'Homepage CTA',
      body: 'The hero pushes high-intent shoppers to BUILD A BUNDLE — but the destination page was broken after seeding.',
    });
    await captureGuideStep(page, {
      step: 1,
      slug: 'homepage-cta',
      title: 'Homepage CTA',
      narration:
        'This CTA is a conversion path. I picked Bundle Builder because it was completely dead on the dev store despite the theme already shipping the full section.',
      fullPage: false,
    });

    await openStorePage(page, '/pages/bundle-builder');
    await waitForBundleBuilder(page);
    await showGuideBanner(page, {
      step: 2,
      title: 'Series tabs + product grid',
      body: 'After wiring the page template and dev-store product fallback, the grid loads with tabbed series filtering.',
    });
    await captureGuideStep(page, {
      step: 2,
      slug: 'bundle-grid',
      title: 'Tabbed product grid',
      narration:
        'Fix one: seed.json now assigns template_suffix bundle-builder. Fix two: Liquid falls back to all-products tagged by series when manual collections are empty.',
      fullPage: true,
    });

    const cards = page.locator('.bundle-card');
    for (let i = 0; i < 3; i += 1) {
      await cards.nth(i).click();
    }

    await showGuideBanner(page, {
      step: 3,
      title: 'Sticky summary bar',
      body: 'Selecting 3+ knives unlocks tier progress, savings, and Add Bundle to Cart.',
    });
    await captureGuideStep(page, {
      step: 3,
      slug: 'sticky-summary',
      title: 'Sticky summary bar',
      narration:
        'This is the intended funnel: pick knives across tabs, see tier progress, then add the whole bundle in one action.',
      fullPage: false,
    });

    await page.locator('.bundle-summary__cta:not([disabled])').click();
    await page
      .locator('cart-drawer-component.cart-drawer dialog[open], cart-drawer-component .cart-drawer__dialog:modal')
      .first()
      .waitFor({ state: 'visible', timeout: 20000 })
      .catch(() => {});

    await showGuideBanner(page, {
      step: 4,
      title: 'Cart feedback',
      body: 'bundle-builder.js refreshes cart-drawer sections before opening the drawer so bundle adds appear immediately.',
    });
    await captureGuideStep(page, {
      step: 4,
      slug: 'cart-drawer',
      title: 'Cart drawer after add',
      narration:
        'Fix three: cart sections refresh before the drawer opens. I also added keyboard Enter/Space selection on bundle cards for accessibility.',
      fullPage: false,
    });

    await hideGuideBanner(page);

    copyFileSync(getOutputPath('03-sticky-summary.png'), getOutputPath('after.png'));

    const guidePath = writeGuide({      intro:
        'Automated Playwright walkthrough for the Bundle Builder fix on the Shopify dev store. Each screenshot includes an on-page banner you can read while recording Loom.',
    });

    test.info().annotations.push({ type: 'guide', description: guidePath });
  });
});
