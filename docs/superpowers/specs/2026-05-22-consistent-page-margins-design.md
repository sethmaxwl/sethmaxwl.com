# Consistent Page Margins Design

Date: 2026-05-22

## Goal

Make page content margins consistent across the site by using one shared container rail everywhere.

The target rail should match the current article-body reading width, so top-level pages, article bodies, header, footer, work pages, journal pages, and contact content all align to the same left and right edges.

## Current State

The site already has a global `.container` class in `src/styles/global.css`, but it is currently wide:

- `--container: 1280px`
- `--margin-desktop: 64px`
- `--margin-mobile: 20px`

Some article surfaces narrow themselves independently:

- Work detail body: `.case-body { max-width: 760px; }`
- Journal article: `.journal-article { max-width: 820px; }`

This creates different content rails between page-level sections and article-level sections.

## Chosen Approach

Use the global `.container` class as the single page content rail.

Set the shared container max width to the current article-body feel, using `820px` as the site-wide max width. Keep the mobile side margin at `20px`.

Remove page-specific container width overrides that compete with the shared rail, especially article body max widths.

## Behavior

- Header and footer align with page content.
- Home, work index, project detail, journal index, journal article, and contact pages use the same horizontal rail.
- Article bodies use the same margins as the rest of the page.
- Mobile pages keep the existing compact `20px` side margin.
- Vertical spacing, typography, and component internals remain unchanged unless a width override is directly causing margin inconsistency.

## Implementation Notes

- Update `src/styles/global.css` so `--container` is `820px`.
- Remove `.case-body` and `.journal-article` max-width rules that override `.container`.
- Keep `.container` as the public layout primitive rather than adding a second content wrapper.
- Avoid unrelated visual redesigns.

## Verification

- Add or update a focused contract test that asserts the shared container width and the absence of article-specific max-width overrides.
- Run the test suite.
- Run the production build.
- Visually inspect representative pages if a local server is used:
  - `/`
  - `/work/`
  - a `/work/:slug/` page
  - `/journal/`
  - a `/journal/:slug/` page
  - `/contact/`
