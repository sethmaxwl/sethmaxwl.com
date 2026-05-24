import test from 'node:test';
import assert from 'node:assert/strict';
import { site } from '../src/data/site.ts';

test('site metadata exposes contact links and primary navigation', () => {
  assert.equal(site.name, 'Seth Maxwell');
  assert.equal(site.email, 'sethmaxwl@gmail.com');
  assert.equal(site.links.email, 'mailto:sethmaxwl@gmail.com');
  assert.equal(site.links.github, 'https://github.com/sethmaxwl');
  assert.equal(site.links.linkedin, 'https://linkedin.com/in/sethmaxwl/');
  assert.deepEqual(
    site.nav.map((item) => item.href),
    ['/work/', '/blog/', '/contact/'],
  );
});

test('site metadata keeps curated content ordering in one place', () => {
  assert.deepEqual(site.content.workOrder, ['starred-objects', 'draft-pull-requests']);
  assert.deepEqual(site.content.blogOrder, ['mac-app-maintenance-on-tap']);
  assert.deepEqual(site.home.featuredWork, ['starred-objects', 'draft-pull-requests']);
});
