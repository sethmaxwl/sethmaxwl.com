import test from 'node:test';
import assert from 'node:assert/strict';
import { formatReadingTime, readingTimeMinutes } from '../src/utils/readingTime.ts';

test('readingTimeMinutes rounds to the nearest minute at 230 words per minute', () => {
  assert.equal(readingTimeMinutes('word '.repeat(460)), 2);
  assert.equal(readingTimeMinutes('word '.repeat(800)), 3);
});

test('readingTimeMinutes never reports less than one minute', () => {
  assert.equal(readingTimeMinutes(''), 1);
  assert.equal(readingTimeMinutes('A short note.'), 1);
});

test('readingTimeMinutes ignores fenced code blocks', () => {
  const code = ['```ruby', 'brew "git"\n'.repeat(1000), '```'].join('\n');

  assert.equal(readingTimeMinutes(`${'word '.repeat(460)}\n\n${code}`), 2);
});

test('formatReadingTime renders a compact label', () => {
  assert.equal(formatReadingTime('word '.repeat(460)), '2 min read');
});
