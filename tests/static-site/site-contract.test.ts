import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(fileURLToPath(new URL('../..', import.meta.url)));
const distRoot = path.join(repoRoot, 'dist');
const origin = 'https://sethmaxwl.com';

test('dist contains expected routes and required static files', async () => {
  const expectedRoutes = [
    '/',
    '/work/',
    ...(await contentRoutes('src/content/work', '/work/')),
    '/blog/',
    ...(await contentRoutes('src/content/blog', '/blog/')),
    '/contact/',
  ];

  for (const route of expectedRoutes) {
    await assertFileExists(routeToHtmlPath(route));
  }

  for (const filePath of [
    'CNAME',
    '.nojekyll',
    'favicon.ico',
    'favicon.svg',
    'favicon-16x16.png',
    'favicon-32x32.png',
    'apple-touch-icon.png',
    'og-image.png',
    'robots.txt',
  ]) {
    await assertFileExists(path.join(distRoot, filePath));
  }
});

test('dist pages do not reference missing internal links or assets', async () => {
  const htmlFiles = await findHtmlFiles(distRoot);
  const failures: string[] = [];

  for (const htmlFile of htmlFiles) {
    const html = await readFile(htmlFile, 'utf8');
    const route = routeForHtmlFile(htmlFile);

    for (const url of extractReferencedUrls(html)) {
      const reference = resolveInternalReference(url, route);

      if (!reference) {
        continue;
      }

      const targetPath = await findDistTargetPath(reference.pathname);

      if (!targetPath) {
        failures.push(`${route} references missing ${reference.pathname}`);
        continue;
      }

      if (reference.hash && targetPath.endsWith('.html')) {
        const targetHtml = await readFile(targetPath, 'utf8');
        if (!hasFragmentTarget(targetHtml, reference.hash)) {
          failures.push(
            `${route} references missing fragment ${reference.pathname}${reference.hash}`,
          );
        }
      }
    }
  }

  assert.deepEqual(failures, []);
});

test('dist includes a sitemap with public page URLs', async () => {
  const sitemapIndex = await readFile(path.join(distRoot, 'sitemap-index.xml'), 'utf8');
  assert.match(sitemapIndex, /<loc>https:\/\/sethmaxwl\.com\/sitemap-0\.xml<\/loc>/);

  const sitemap = await readFile(path.join(distRoot, 'sitemap-0.xml'), 'utf8');

  for (const route of [
    '/',
    '/work/',
    '/work/starred-objects/',
    '/work/draft-pull-requests/',
    '/blog/',
    '/blog/mac-app-maintenance-on-tap/',
    '/contact/',
  ]) {
    assert.match(sitemap, new RegExp(`<loc>${origin}${route}</loc>`));
  }
});

test('dist exposes robots.txt with sitemap discovery', async () => {
  const robots = await readFile(path.join(distRoot, 'robots.txt'), 'utf8');

  assert.match(robots, /^User-agent: \*$/m);
  assert.match(robots, /^Allow: \/$/m);
  assert.match(robots, /^Sitemap: https:\/\/sethmaxwl\.com\/sitemap-index\.xml$/m);
});

test('dist pages include canonical URLs and social preview metadata', async () => {
  const pages = [
    {
      route: '/',
      title: 'Seth Maxwell | Software Engineer',
      description:
        'Software engineer at Atlassian working on Bitbucket Cloud, frontend architecture, and developer tools.',
      type: 'profile',
      image: `${origin}/og-image.png`,
    },
    {
      route: '/work/starred-objects/',
      title: 'Starred Objects | Seth Maxwell',
      description: 'Building an in-product bookmark to solve a common customer pain point.',
      type: 'article',
      image: `${origin}/images/starred-objects.png`,
    },
    {
      route: '/blog/mac-app-maintenance-on-tap/',
      title: 'Mac App Maintenance, on Tap | Seth Maxwell',
      description:
        'How I use Homebrew, a Brewfile, and a small upgrade script to keep my Mac environment up to date and easily manageable.',
      type: 'article',
      image: `${origin}/og-image.png`,
    },
    {
      route: '/contact/',
      title: 'Contact | Seth Maxwell',
      description: 'Contact Seth Maxwell.',
      type: 'website',
      image: `${origin}/og-image.png`,
    },
  ];

  for (const page of pages) {
    const html = await readFile(routeToHtmlPath(page.route), 'utf8');

    assert.equal(extractTitle(html), page.title);
    assert.equal(extractLinkHref(html, 'canonical'), `${origin}${page.route}`);
    assert.equal(extractMetaContent(html, 'description'), page.description);
    assert.equal(extractMetaContent(html, 'author'), 'Seth Maxwell');
    assert.equal(extractMetaContent(html, 'og:site_name'), 'Seth Maxwell');
    assert.equal(extractMetaContent(html, 'og:title'), page.title);
    assert.equal(extractMetaContent(html, 'og:description'), page.description);
    assert.equal(extractMetaContent(html, 'og:type'), page.type);
    assert.equal(extractMetaContent(html, 'og:url'), `${origin}${page.route}`);
    assert.equal(extractMetaContent(html, 'og:image'), page.image);
    assert.equal(extractMetaContent(html, 'twitter:card'), 'summary_large_image');
    assert.equal(extractMetaContent(html, 'twitter:title'), page.title);
    assert.equal(extractMetaContent(html, 'twitter:description'), page.description);
    assert.equal(extractMetaContent(html, 'twitter:image'), page.image);
  }
});

test('dist includes JSON-LD for the homepage profile and blog posts', async () => {
  const homeHtml = await readFile(routeToHtmlPath('/'), 'utf8');
  const homeStructuredData = extractJsonLdObjects(homeHtml);
  const profilePage = findStructuredData(homeStructuredData, 'ProfilePage');

  assert.equal(profilePage.url, `${origin}/`);
  assert.equal(profilePage.name, 'Seth Maxwell | Software Engineer');
  assert.equal(profilePage.mainEntity?.['@type'], 'Person');
  assert.equal(profilePage.mainEntity?.name, 'Seth Maxwell');
  assert.equal(profilePage.mainEntity?.url, `${origin}/`);
  assert.deepEqual(profilePage.mainEntity?.sameAs, [
    'https://github.com/sethmaxwl',
    'https://linkedin.com/in/sethmaxwl/',
  ]);

  const blogHtml = await readFile(routeToHtmlPath('/blog/mac-app-maintenance-on-tap/'), 'utf8');
  const blogStructuredData = extractJsonLdObjects(blogHtml);
  const blogPosting = findStructuredData(blogStructuredData, 'BlogPosting');

  assert.equal(blogPosting.url, `${origin}/blog/mac-app-maintenance-on-tap/`);
  assert.equal(blogPosting.headline, 'Mac App Maintenance, on Tap');
  assert.equal(blogPosting.datePublished, '2026-05-22T00:00:00.000Z');
  assert.equal(blogPosting.author?.['@type'], 'Person');
  assert.equal(blogPosting.author?.name, 'Seth Maxwell');
  assert.equal(blogPosting.author?.url, `${origin}/`);
});

test('dist serves fonts without third-party font hosts', async () => {
  const files = await findFiles(distRoot);
  const fontHostReferences: string[] = [];

  for (const filePath of files) {
    const contents = await readFile(filePath, 'utf8');
    if (/fonts\.(?:googleapis|gstatic)\.com/.test(contents)) {
      fontHostReferences.push(path.relative(distRoot, filePath));
    }
  }

  assert.deepEqual(fontHostReferences, []);
});

test('Brewfile examples render with Shiki highlighting', async () => {
  const html = await readFile(routeToHtmlPath('/blog/mac-app-maintenance-on-tap/'), 'utf8');

  assert.match(
    html,
    /<pre class="astro-code everforest-light"[^>]+data-language="brewfile"><code><span class="line"><span style="color:#[A-Fa-f0-9]{6}">cask <\/span>/,
  );
});

async function assertFileExists(filePath: string): Promise<void> {
  try {
    await access(filePath);
  } catch {
    assert.fail(`Missing ${path.relative(repoRoot, filePath)}`);
  }
}

async function contentRoutes(contentDirectory: string, routePrefix: string): Promise<string[]> {
  const absoluteDirectory = path.join(repoRoot, contentDirectory);
  const entries = await readdir(absoluteDirectory, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => `${routePrefix}${entry.name.replace(/\.md$/, '')}/`)
    .toSorted();
}

async function findHtmlFiles(directory: string): Promise<string[]> {
  return (await findFiles(directory)).filter((file) => file.endsWith('.html'));
}

async function findFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await findFiles(fullPath)));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files.toSorted();
}

function extractReferencedUrls(html: string): string[] {
  const urls: string[] = [];
  const attributePattern = /\s(?:href|src)=["']([^"']+)["']/gi;
  const srcsetPattern = /\ssrcset=["']([^"']+)["']/gi;

  for (const match of html.matchAll(attributePattern)) {
    urls.push(decodeHtmlAttribute(match[1]));
  }

  for (const match of html.matchAll(srcsetPattern)) {
    for (const candidate of decodeHtmlAttribute(match[1]).split(',')) {
      const [url] = candidate.trim().split(/\s+/);
      if (url) {
        urls.push(url);
      }
    }
  }

  return urls;
}

function decodeHtmlAttribute(value: string): string {
  return value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'").trim();
}

function resolveInternalReference(
  rawUrl: string,
  currentRoute: string,
): { pathname: string; hash: string } | undefined {
  if (!rawUrl || rawUrl.startsWith('data:') || rawUrl.startsWith('javascript:')) {
    return undefined;
  }

  const lowerUrl = rawUrl.toLowerCase();
  if (lowerUrl.startsWith('mailto:') || lowerUrl.startsWith('tel:')) {
    return undefined;
  }

  const currentUrl = new URL(currentRoute, origin);
  const resolvedUrl = new URL(rawUrl, currentUrl);

  if (resolvedUrl.origin !== origin) {
    return undefined;
  }

  return {
    pathname: decodeURIComponent(resolvedUrl.pathname),
    hash: resolvedUrl.hash,
  };
}

async function findDistTargetPath(pathname: string): Promise<string | undefined> {
  for (const candidate of distTargetCandidates(pathname)) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Try the next static routing shape.
    }
  }

  return undefined;
}

function distTargetCandidates(pathname: string): string[] {
  const relativePath = pathname.replace(/^\/+/, '');

  if (!relativePath || pathname.endsWith('/')) {
    return [path.join(distRoot, relativePath, 'index.html')];
  }

  if (path.extname(relativePath)) {
    return [path.join(distRoot, relativePath)];
  }

  return [
    path.join(distRoot, relativePath, 'index.html'),
    path.join(distRoot, `${relativePath}.html`),
  ];
}

function routeToHtmlPath(route: string): string {
  const relativePath = route.replace(/^\/+/, '');
  return path.join(distRoot, relativePath, 'index.html');
}

function routeForHtmlFile(htmlFile: string): string {
  const relativePath = path.relative(distRoot, htmlFile).split(path.sep).join('/');

  if (relativePath === 'index.html') {
    return '/';
  }

  if (relativePath.endsWith('/index.html')) {
    return `/${relativePath.slice(0, -'index.html'.length)}`;
  }

  return `/${relativePath.replace(/\.html$/, '')}`;
}

function hasFragmentTarget(html: string, hash: string): boolean {
  const id = decodeURIComponent(hash.slice(1));
  const escapedId = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\s(?:id|name)=["']${escapedId}["']`).test(html);
}

function extractTitle(html: string): string {
  const match = html.match(/<title>([^<]+)<\/title>/);
  assert.ok(match, 'Missing <title>');
  return decodeHtmlAttribute(match[1]);
}

function extractLinkHref(html: string, rel: string): string {
  const tag = findTagWithAttribute(html, 'link', 'rel', rel);
  assert.ok(tag, `Missing canonical link for ${rel}`);
  const href = extractAttributeValue(tag, 'href');
  assert.ok(href, `Missing href on ${tag}`);
  return href;
}

function extractMetaContent(html: string, nameOrProperty: string): string {
  const tag =
    findTagWithAttribute(html, 'meta', 'name', nameOrProperty, false) ??
    findTagWithAttribute(html, 'meta', 'property', nameOrProperty, false);
  assert.ok(tag, `Missing meta tag for ${nameOrProperty}`);

  const content = extractAttributeValue(tag, 'content');
  assert.ok(content, `Missing content on ${tag}`);
  return content;
}

function findTagWithAttribute(
  html: string,
  tagName: string,
  attributeName: string,
  attributeValue: string,
  failOnMissing = true,
): string | undefined {
  const tagPattern = new RegExp(`<${tagName}\\b[^>]*>`, 'gi');

  for (const match of html.matchAll(tagPattern)) {
    const tag = match[0];
    if (extractAttributeValue(tag, attributeName) === attributeValue) {
      return tag;
    }
  }

  if (failOnMissing) {
    assert.fail(`Missing <${tagName}> with ${attributeName}="${attributeValue}"`);
  }

  return undefined;
}

function extractAttributeValue(tag: string, attributeName: string): string | undefined {
  const escapedAttributeName = attributeName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = tag.match(new RegExp(`\\s${escapedAttributeName}=["']([^"']*)["']`, 'i'));
  return match ? decodeHtmlAttribute(match[1]) : undefined;
}

function extractJsonLdObjects(html: string): Record<string, any>[] {
  const scriptPattern =
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const objects: Record<string, any>[] = [];

  for (const match of html.matchAll(scriptPattern)) {
    const parsed = JSON.parse(match[1]);
    objects.push(...(Array.isArray(parsed) ? parsed : [parsed]));
  }

  return objects;
}

function findStructuredData(objects: Record<string, any>[], type: string): Record<string, any> {
  const object = objects.find((entry) => entry['@type'] === type);
  assert.ok(object, `Missing ${type} JSON-LD object`);
  return object;
}
