# Consistent Page Margins Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every page and article body use one shared content rail.

**Architecture:** The global `.container` class remains the only horizontal page layout primitive. Its max width changes to the current article-style rail, and page-specific article width overrides are removed so all top-level sections inherit the same margin behavior.

**Tech Stack:** Astro, scoped Astro CSS, global CSS, Node test runner.

---

## File Structure

- Modify `tests/scaffold-contract.test.mjs`: add a focused layout contract test that protects the shared container width and prevents article-specific max-width overrides from returning.
- Modify `src/styles/global.css`: change `--container` from `1280px` to `820px`.
- Modify `src/pages/work/[slug].astro`: remove the `.case-body` max-width override so it uses `.container`.
- Modify `src/pages/journal/[slug].astro`: remove the `.journal-article` max-width override so it uses `.container`.

### Task 1: Shared Container Layout Contract

**Files:**
- Modify: `tests/scaffold-contract.test.mjs`
- Modify: `src/styles/global.css`
- Modify: `src/pages/work/[slug].astro`
- Modify: `src/pages/journal/[slug].astro`

- [x] **Step 1: Write the failing test**

Add this test to `tests/scaffold-contract.test.mjs` after the existing global CSS token test:

```js
test('page content uses one shared article-width container rail', () => {
  const css = readFileSync('src/styles/global.css', 'utf8');
  const workDetail = readFileSync('src/pages/work/[slug].astro', 'utf8');
  const journalDetail = readFileSync('src/pages/journal/[slug].astro', 'utf8');

  assert.match(css, /--container: 820px;/);
  assert.match(css, /\.container\s*\{[\s\S]*width:\s*min\(100% - calc\(var\(--margin-mobile\) \* 2\), var\(--container\)\)/);
  assert.match(css, /@media \(min-width: 760px\)[\s\S]*\.container\s*\{[\s\S]*width:\s*min\(100% - calc\(var\(--margin-desktop\) \* 2\), var\(--container\)\)/);
  assert.doesNotMatch(workDetail, /\.case-body\s*\{[\s\S]*max-width:/);
  assert.doesNotMatch(journalDetail, /\.journal-article\s*\{[\s\S]*max-width:/);
});
```

- [x] **Step 2: Run the focused test to verify it fails**

Run:

```bash
npm test -- tests/scaffold-contract.test.mjs
```

Expected: FAIL because `src/styles/global.css` still has `--container: 1280px;` and the detail pages still define article-specific max widths.

- [x] **Step 3: Update the shared container token**

In `src/styles/global.css`, change:

```css
--container: 1280px;
```

to:

```css
--container: 820px;
```

- [x] **Step 4: Remove the work detail article width override**

In `src/pages/work/[slug].astro`, change:

```css
.case-body {
  max-width: 760px;
  padding-block: clamp(4rem, 8vw, 7rem);
}
```

to:

```css
.case-body {
  padding-block: clamp(4rem, 8vw, 7rem);
}
```

- [x] **Step 5: Remove the journal detail article width override**

In `src/pages/journal/[slug].astro`, change:

```css
.journal-article {
  max-width: 820px;
  padding-block: clamp(5rem, 12vw, 9rem);
}
```

to:

```css
.journal-article {
  padding-block: clamp(5rem, 12vw, 9rem);
}
```

- [x] **Step 6: Run the focused test to verify it passes**

Run:

```bash
npm test -- tests/scaffold-contract.test.mjs
```

Expected: PASS for the shared container layout contract and the rest of the scaffold contract tests.

- [x] **Step 7: Run full verification**

Run:

```bash
npm test
npm run build
```

Expected: all Node tests pass, then Astro check and Astro build complete without errors.

- [ ] **Step 8: Commit the implementation**

Run:

```bash
git add tests/scaffold-contract.test.mjs src/styles/global.css src/pages/work/[slug].astro src/pages/journal/[slug].astro docs/superpowers/plans/2026-05-22-consistent-page-margins.md
git commit -m "fix: use shared page content margins"
```
