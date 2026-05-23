# Config-Driven Content Ordering Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make blog order, work order, and landing-page featured work configurable from `src/data/site.js`.

**Architecture:** Astro content collections remain the source for entry content and metadata. `src/data/site.js` owns presentation ordering through slug arrays, and a focused utility applies those arrays to content collection entries. Pages import the config and utility rather than sorting from frontmatter.

**Tech Stack:** Astro 6, Node test runner, JavaScript modules.

---

### Task 1: Add Failing Config And Ordering Tests

**Files:**
- Modify: `tests/site-data.test.mjs`
- Modify: `tests/content-contract.test.mjs`
- Create: `tests/content-order.test.mjs`

- [x] **Step 1: Extend site data tests**

Add assertions that `site.content.workOrder`, `site.content.blogOrder`, and `site.home.featuredWork` exist and contain known slugs.

- [x] **Step 2: Update content frontmatter tests**

Change the work metadata test so `featured` and `order` are not required and are asserted absent.

- [x] **Step 3: Add utility behavior tests**

Create tests for configured ordering, fallback ordering, and configured selection by id.

- [x] **Step 4: Run focused tests to verify failure**

Run: `node --test tests/site-data.test.mjs tests/content-contract.test.mjs tests/content-order.test.mjs`

Expected: FAIL because site config fields and `src/utils/contentOrder.js` do not exist yet.

### Task 2: Implement Site Config And Utility

**Files:**
- Modify: `src/data/site.js`
- Create: `src/utils/contentOrder.js`

- [x] **Step 1: Add config arrays**

Add `site.content.workOrder`, `site.content.blogOrder`, and `site.home.featuredWork`.

- [x] **Step 2: Add ordering helpers**

Implement `orderEntriesById`, `selectEntriesById`, `compareByTitle`, and `compareByNewestDate`.

- [x] **Step 3: Run focused utility and site tests**

Run: `node --test tests/site-data.test.mjs tests/content-order.test.mjs`

Expected: PASS.

### Task 3: Wire Pages And Remove Frontmatter Ordering

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/pages/work/index.astro`
- Modify: `src/pages/blog/index.astro`
- Modify: `src/content.config.ts`
- Modify: `src/content/work/draft-pull-requests.md`
- Modify: `src/content/work/starred-objects.md`

- [x] **Step 1: Update pages**

Use `orderEntriesById` on work and blog index pages, and `selectEntriesById` for landing-page featured work.

- [x] **Step 2: Update content schema**

Remove `featured` and `order` from the work collection schema.

- [x] **Step 3: Update work Markdown frontmatter**

Remove `featured` and `order` from existing work entries.

- [x] **Step 4: Run all tests and build**

Run: `npm test`

Expected: PASS.

Run: `npm run build`

Expected: PASS.
