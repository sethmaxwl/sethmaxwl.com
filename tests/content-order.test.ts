import test from 'node:test';
import assert from 'node:assert/strict';
import {
  assertUniqueRanks,
  compareByNewestDate,
  compareByTitle,
  orderEntriesByRank,
  selectEntriesByRank,
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
      sortOrder: 2,
      featuredRank: 2,
    },
  },
  {
    id: 'gamma',
    data: {
      title: 'Gamma',
      date: new Date('2026-05-21T00:00:00.000Z'),
      sortOrder: 1,
      featuredRank: 1,
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

test('orderEntriesByRank puts ranked entries first and sorts remaining entries by fallback', () => {
  const ordered = orderEntriesByRank(entries, 'sortOrder', compareByTitle);

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

test('selectEntriesByRank returns featured entries in rank order', () => {
  const selected = selectEntriesByRank(entries, 'featuredRank');

  assert.deepEqual(
    selected.map((entry) => entry.id),
    ['gamma', 'alpha'],
  );
});

test('assertUniqueRanks rejects duplicate ranks that would make curation ambiguous', () => {
  assert.throws(
    () =>
      assertUniqueRanks(
        [
          { id: 'first', data: { sortOrder: 1 } },
          { id: 'second', data: { sortOrder: 1 } },
        ],
        'sortOrder',
      ),
    /Duplicate sortOrder value 1/,
  );
});
