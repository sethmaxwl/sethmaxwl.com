import test from 'node:test';
import assert from 'node:assert/strict';
import { formatContentDate } from '../src/utils/formatDate.js';

test('formats content dates without shifting calendar day by timezone', () => {
  const date = new Date('2026-05-20T00:00:00.000Z');
  assert.equal(formatContentDate(date), 'May 20, 2026');
});
