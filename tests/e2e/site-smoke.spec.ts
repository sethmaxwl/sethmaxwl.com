import { expect, test } from '@playwright/test';
import { getContentDetailRoutes } from '../support/contentRoutes';

const routes = [
  { path: '/', heading: 'Reducing sighs per click.' },
  { path: '/work/', heading: 'Shipping Department' },
  { path: '/blog/', heading: 'Drafts That Escaped' },
  { path: '/contact/', heading: "Let's chat!" },
];

for (const route of routes) {
  test(`${route.path} renders without browser errors`, async ({ page }) => {
    const browserErrors: string[] = [];

    page.on('console', (message) => {
      if (message.type() === 'error') {
        browserErrors.push(message.text());
      }
    });

    page.on('pageerror', (error) => {
      browserErrors.push(error.message);
    });

    const response = await page.goto(route.path, { waitUntil: 'domcontentloaded' });

    expect(response?.ok()).toBe(true);
    await expect(page.locator('main')).toBeVisible();
    await expect(page.getByRole('heading', { name: route.heading })).toBeVisible();
    expect(browserErrors).toEqual([]);
  });
}

test('every content detail route renders without browser errors', async ({ page }) => {
  const detailRoutes = await getContentDetailRoutes();

  for (const path of detailRoutes) {
    const browserErrors: string[] = [];

    page.on('console', (message) => {
      if (message.type() === 'error') {
        browserErrors.push(message.text());
      }
    });

    page.on('pageerror', (error) => {
      browserErrors.push(error.message);
    });

    const response = await page.goto(path, { waitUntil: 'domcontentloaded' });

    expect(response?.ok(), path).toBe(true);
    await expect(page.locator('main'), path).toBeVisible();
    await expect(page.locator('h1'), path).toBeVisible();
    expect(browserErrors, path).toEqual([]);
  }
});

test('every public page meets baseline accessibility requirements', async ({ page }) => {
  const routes = ['/', '/work/', '/blog/', '/contact/', ...(await getContentDetailRoutes())];

  for (const path of routes) {
    await page.goto(path, { waitUntil: 'domcontentloaded' });

    await expect(page.locator('html'), path).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('link', { name: 'Skip to content' }), path).toHaveAttribute(
      'href',
      '#main',
    );
    await expect(page.locator('main'), path).toHaveCount(1);
    await expect(page.locator('h1'), path).toHaveCount(1);
    await expect(page.locator('img:not([alt])'), path).toHaveCount(0);
  }
});
