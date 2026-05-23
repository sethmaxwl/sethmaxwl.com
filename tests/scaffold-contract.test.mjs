import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

test('project scaffold exposes Astro scripts and config files', () => {
  assert.equal(existsSync('package.json'), true);
  assert.equal(existsSync('astro.config.mjs'), true);
  assert.equal(existsSync('tsconfig.json'), true);
  assert.equal(existsSync('src/env.d.ts'), true);
  assert.equal(existsSync('src/styles/global.css'), true);

  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  assert.equal(pkg.scripts.dev, 'astro dev --host 0.0.0.0');
  assert.equal(pkg.scripts.build, 'astro check && astro build');
  assert.equal(pkg.scripts.check, 'astro check');
  assert.equal(pkg.scripts.test, 'node --test tests/*.test.mjs');
  assert.ok(pkg.dependencies.astro);
  assert.ok(pkg.devDependencies.typescript);
});

test('global CSS contains the approved warm editorial tokens', () => {
  const css = readFileSync('src/styles/global.css', 'utf8');
  assert.match(css, /--color-surface: #fdf8f7;/);
  assert.match(css, /--color-ink: #1c1b1b;/);
  assert.match(css, /--font-display: 'Newsreader'/);
  assert.match(css, /border-radius: 0/);
});

test('page content uses one shared article-width container rail', () => {
  const css = readFileSync('src/styles/global.css', 'utf8');
  const workDetail = readFileSync('src/pages/work/[slug].astro', 'utf8');
  const blogDetail = readFileSync('src/pages/blog/[slug].astro', 'utf8');

  assert.match(css, /--container: 820px;/);
  assert.match(css, /\.container\s*\{[\s\S]*width:\s*min\(100% - calc\(var\(--margin-mobile\) \* 2\), var\(--container\)\)/);
  assert.match(css, /@media \(min-width: 760px\)[\s\S]*\.container\s*\{[\s\S]*width:\s*min\(100% - calc\(var\(--margin-desktop\) \* 2\), var\(--container\)\)/);
  assert.doesNotMatch(workDetail, /\.case-body\s*\{[\s\S]*max-width:/);
  assert.doesNotMatch(blogDetail, /\.blog-article\s*\{[\s\S]*max-width:/);
});

test('rendered markdown code blocks use site-themed Shiki highlighting', () => {
  const config = readFileSync('astro.config.mjs', 'utf8');
  const css = readFileSync('src/styles/global.css', 'utf8');
  const article = readFileSync('src/content/blog/mac-app-maintenance-on-tap.md', 'utf8');

  assert.match(config, /function remarkBrewfileCodeLanguage/);
  assert.match(config, /remarkPlugins:\s*\[remarkBrewfileCodeLanguage\]/);
  assert.match(config, /node\.lang\s*=\s*'brewfile'/);
  assert.match(config, /markdown:\s*\{/);
  assert.match(config, /shikiConfig:\s*\{/);
  assert.match(config, /theme:\s*'rose-pine-dawn'/);
  assert.match(config, /brewfile:\s*'ruby'/);
  assert.match(article, /cask "visual-studio-code"/);

  assert.match(css, /--color-code-surface:\s*#f5eeed;/);
  assert.match(css, /\.markdown-content :where\(pre\)/);
  assert.match(css, /\.markdown-content :where\(pre\)\s*\{[\s\S]*background:\s*var\(--color-code-surface\)/);
  assert.match(css, /\.markdown-content :where\(pre\)\s*\{[\s\S]*overflow-x:\s*auto/);
  assert.match(css, /\.markdown-content :where\(pre code\)\s*\{[\s\S]*font-size:\s*inherit/);
  assert.match(css, /\.markdown-content :not\(pre\) > code/);
  assert.match(css, /\.markdown-content :not\(pre\) > code\s*\{[\s\S]*white-space:\s*nowrap/);
  assert.doesNotMatch(css, /\.markdown-content :not\(pre\) > code\s*\{[\s\S]*white-space:\s*break-spaces/);
});

test('rendered markdown blockquotes use an oversized quote ornament', () => {
  const css = readFileSync('src/styles/global.css', 'utf8');

  assert.match(css, /\.markdown-content :where\(blockquote\)/);
  assert.match(css, /\.markdown-content :where\(blockquote\)::before\s*\{[\s\S]*content:\s*'"';/);
  assert.match(css, /\.markdown-content :where\(blockquote\)::before\s*\{[\s\S]*font-size:\s*clamp\(4rem, 10vw, 7rem\)/);
  assert.match(css, /\.markdown-content :where\(blockquote > :first-child\)\s*\{[\s\S]*margin-top:\s*0/);
  assert.match(css, /\.markdown-content :where\(blockquote > :last-child\)\s*\{[\s\S]*margin-bottom:\s*0/);
});
