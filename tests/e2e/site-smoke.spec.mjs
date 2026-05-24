import { expect, test } from '@playwright/test';

const routes = [
  { path: '/', heading: 'Reducing sighs per click.' },
  { path: '/work/', heading: 'Shipping Department' },
  { path: '/blog/', heading: 'Drafts That Escaped' },
  { path: '/contact/', heading: "Let's chat!" },
];

for (const route of routes) {
  test(`${route.path} renders without browser errors`, async ({ page }) => {
    const browserErrors = [];

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
