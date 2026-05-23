import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

test('public deployment markers configure the custom GitHub Pages domain', () => {
  assert.equal(readFileSync('public/CNAME', 'utf8'), 'sethmaxwl.com\n');
  assert.equal(existsSync('public/.nojekyll'), true);
});

test('GitHub Pages workflow builds and deploys the Astro static artifact', () => {
  const workflow = readFileSync('.github/workflows/deploy-pages.yml', 'utf8');

  assert.match(workflow, /name:\s*Deploy to GitHub Pages/);
  assert.match(workflow, /branches:\s*\[main\]/);
  assert.match(workflow, /contents:\s*read/);
  assert.match(workflow, /pages:\s*write/);
  assert.match(workflow, /id-token:\s*write/);
  assert.match(workflow, /actions\/checkout@v4/);
  assert.match(workflow, /actions\/setup-node@v4[\s\S]*node-version:\s*24[\s\S]*cache:\s*npm/);
  assert.match(workflow, /run:\s*npm ci/);
  assert.match(workflow, /run:\s*npm test/);
  assert.match(workflow, /run:\s*npm run build/);
  assert.match(workflow, /run:\s*test -f dist\/CNAME && test -f dist\/\.nojekyll/);
  assert.match(workflow, /actions\/configure-pages@v5/);
  assert.match(workflow, /actions\/upload-pages-artifact@v3[\s\S]*path:\s*dist/);
  assert.match(workflow, /actions\/deploy-pages@v4/);
});
