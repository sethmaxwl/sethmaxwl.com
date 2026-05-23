import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('base layout emits Google Analytics from a public build-time ID', () => {
  const layout = readFileSync('src/layouts/BaseLayout.astro', 'utf8');

  assert.match(layout, /PUBLIC_GOOGLE_ANALYTICS_ID/);
  assert.match(layout, /googleAnalyticsId/);
  assert.match(layout, /googletagmanager\.com\/gtag\/js\?id=/);
  assert.match(layout, /gtag\('js', new Date\(\)\)/);
  assert.match(layout, /gtag\('config', googleAnalyticsId\)/);
});

test('deployment build provides the Google Analytics measurement ID', () => {
  const workflow = readFileSync('.github/workflows/deploy-pages.yml', 'utf8');

  assert.match(workflow, /PUBLIC_GOOGLE_ANALYTICS_ID:\s*G-K311DKX63B/);
});

test('Astro environment types allow the public Google Analytics ID', () => {
  const envTypes = readFileSync('src/env.d.ts', 'utf8');

  assert.match(envTypes, /interface ImportMetaEnv/);
  assert.match(envTypes, /readonly PUBLIC_GOOGLE_ANALYTICS_ID\?: string/);
});
