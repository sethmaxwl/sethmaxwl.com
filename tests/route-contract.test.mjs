import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const componentFiles = [
  'src/layouts/BaseLayout.astro',
  'src/components/SiteHeader.astro',
  'src/components/SiteFooter.astro',
  'src/components/PageIntro.astro',
  'src/components/Icon.astro',
  'src/components/EditorialVisual.astro',
  'src/components/ProjectFeature.astro',
  'src/components/BlogList.astro'
];

test('shared editorial components exist', () => {
  for (const file of componentFiles) {
    assert.equal(existsSync(file), true, `${file} exists`);
  }
});

test('base layout imports global CSS and renders header/footer', () => {
  const layout = readFileSync('src/layouts/BaseLayout.astro', 'utf8');
  assert.match(layout, /global\.css/);
  assert.match(layout, /SiteHeader/);
  assert.match(layout, /SiteFooter/);
});

test('site footer copyright year is derived from the current date', () => {
  const footer = readFileSync('src/components/SiteFooter.astro', 'utf8');

  assert.match(footer, /new Date\(\)\.getFullYear\(\)/);
  assert.doesNotMatch(footer, /&copy;\s*2026\b/);
});

test('site footer keeps navigation as plain text links', () => {
  const footer = readFileSync('src/components/SiteFooter.astro', 'utf8');
  const siteData = readFileSync('src/data/site.js', 'utf8');

  assert.doesNotMatch(footer, /import Icon from '\.\/Icon\.astro'/);
  assert.doesNotMatch(footer, /<Icon/);
  assert.doesNotMatch(footer, /site-icon/);
  assert.doesNotMatch(footer, /item\.icon/);
  assert.doesNotMatch(siteData, /footerLinks:[\s\S]*icon:/);
});

test('site header defines an accessible mobile menu button', () => {
  const header = readFileSync('src/components/SiteHeader.astro', 'utf8');

  assert.match(header, /class="nav-toggle"/);
  assert.match(header, /aria-controls="primary-navigation"/);
  assert.match(header, /aria-expanded="false"/);
  assert.match(header, /id="primary-navigation"/);
  assert.match(header, /data-menu-open="false"/);
  assert.match(header, /addEventListener\('click'/);
  assert.match(header, /addEventListener\('keydown'/);
  assert.match(header, /\.site-header\[data-menu-open='true'\]\s+\.primary-nav/);
  assert.match(header, /document\.documentElement\.classList\.toggle\('menu-open'/);
});

test('site header and footer define polished mobile navigation layouts', () => {
  const header = readFileSync('src/components/SiteHeader.astro', 'utf8');
  const footer = readFileSync('src/components/SiteFooter.astro', 'utf8');

  assert.match(header, /@media \(max-width: 760px\)/);
  assert.match(header, /\.header-inner[\s\S]*grid-template-columns:\s*minmax\(0,\s*1fr\) auto/);
  assert.match(header, /\.site-header\[data-menu-open='true'\][\s\S]*position:\s*fixed/);
  assert.match(header, /\.site-header\[data-menu-open='true'\][\s\S]*inset:\s*0/);
  assert.match(header, /\.site-header\[data-menu-open='true'\]\s+\.header-inner[\s\S]*min-height:\s*100svh/);
  assert.match(header, /\.site-header\[data-menu-open='true'\]\s+\.header-inner[\s\S]*grid-template-rows:\s*auto auto/);
  assert.match(header, /\.site-header\[data-menu-open='true'\]\s+\.header-inner[\s\S]*align-items:\s*start/);
  assert.match(header, /:global\(html\.menu-open\)[\s\S]*overflow:\s*hidden/);
  assert.match(header, /\.primary-nav[\s\S]*width:\s*100%/);
  assert.match(header, /\.primary-nav[\s\S]*grid-template-columns:\s*minmax\(0,\s*1fr\)/);
  assert.match(header, /\.primary-nav a[\s\S]*min-height:\s*4\.25rem/);
  assert.match(header, /\.primary-nav a[\s\S]*padding-inline:\s*0\.15rem/);
  assert.match(header, /\.primary-nav a::after[\s\S]*height:\s*1px/);

  assert.match(footer, /@media \(max-width: 760px\)/);
  assert.match(footer, /\.footer-inner[\s\S]*align-items:\s*start/);
  assert.match(footer, /@media \(max-width: 520px\)/);
  assert.match(footer, /grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(footer, /\.footer-nav a[\s\S]*min-height:\s*2\.5rem/);
});

test('contact page presents a compact set of contact links', () => {
  const contact = readFileSync('src/pages/contact.astro', 'utf8');

  assert.match(contact, /class="contact-list"/);
  assert.match(contact, /href=\{site\.links\.email\}/);
  assert.match(contact, /href=\{site\.links\.github\}/);
  assert.match(contact, /href=\{site\.links\.linkedin\}/);
  assert.match(contact, /class="contact-copy"/);
  assert.match(contact, /:global\(\.contact-icon\)/);
  assert.doesNotMatch(contact, /PageIntro/);
  assert.doesNotMatch(contact, /site\.location/);
  assert.doesNotMatch(contact, /<p>/);
  assert.doesNotMatch(contact, /<strong/);
  assert.doesNotMatch(contact, /font-family:\s*var\(--font-display\)/);
  assert.doesNotMatch(contact, /min-height:\s*18rem/);
});

test('shared icon component exposes the small site icon set', () => {
  const icon = readFileSync('src/components/Icon.astro', 'utf8');

  for (const name of ['mail', 'github', 'linkedin', 'arrow-right', 'external-link']) {
    assert.match(icon, new RegExp(`['"]${name}['"]`));
  }

  assert.match(icon, /aria-hidden="true"/);
  assert.match(icon, /focusable="false"/);
});

test('best candidate link surfaces render decorative icons', () => {
  const contact = readFileSync('src/pages/contact.astro', 'utf8');
  const projectFeature = readFileSync('src/components/ProjectFeature.astro', 'utf8');

  assert.match(contact, /import Icon from '@components\/Icon\.astro'/);
  assert.match(contact, /name="mail"/);
  assert.match(contact, /name="github"/);
  assert.match(contact, /name="linkedin"/);

  assert.match(projectFeature, /import Icon from '\.\/Icon\.astro'/);
  assert.match(projectFeature, /name="arrow-right"/);
});

test('project visuals render required thumbnail images', () => {
  const visual = readFileSync('src/components/EditorialVisual.astro', 'utf8');
  const projectFeature = readFileSync('src/components/ProjectFeature.astro', 'utf8');
  const projectPage = readFileSync('src/pages/work/[slug].astro', 'utf8');

  assert.match(visual, /thumbnail/);
  assert.match(visual, /<img/);
  assert.match(visual, /class="editorial-thumbnail"/);
  assert.match(projectFeature, /thumbnail=\{data\.thumbnail\}/);
  assert.match(projectPage, /thumbnail=\{project\.data\.thumbnail\}/);
  assert.doesNotMatch(visual, /variant/);
  assert.doesNotMatch(visual, /hasThumbnail/);
  assert.doesNotMatch(visual, /plane-/);
  assert.doesNotMatch(projectFeature, /variant=/);
  assert.doesNotMatch(projectPage, /variant=/);
});

test('project detail pages render optional community post links safely inside the header', () => {
  const projectPage = readFileSync('src/pages/work/[slug].astro', 'utf8');

  assert.match(projectPage, /import Icon from '@components\/Icon\.astro'/);
  assert.match(projectPage, /<header class="case-hero container">[\s\S]*project\.data\.externalLink/);
  assert.match(projectPage, /href=\{project\.data\.externalLink\.href\}/);
  assert.match(projectPage, /target="_blank"/);
  assert.match(projectPage, /rel="noopener noreferrer"/);
  assert.match(projectPage, /class="community-link-label"/);
  assert.match(projectPage, /name="external-link"/);
  assert.match(projectPage, /\{project\.data\.externalLink\.label\}/);
  assert.match(projectPage, /\.community-link\s*\{[\s\S]*border:\s*1px solid var\(--color-outline\)/);
  assert.match(projectPage, /\.community-link\s*\{[\s\S]*text-decoration:\s*none/);
  assert.doesNotMatch(projectPage, /<dt>Community<\/dt>/);
  assert.doesNotMatch(projectPage, /class="meta-grid"/);
});

test('project thumbnail visuals preserve the full image without cropping', () => {
  const visual = readFileSync('src/components/EditorialVisual.astro', 'utf8');

  assert.match(visual, /\.editorial-thumbnail\s*\{[\s\S]*\n\s+display:\s*block/);
  assert.match(visual, /\.editorial-thumbnail\s*\{[\s\S]*\n\s+height:\s*auto/);
  assert.doesNotMatch(visual, /\.editorial-visual\.has-thumbnail/);
  assert.doesNotMatch(visual, /object-fit:\s*cover/);
});

const routeFiles = [
  'src/pages/index.astro',
  'src/pages/work/index.astro',
  'src/pages/work/[slug].astro',
  'src/pages/blog/index.astro',
  'src/pages/blog/[slug].astro',
  'src/pages/contact.astro',
];

test('approved site route files exist', () => {
  for (const file of routeFiles) {
    assert.equal(existsSync(file), true, `${file} exists`);
  }
});

test('retired about route file is absent', () => {
  assert.equal(existsSync('src/pages/about.astro'), false, 'about route stays removed');
});


test('dynamic blog and work pages use getStaticPaths', () => {
  const work = readFileSync('src/pages/work/[slug].astro', 'utf8');
  const blog = readFileSync('src/pages/blog/[slug].astro', 'utf8');
  assert.match(work, /getStaticPaths/);
  assert.match(work, /getCollection\('work'\)/);
  assert.match(blog, /getStaticPaths/);
  assert.match(blog, /getCollection\('blog'\)/);
});
