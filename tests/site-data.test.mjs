import test from 'node:test';
import assert from 'node:assert/strict';

test('site metadata exposes Seth contact and navigation details', async () => {
  const { site } = await import('../src/data/site.js');

  assert.equal(site.name, 'Seth Maxwell');
  assert.equal(site.email, 'sethmaxwl@gmail.com');
  assert.equal(site.links.github, 'https://github.com/sethmaxwl');
  assert.equal(site.links.linkedin, 'https://linkedin.com/in/sethmaxwl/');
  assert.deepEqual(site.nav.map((item) => item.href), [
    '/work/',
    '/blog/',
    '/contact/',
  ]);
  assert.equal(site.nav.find((item) => item.href === '/blog/')?.label, 'Blog');
});

test('site metadata controls content ordering and home featured work', async () => {
  const { site } = await import('../src/data/site.js');

  assert.deepEqual(site.content.workOrder, [
    'starred-objects',
    'draft-pull-requests',
  ]);
  assert.deepEqual(site.content.blogOrder, [
    'mac-app-maintenance-on-tap',
  ]);
  assert.deepEqual(site.home.featuredWork, [
    'starred-objects',
    'draft-pull-requests',
  ]);
});
