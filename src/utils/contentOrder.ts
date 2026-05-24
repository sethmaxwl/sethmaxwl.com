export interface ContentEntry {
  id: string;
  data: {
    title?: string;
    date?: Date;
  };
}

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

export function orderEntriesById<Entry extends ContentEntry>(
  entries: readonly Entry[],
  orderedIds: readonly string[],
  fallbackSort: (a: Entry, b: Entry) => number = compareById,
): Entry[] {
  const orderById = new Map(orderedIds.map((id, index) => [id, index]));
  const orderedEntries: Entry[] = [];
  const unorderedEntries: Entry[] = [];

  for (const entry of entries) {
    if (orderById.has(entry.id)) {
      orderedEntries.push(entry);
    } else {
      unorderedEntries.push(entry);
    }
  }

  return [
    ...orderedEntries.sort((a, b) => orderById.get(a.id)! - orderById.get(b.id)!),
    ...unorderedEntries.sort(fallbackSort),
  ];
}

export function selectEntriesById<Entry extends ContentEntry>(
  entries: readonly Entry[],
  selectedIds: readonly string[],
): Entry[] {
  const entriesById = new Map(entries.map((entry) => [entry.id, entry]));
  const selectedEntries: Entry[] = [];

  for (const id of selectedIds) {
    const entry = entriesById.get(id);

    if (entry) {
      selectedEntries.push(entry);
    }
  }

  return selectedEntries;
}
