import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

function frontmatter(file) {
  const text = readFileSync(file, 'utf8');
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  assert.ok(match, `${file} has frontmatter`);
  return match[1];
}

test('Astro content config declares blog and work collections', () => {
  assert.equal(existsSync('src/content.config.ts'), true);
  const config = readFileSync('src/content.config.ts', 'utf8');
  assert.match(config, /defineCollection/);
  assert.match(config, /glob/);
  assert.match(config, /blog/);
  assert.match(config, /work/);
});

test('work entries provide case-study metadata', () => {
  const dir = 'src/content/work';
  const files = readdirSync(dir).filter((file) => file.endsWith('.md'));
  assert.ok(files.length > 0);

  for (const file of files) {
    const fm = frontmatter(join(dir, file));
    for (const key of ['title:', 'description:', 'thumbnail:']) {
      assert.match(fm, new RegExp(key.replace(':', '')));
    }
    assert.doesNotMatch(fm, /^featured:/m);
    assert.doesNotMatch(fm, /^order:/m);
    assert.match(fm, /^\s+src:\s*".+"/m);
    assert.match(fm, /^\s+alt:\s*".+"/m);
    assert.doesNotMatch(fm, /^visual:/m);

    const thumbnailSrc = fm.match(/^\s+src:\s*"([^"]+)"/m)?.[1];
    assert.ok(thumbnailSrc, `${file} has a thumbnail src`);
    assert.equal(existsSync(join('public', thumbnailSrc.replace(/^\//, ''))), true);

    for (const key of ['role:', 'timeline:', 'outcome:', 'stack:']) {
      assert.doesNotMatch(fm, new RegExp(`^${key}`, 'm'));
    }
  }
});

test('work entries require thumbnail image metadata', () => {
  const config = readFileSync('src/content.config.ts', 'utf8');
  const thumbnailSection = config.slice(config.indexOf('thumbnail:'), config.indexOf('externalLink:'));

  assert.match(thumbnailSection, /thumbnail:\s*z\s*\.\s*object/);
  assert.match(thumbnailSection, /src:\s*z\.string\(\)/);
  assert.match(thumbnailSection, /alt:\s*z\.string\(\)/);
  assert.doesNotMatch(thumbnailSection, /\.optional\(\)/);
});

test('work collection schema keeps ordering concerns out of frontmatter', () => {
  const config = readFileSync('src/content.config.ts', 'utf8');
  const workSection = config.slice(config.indexOf('const work'), config.indexOf('const blog'));

  assert.doesNotMatch(workSection, /featured:/);
  assert.doesNotMatch(workSection, /order:/);
});

test('work entries may provide optional community post metadata', () => {
  const config = readFileSync('src/content.config.ts', 'utf8');

  assert.match(config, /externalLink:\s*z\s*\.\s*object/);
  assert.match(config, /externalLink:[\s\S]*label:\s*z\.string\(\)\.min\(1\)/);
  assert.match(config, /externalLink:[\s\S]*href:\s*z\.url\(\)/);
  assert.match(config, /externalLink:[\s\S]*\.optional\(\)/);
});

test('blog entries provide routable article metadata', () => {
  const dir = 'src/content/blog';
  const files = readdirSync(dir).filter((file) => file.endsWith('.md'));
  assert.equal(files.length, 1);

  const fm = frontmatter(join(dir, files[0]));
  for (const key of ['title:', 'description:', 'date:']) {
    assert.match(fm, new RegExp(key.replace(':', '')));
  }
});
