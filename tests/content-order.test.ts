import test from 'node:test';
import assert from 'node:assert/strict';
import {
  compareByNewestDate,
  compareByTitle,
  orderEntriesById,
  selectEntriesById,
} from '../src/utils/contentOrder.ts';

const entries = [
  {
    id: 'beta',
    data: {
      title: 'Beta',
      date: new Date('2026-05-20T00:00:00.000Z'),
    },
  },
  {
    id: 'alpha',
    data: {
      title: 'Alpha',
      date: new Date('2026-05-22T00:00:00.000Z'),
    },
  },
  {
    id: 'gamma',
    data: {
      title: 'Gamma',
      date: new Date('2026-05-21T00:00:00.000Z'),
    },
  },
];

test('compareByTitle falls back to id when titles match', () => {
  const duplicateTitleEntries = [
    { id: 'second', data: { title: 'Same title' } },
    { id: 'first', data: { title: 'Same title' } },
  ];

  assert.deepEqual(
    duplicateTitleEntries.toSorted(compareByTitle).map((entry) => entry.id),
    ['first', 'second'],
  );
});

test('orderEntriesById puts configured entries first and sorts remaining entries by fallback', () => {
  const ordered = orderEntriesById(entries, ['gamma'], compareByTitle);

  assert.deepEqual(
    ordered.map((entry) => entry.id),
    ['gamma', 'alpha', 'beta'],
  );
});

test('compareByNewestDate sorts newest entries first and falls back to title order', () => {
  const ordered = [
    ...entries,
    { id: 'delta', data: { title: 'Delta', date: new Date('2026-05-22T00:00:00.000Z') } },
  ].toSorted(compareByNewestDate);

  assert.deepEqual(
    ordered.map((entry) => entry.id),
    ['alpha', 'delta', 'gamma', 'beta'],
  );
});

test('selectEntriesById returns configured entries in order and ignores missing ids', () => {
  const selected = selectEntriesById(entries, ['gamma', 'missing', 'alpha']);

  assert.deepEqual(
    selected.map((entry) => entry.id),
    ['gamma', 'alpha'],
  );
});
