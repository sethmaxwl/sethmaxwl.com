# Config-Driven Content Ordering Design

## Goal

Move content presentation choices out of Markdown frontmatter and into `src/data/site.js`.

Work and blog entries should still live in Astro content collections, but list ordering and landing-page featured work should be controlled by central site configuration.

## Approach

Add explicit slug arrays to `site.js`:

- `site.content.workOrder` controls the `/work/` list order.
- `site.content.blogOrder` controls the `/blog/` list order.
- `site.home.featuredWork` controls which work entries appear on the landing page and in what order.

Pages will load content collections normally, then apply the configured slug lists. Items listed in config appear first in the configured order. Unlisted work items are appended alphabetically by title or id. Unlisted blog items are appended by newest date first, preserving the current default behavior for new posts.

## Content Model

Work frontmatter should keep content-specific metadata only:

- `title`
- `description`
- `thumbnail`
- optional `externalLink`

The `featured` and `order` fields should be removed from the work collection schema and existing work Markdown files.

Blog frontmatter keeps `title`, `description`, and `date`. Blog list ordering moves to `site.content.blogOrder`, with date as a fallback only for unlisted posts.

## Implementation Shape

Create a small utility module for ordering and selecting collection entries by id so pages avoid duplicating sorting logic.

The home page uses `site.home.featuredWork` directly, so the featured area is not tied to either work frontmatter or the full work index order.

## Testing

Add tests that:

- Verify `site.js` exposes work order, blog order, and home featured work slug lists.
- Verify the ordering utility returns configured entries first and appends unlisted entries by fallback sort.
- Verify selected featured entries follow the configured slug order and ignore missing ids.
- Verify work frontmatter no longer requires or contains `featured` or `order`.

