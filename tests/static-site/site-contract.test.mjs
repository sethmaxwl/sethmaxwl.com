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
  ]) {
    await assertFileExists(path.join(distRoot, filePath));
  }
});

test('dist pages do not reference missing internal links or assets', async () => {
  const htmlFiles = await findHtmlFiles(distRoot);
  const failures = [];

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

async function assertFileExists(filePath) {
  try {
    await access(filePath);
  } catch {
    assert.fail(`Missing ${path.relative(repoRoot, filePath)}`);
  }
}

async function contentRoutes(contentDirectory, routePrefix) {
  const absoluteDirectory = path.join(repoRoot, contentDirectory);
  const entries = await readdir(absoluteDirectory, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => `${routePrefix}${entry.name.replace(/\.md$/, '')}/`)
    .toSorted();
}

async function findHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await findHtmlFiles(fullPath)));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }

  return files.toSorted();
}

function extractReferencedUrls(html) {
  const urls = [];
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

function decodeHtmlAttribute(value) {
  return value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'").trim();
}

function resolveInternalReference(rawUrl, currentRoute) {
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

async function findDistTargetPath(pathname) {
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

function distTargetCandidates(pathname) {
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

function routeToHtmlPath(route) {
  const relativePath = route.replace(/^\/+/, '');
  return path.join(distRoot, relativePath, 'index.html');
}

function routeForHtmlFile(htmlFile) {
  const relativePath = path.relative(distRoot, htmlFile).split(path.sep).join('/');

  if (relativePath === 'index.html') {
    return '/';
  }

  if (relativePath.endsWith('/index.html')) {
    return `/${relativePath.slice(0, -'index.html'.length)}`;
  }

  return `/${relativePath.replace(/\.html$/, '')}`;
}

function hasFragmentTarget(html, hash) {
  const id = decodeURIComponent(hash.slice(1));
  const escapedId = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\s(?:id|name)=["']${escapedId}["']`).test(html);
}
