import test from 'node:test';
import assert from 'node:assert/strict';
import {
  compareByNewestDate,
  compareByTitle,
  orderEntriesById,
  selectEntriesById,
} from '../src/utils/contentOrder.js';

const entries = [
  {
    id: 'beta',
    data: {
      title: 'Beta',
      date: new Date('2026-05-20'),
    },
  },
  {
    id: 'alpha',
    data: {
      title: 'Alpha',
      date: new Date('2026-05-22'),
    },
  },
  {
    id: 'gamma',
    data: {
      title: 'Gamma',
      date: new Date('2026-05-21'),
    },
  },
];

test('orderEntriesById puts configured entries first and appends title-sorted unlisted entries', () => {
  const ordered = orderEntriesById(entries, ['gamma'], compareByTitle);

  assert.deepEqual(ordered.map((entry) => entry.id), ['gamma', 'alpha', 'beta']);
});

test('orderEntriesById appends unlisted blog entries by newest date when requested', () => {
  const ordered = orderEntriesById(entries, ['beta'], compareByNewestDate);

  assert.deepEqual(ordered.map((entry) => entry.id), ['beta', 'alpha', 'gamma']);
});

test('selectEntriesById returns configured entries in order and ignores missing ids', () => {
  const selected = selectEntriesById(entries, ['gamma', 'missing', 'alpha']);

  assert.deepEqual(selected.map((entry) => entry.id), ['gamma', 'alpha']);
});
