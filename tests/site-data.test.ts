import test from 'node:test';
import assert from 'node:assert/strict';
import { site } from '../src/data/site.ts';

test('site metadata exposes identity, contact links, and primary navigation', () => {
  assert.equal(site.url, 'https://sethmaxwl.com');
  assert.equal(site.name, 'Seth Maxwell');
  assert.equal(site.defaultTitle, 'Seth Maxwell | Software Engineer');
  assert.equal(site.email, 'sethmaxwl@gmail.com');
  assert.equal(site.person.jobTitle, 'Software Engineer');
  assert.equal(site.person.organization, 'Atlassian');
  assert.equal(site.links.email, 'mailto:sethmaxwl@gmail.com');
  assert.equal(site.links.github, 'https://github.com/sethmaxwl');
  assert.equal(site.links.linkedin, 'https://linkedin.com/in/sethmaxwl/');
  assert.deepEqual(
    site.nav.map((item) => item.href),
    ['/work/', '/blog/', '/contact/'],
  );
});
