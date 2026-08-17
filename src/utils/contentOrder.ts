export interface ContentEntry {
  id: string;
  data: {
    title?: string;
    date?: Date;
    sortOrder?: number;
    featuredRank?: number;
  };
}

type RankField = 'sortOrder' | 'featuredRank';

function compareById<Entry extends ContentEntry>(a: Entry, b: Entry): number {
  return a.id.localeCompare(b.id);
}

export function compareByTitle<Entry extends ContentEntry>(a: Entry, b: Entry): number {
  const titleA = a.data.title ?? a.id;
  const titleB = b.data.title ?? b.id;

  return titleA.localeCompare(titleB) || compareById(a, b);
}

export function compareByNewestDate<Entry extends ContentEntry>(a: Entry, b: Entry): number {
  const dateA = a.data.date?.valueOf() ?? 0;
  const dateB = b.data.date?.valueOf() ?? 0;

  return dateB - dateA || compareByTitle(a, b);
}

export function assertUniqueRanks<Entry extends ContentEntry>(
  entries: readonly Entry[],
  field: RankField,
): void {
  const entryByRank = new Map<number, string>();

  for (const entry of entries) {
    const rank = entry.data[field];

    if (rank === undefined) {
      continue;
    }

    const existingEntryId = entryByRank.get(rank);

    if (existingEntryId) {
      throw new Error(
        `Duplicate ${field} value ${rank} for content entries "${existingEntryId}" and "${entry.id}".`,
      );
    }

    entryByRank.set(rank, entry.id);
  }
}

export function orderEntriesByRank<Entry extends ContentEntry>(
  entries: readonly Entry[],
  field: RankField,
  fallbackSort: (a: Entry, b: Entry) => number = compareById,
): Entry[] {
  assertUniqueRanks(entries, field);

  return entries.toSorted((a, b) => {
    const rankA = a.data[field];
    const rankB = b.data[field];

    if (rankA !== undefined && rankB !== undefined) {
      return rankA - rankB || fallbackSort(a, b);
    }

    if (rankA !== undefined) {
      return -1;
    }

    if (rankB !== undefined) {
      return 1;
    }

    return fallbackSort(a, b);
  });
}

export function selectEntriesByRank<Entry extends ContentEntry>(
  entries: readonly Entry[],
  field: RankField,
  fallbackSort: (a: Entry, b: Entry) => number = compareById,
): Entry[] {
  return orderEntriesByRank(
    entries.filter((entry) => entry.data[field] !== undefined),
    field,
    fallbackSort,
  );
}
