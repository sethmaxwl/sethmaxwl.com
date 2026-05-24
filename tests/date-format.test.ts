import test from 'node:test';
import assert from 'node:assert/strict';
import { formatContentDate } from '../src/utils/formatDate.ts';

test('formatContentDate renders long US dates in UTC', () => {
  const midnightUtc = new Date('2026-05-20T00:00:00.000Z');

  assert.equal(formatContentDate(midnightUtc), 'May 20, 2026');
});

test('formatContentDate does not shift late-night UTC dates into the next day', () => {
  const lateNightUtc = new Date('2026-12-31T23:30:00.000Z');

  assert.equal(formatContentDate(lateNightUtc), 'December 31, 2026');
});
