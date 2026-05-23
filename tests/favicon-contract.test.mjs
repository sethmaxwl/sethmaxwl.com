import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

function readPngSize(file) {
  const data = readFileSync(file);
  assert.equal(data.toString('ascii', 1, 4), 'PNG');

  return {
    width: data.readUInt32BE(16),
    height: data.readUInt32BE(20),
  };
}

function readIcoEntries(file) {
  const data = readFileSync(file);
  assert.equal(data.readUInt16LE(0), 0);
  assert.equal(data.readUInt16LE(2), 1);

  const count = data.readUInt16LE(4);

  return Array.from({ length: count }, (_, index) => {
    const offset = 6 + (index * 16);
    const width = data.readUInt8(offset) || 256;
    const height = data.readUInt8(offset + 1) || 256;

    return { width, height };
  });
}

test('base layout exposes favicon and browser theme metadata', () => {
  const layout = readFileSync('src/layouts/BaseLayout.astro', 'utf8');

  assert.match(layout, /<link rel="icon" type="image\/svg\+xml" href="\/favicon\.svg" \/>/);
  assert.match(layout, /<link rel="icon" type="image\/png" sizes="16x16" href="\/favicon-16x16\.png" \/>/);
  assert.match(layout, /<link rel="icon" type="image\/png" sizes="32x32" href="\/favicon-32x32\.png" \/>/);
  assert.match(layout, /<link rel="apple-touch-icon" sizes="180x180" href="\/apple-touch-icon\.png" \/>/);
  assert.match(layout, /<link rel="shortcut icon" href="\/favicon\.ico" \/>/);
  assert.match(layout, /<meta name="theme-color" content="#fdf8f7" \/>/);
});

test('favicon asset files exist with expected formats and dimensions', () => {
  const svg = readFileSync('public/favicon.svg', 'utf8');
  assert.match(svg, /<svg/);
  assert.match(svg, /#1c1b1b/);
  assert.match(svg, /#fdf8f7/);

  assert.equal(existsSync('public/favicon.ico'), true);
  assert.deepEqual(readPngSize('public/favicon-16x16.png'), { width: 16, height: 16 });
  assert.deepEqual(readPngSize('public/favicon-32x32.png'), { width: 32, height: 32 });
  assert.deepEqual(readPngSize('public/apple-touch-icon.png'), { width: 180, height: 180 });

  const icoSizes = readIcoEntries('public/favicon.ico')
    .map(({ width, height }) => `${width}x${height}`)
    .sort();
  assert.deepEqual(icoSizes, ['16x16', '32x32']);
});
