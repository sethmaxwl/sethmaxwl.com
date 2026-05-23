# Community Post Link Design

## Context

Work entries are Astro content collection Markdown files under `src/content/work/`. Their metadata is validated in `src/content.config.ts` and rendered on the work index through `ProjectFeature.astro` and on detail pages through `src/pages/work/[slug].astro`.

Some projects should be able to link to a related community post without requiring every project entry to have one.

## Goal

Add one optional community post link to project entries. The link should be structured enough to provide clear display text and safe external-link behavior.

## Content Model

Work entries may include an optional `externalLink` object in frontmatter:

```yaml
externalLink:
  label: "Community post"
  href: "https://example.com/community/post"
```

`label` and `href` are required when `externalLink` is present. Existing entries without `externalLink` remain valid.

## Rendering

Project detail pages should render the optional community post link near the existing project metadata. The link should:

- Use the supplied `label` as visible text.
- Point to `externalLink.href`.
- Open in a new tab with `target="_blank"`.
- Include `rel="noopener noreferrer"`.

The work index should continue using the existing primary "Read Project" link only, keeping index cards focused on the case study.

## Testing

Tests should cover:

- The content schema defines optional `externalLink` metadata with `label` and `href`.
- The project detail page conditionally renders the community post link with safe external-link attributes.

The implementation should follow the existing contract-test style in `tests/content-contract.test.mjs` and `tests/route-contract.test.mjs`.
