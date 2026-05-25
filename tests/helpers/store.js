import { getStorePassword } from './env.js';

export async function bypassStorePassword(page) {
  const password = getStorePassword();
  if (!password) {
    return false;
  }

  const passwordInput = page.locator('input[type="password"][name="password"], #Password');
  const onPasswordPage = await passwordInput.isVisible({ timeout: 3000 }).catch(() => false);
  if (!onPasswordPage) {
    return false;
  }

  await passwordInput.fill(password);
  await page.locator('button[type="submit"], input[type="submit"]').first().click();
  await page.waitForLoadState('networkidle');
  return true;
}

export async function openStorePage(page, pathname) {
  await page.goto(pathname, { waitUntil: 'load' });
  await bypassStorePassword(page);
  if (page.url().includes('/password')) {
    throw new Error(
      'Store password page is still visible. Add STORE_PASSWORD to .env (Online Store → Preferences → Password).'
    );
  }

  const expectedPath = pathname.split('?')[0];
  if (!page.url().includes(expectedPath)) {
    await page.goto(pathname, { waitUntil: 'networkidle' });
  }
}

export async function waitForBundleBuilder(page) {
  await page.locator('bundle-builder-component.bundle-builder').waitFor({ state: 'visible', timeout: 30000 });
  await page.locator('.bundle-card').first().waitFor({ state: 'visible', timeout: 30000 });
}
