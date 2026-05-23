/**
 * @typedef {{
 *   id: string;
 *   data: {
 *     title?: string;
 *     date?: Date;
 *   };
 * }} ContentEntry
 */

/**
 * @template {ContentEntry} Entry
 * @param {Entry} a
 * @param {Entry} b
 */
function compareById(a, b) {
  return a.id.localeCompare(b.id);
}

/**
 * @template {ContentEntry} Entry
 * @param {Entry} a
 * @param {Entry} b
 */
export function compareByTitle(a, b) {
  const titleA = a.data.title ?? a.id;
  const titleB = b.data.title ?? b.id;

  return titleA.localeCompare(titleB) || compareById(a, b);
}

/**
 * @template {ContentEntry} Entry
 * @param {Entry} a
 * @param {Entry} b
 */
export function compareByNewestDate(a, b) {
  const dateA = a.data.date?.valueOf() ?? 0;
  const dateB = b.data.date?.valueOf() ?? 0;

  return dateB - dateA || compareByTitle(a, b);
}

/**
 * @template {ContentEntry} Entry
 * @param {Entry[]} entries
 * @param {string[]} orderedIds
 * @param {(a: Entry, b: Entry) => number} [fallbackSort]
 * @returns {Entry[]}
 */
export function orderEntriesById(entries, orderedIds, fallbackSort = compareById) {
  const orderById = new Map(orderedIds.map((id, index) => [id, index]));
  /** @type {Entry[]} */
  const orderedEntries = [];
  /** @type {Entry[]} */
  const unorderedEntries = [];

  for (const entry of entries) {
    if (orderById.has(entry.id)) {
      orderedEntries.push(entry);
    } else {
      unorderedEntries.push(entry);
    }
  }

  return [
    ...orderedEntries.sort((a, b) => orderById.get(a.id) - orderById.get(b.id)),
    ...unorderedEntries.sort(fallbackSort),
  ];
}

/**
 * @template {ContentEntry} Entry
 * @param {Entry[]} entries
 * @param {string[]} selectedIds
 * @returns {Entry[]}
 */
export function selectEntriesById(entries, selectedIds) {
  const entriesById = new Map(entries.map((entry) => [entry.id, entry]));
  /** @type {Entry[]} */
  const selectedEntries = [];

  for (const id of selectedIds) {
    const entry = entriesById.get(id);

    if (entry) {
      selectedEntries.push(entry);
    }
  }

  return selectedEntries;
}
