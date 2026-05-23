# Personal Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a multi-page Astro personal website for Seth Maxwell using the approved Stitch warm editorial design and Markdown-driven journal routing.

**Architecture:** Astro handles static routing, Markdown content collections, and page generation. Shared layouts and components own the editorial frame, while `src/content/` and `src/data/` keep resume, work, and journal content structured and reusable.

**Tech Stack:** Astro, TypeScript, Markdown content collections, CSS custom properties, Node test runner.

---

## File Structure

Create this structure:

```text
.
  astro.config.mjs
  package.json
  tsconfig.json
  tests/
    content-contract.test.mjs
    route-contract.test.mjs
    scaffold-contract.test.mjs
    site-data.test.mjs
  public/
    resume/
      Seth-Maxwell-Resume.pdf
  src/
    components/
      EditorialVisual.astro
      JournalList.astro
      PageIntro.astro
      ProjectFeature.astro
      ResumeSection.astro
      SiteFooter.astro
      SiteHeader.astro
    content/
      config.ts
      journal/
        getting-started.md
      work/
        bitbucket-navigation.md
        draft-pull-requests.md
        purdue-inventory-system.md
        repository-settings-platform.md
    data/
      resume.js
      site.js
    layouts/
      BaseLayout.astro
    pages/
      about.astro
      contact.astro
      index.astro
      journal/
        [slug].astro
        index.astro
      resume.astro
      work/
        [slug].astro
        index.astro
    styles/
      global.css
    env.d.ts
```

Boundary decisions:

- `src/content/work/*.md` owns case-study content and metadata.
- `src/content/journal/*.md` owns journal articles. Adding a file here must generate a page and index entry.
- `src/data/site.js` owns navigation, contact, and site metadata.
- `src/data/resume.js` owns resume sections rendered by `/resume/` and summarized by `/about/`.
- `src/layouts/BaseLayout.astro` owns document metadata, global CSS import, and the shared header/footer frame.
- Components are presentation-only and receive data through props.

---

### Task 1: Astro Scaffold And Design Tokens

**Files:**
- Create: `tests/scaffold-contract.test.mjs`
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `.gitignore`
- Create: `src/env.d.ts`
- Create: `src/styles/global.css`

- [ ] **Step 1: Write the failing scaffold contract test**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

test('project scaffold exposes Astro scripts and config files', () => {
  assert.equal(existsSync('package.json'), true);
  assert.equal(existsSync('astro.config.mjs'), true);
  assert.equal(existsSync('tsconfig.json'), true);
  assert.equal(existsSync('src/env.d.ts'), true);
  assert.equal(existsSync('src/styles/global.css'), true);

  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  assert.equal(pkg.scripts.dev, 'astro dev --host 0.0.0.0');
  assert.equal(pkg.scripts.build, 'astro check && astro build');
  assert.equal(pkg.scripts.check, 'astro check');
  assert.equal(pkg.scripts.test, 'node --test tests/*.test.mjs');
  assert.ok(pkg.dependencies.astro);
  assert.ok(pkg.devDependencies.typescript);
});

test('global CSS contains the approved warm editorial tokens', () => {
  const css = readFileSync('src/styles/global.css', 'utf8');
  assert.match(css, /--color-surface: #fdf8f7;/);
  assert.match(css, /--color-ink: #1c1b1b;/);
  assert.match(css, /--font-display: 'Newsreader'/);
  assert.match(css, /border-radius: 0/);
});
```

- [ ] **Step 2: Run the scaffold contract and verify it fails**

Run: `node --test tests/scaffold-contract.test.mjs`

Expected: FAIL because `package.json` and `src/styles/global.css` do not exist yet.

- [ ] **Step 3: Add the Astro scaffold**

`package.json`:

```json
{
  "name": "sethmaxwl-com",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev --host 0.0.0.0",
    "build": "astro check && astro build",
    "check": "astro check",
    "test": "node --test tests/*.test.mjs",
    "preview": "astro preview --host 0.0.0.0"
  },
  "dependencies": {
    "astro": "^6.3.1"
  },
  "devDependencies": {
    "typescript": "^5.9.3"
  }
}
```

`astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://sethmaxwl.com',
  output: 'static'
});
```

`tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@components/*": ["src/components/*"],
      "@data/*": ["src/data/*"],
      "@layouts/*": ["src/layouts/*"],
      "@styles/*": ["src/styles/*"]
    }
  }
}
```

`.gitignore`:

```gitignore
node_modules/
dist/
.astro/
.DS_Store
```

`src/env.d.ts`:

```ts
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
```

`src/styles/global.css` must define the full visual system:

```css
@import url('https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;500;600&family=Public+Sans:wght@400;500;600;700&display=swap');

:root {
  --color-surface: #fdf8f7;
  --color-surface-low: #f7f3f2;
  --color-surface-mid: #f1edec;
  --color-surface-high: #ebe7e6;
  --color-ink: #1c1b1b;
  --color-muted: #4a4640;
  --color-outline: #ccc5bd;
  --color-outline-strong: #7b766f;
  --color-accent: #6c5c47;
  --font-display: 'Newsreader', Georgia, serif;
  --font-body: 'Public Sans', Arial, sans-serif;
  --container: 1280px;
  --margin-desktop: 64px;
  --margin-mobile: 20px;
  --gutter: 32px;
  color-scheme: light;
}

* {
  box-sizing: border-box;
}

html {
  background: var(--color-surface);
  color: var(--color-ink);
  font-family: var(--font-body);
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-height: 100vh;
  background: var(--color-surface);
  color: var(--color-ink);
  font-size: 16px;
  line-height: 1.6;
}

a {
  color: inherit;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.24em;
}

img,
svg {
  display: block;
  max-width: 100%;
}

button,
input,
textarea,
select {
  font: inherit;
}

button,
.button {
  border-radius: 0;
}

.site-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  width: min(100% - calc(var(--margin-mobile) * 2), var(--container));
  margin-inline: auto;
}

@media (min-width: 760px) {
  .container {
    width: min(100% - calc(var(--margin-desktop) * 2), var(--container));
  }
}

.eyebrow {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  line-height: 1;
  text-transform: uppercase;
}

.display {
  font-family: var(--font-display);
  font-size: clamp(3rem, 7vw, 6.25rem);
  font-weight: 400;
  line-height: 1.02;
  letter-spacing: 0;
}

.headline {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 4rem);
  font-weight: 500;
  line-height: 1.12;
  letter-spacing: 0;
}

.subhead {
  color: var(--color-muted);
  font-size: clamp(1.05rem, 1.6vw, 1.25rem);
  line-height: 1.7;
}

.section-rule {
  border-top: 1px solid var(--color-outline);
}

.skip-link {
  position: absolute;
  left: 1rem;
  top: 1rem;
  transform: translateY(-200%);
  background: var(--color-ink);
  color: var(--color-surface);
  padding: 0.75rem 1rem;
  z-index: 100;
}

.skip-link:focus {
  transform: translateY(0);
}
```

- [ ] **Step 4: Run the scaffold contract and verify it passes**

Run: `node --test tests/scaffold-contract.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add .gitignore astro.config.mjs package.json tsconfig.json src/env.d.ts src/styles/global.css tests/scaffold-contract.test.mjs
git commit -m "chore: scaffold astro portfolio"
```

---

### Task 2: Site And Resume Data

**Files:**
- Create: `tests/site-data.test.mjs`
- Create: `src/data/site.js`
- Create: `src/data/resume.js`

- [ ] **Step 1: Write the failing site data contract test**

```js
import test from 'node:test';
import assert from 'node:assert/strict';

test('site metadata exposes Seth contact and navigation details', async () => {
  const { site } = await import('../src/data/site.js');

  assert.equal(site.name, 'Seth Maxwell');
  assert.equal(site.email, 'sethmaxwl@gmail.com');
  assert.equal(site.location, 'Knoxville, Tennessee');
  assert.equal(site.links.github, 'https://github.com/sethmaxwl');
  assert.equal(site.links.linkedin, 'https://linkedin.com/in/sethmaxwl/');
  assert.deepEqual(site.nav.map((item) => item.href), ['/work/', '/about/', '/journal/', '/contact/', '/resume/']);
});

test('resume data captures current role and required skill groups', async () => {
  const { resume } = await import('../src/data/resume.js');

  assert.equal(resume.name, 'Seth Maxwell');
  assert.equal(resume.currentRole.company, 'Atlassian');
  assert.equal(resume.currentRole.product, 'Bitbucket Cloud');
  assert.ok(resume.skills.frontend.includes('React'));
  assert.ok(resume.skills.frontend.includes('TypeScript'));
  assert.ok(resume.skills.testing.includes('Playwright'));
  assert.ok(resume.skills.infrastructure.includes('AWS'));
  assert.ok(resume.experience.some((job) => job.company === 'Google'));
});
```

- [ ] **Step 2: Run the data contract and verify it fails**

Run: `node --test tests/site-data.test.mjs`

Expected: FAIL because `src/data/site.js` and `src/data/resume.js` do not exist.

- [ ] **Step 3: Add site metadata**

`src/data/site.js`:

```js
export const site = {
  name: 'Seth Maxwell',
  title: 'Software Engineer',
  description:
    'Software engineer at Atlassian building Bitbucket Cloud product surfaces, navigation systems, and developer workflows.',
  email: 'sethmaxwl@gmail.com',
  location: 'Knoxville, Tennessee',
  links: {
    github: 'https://github.com/sethmaxwl',
    linkedin: 'https://linkedin.com/in/sethmaxwl/',
    email: 'mailto:sethmaxwl@gmail.com',
    resume: '/resume/Seth-Maxwell-Resume.pdf'
  },
  nav: [
    { label: 'Work', href: '/work/' },
    { label: 'About', href: '/about/' },
    { label: 'Journal', href: '/journal/' },
    { label: 'Contact', href: '/contact/' },
    { label: 'Resume', href: '/resume/' }
  ],
  footerLinks: [
    { label: 'LinkedIn', href: 'https://linkedin.com/in/sethmaxwl/' },
    { label: 'GitHub', href: 'https://github.com/sethmaxwl' },
    { label: 'Email', href: 'mailto:sethmaxwl@gmail.com' },
    { label: 'Resume', href: '/resume/' }
  ]
};
```

- [ ] **Step 4: Add resume data**

`src/data/resume.js`:

```js
export const resume = {
  name: 'Seth Maxwell',
  headline: 'Software Engineer at Atlassian',
  currentRole: {
    title: 'Software Engineer',
    company: 'Atlassian',
    product: 'Bitbucket Cloud',
    dates: 'Jan 2022 - Current'
  },
  education: {
    school: 'Purdue University',
    degree: "Bachelor's degree, Computer Science",
    dates: 'Jan 2018 - Dec 2021'
  },
  focusAreas: ['Frontend Architecture', 'Developer Experience', 'Navigation Systems', 'Reliability', 'AI-assisted Workflows'],
  skills: {
    frontend: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Design Systems'],
    backend: ['Python', 'Node.js', 'REST APIs', 'PostgreSQL', 'SQL'],
    testing: ['Playwright', 'Cypress', 'Pytest'],
    infrastructure: ['AWS', 'Docker', 'CI/CD', 'Bitbucket Pipelines'],
    practice: ['Observability', 'Mentorship', 'Code Quality', 'Agentic Development']
  },
  experience: [
    {
      title: 'Software Engineer',
      company: 'Atlassian',
      product: 'Bitbucket Cloud',
      dates: 'Jan 2022 - Current',
      bullets: [
        'Led navigation improvements across Bitbucket surfaces, making it easier for developers to move between repositories, pull requests, settings, and workspaces.',
        'Modernized frontend architecture and reliability tooling to reduce build times by 45% and frontend error rates by 60%.',
        'Owned full-stack delivery of repository and project favorites functionality for more than 20,000 users.',
        'Led implementation of a new draft pull request workflow in Bitbucket.',
        'Integrated AI-assisted developer workflows into internal code review assistance and suggestion features.'
      ]
    },
    {
      title: 'Student Systems Administrator',
      company: 'Research Computing at Purdue University',
      dates: 'Sep 2018 - Dec 2021',
      bullets: [
        'Developed and maintained an inventory-management system using Python, Flask, and SQL, cataloging more than 500 systems and reducing maintenance response time by 20%.'
      ]
    },
    {
      title: 'Software Engineering Intern',
      company: 'Atlassian',
      product: 'Bitbucket Cloud',
      dates: 'May 2021 - Aug 2021',
      bullets: [
        'Built a feature for repository admins to require branch deletion after pull request merges, enabled for 55% of repositories and reducing stale branches.'
      ]
    },
    {
      title: 'Software Engineering Intern',
      company: 'Google',
      dates: 'May 2020 - Aug 2020',
      bullets: [
        'Implemented OpenTelemetry tracing in Google Cloud Pub/Sub for Node.js and Python client libraries, improving production issue detection and resolution.'
      ]
    }
  ]
};
```

- [ ] **Step 5: Run the data contract and verify it passes**

Run: `node --test tests/site-data.test.mjs`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/data/site.js src/data/resume.js tests/site-data.test.mjs
git commit -m "feat: add portfolio data model"
```

---

### Task 3: Content Collections And Markdown Entries

**Files:**
- Create: `tests/content-contract.test.mjs`
- Create: `src/content/config.ts`
- Create: `src/content/work/bitbucket-navigation.md`
- Create: `src/content/work/draft-pull-requests.md`
- Create: `src/content/work/repository-settings-platform.md`
- Create: `src/content/work/purdue-inventory-system.md`
- Create: `src/content/journal/getting-started.md`

- [ ] **Step 1: Write the failing content contract test**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

function frontmatter(file) {
  const text = readFileSync(file, 'utf8');
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  assert.ok(match, `${file} has frontmatter`);
  return match[1];
}

test('Astro content config declares journal and work collections', () => {
  assert.equal(existsSync('src/content/config.ts'), true);
  const config = readFileSync('src/content/config.ts', 'utf8');
  assert.match(config, /defineCollection/);
  assert.match(config, /journal/);
  assert.match(config, /work/);
});

test('work entries provide case-study metadata', () => {
  const dir = 'src/content/work';
  const files = readdirSync(dir).filter((file) => file.endsWith('.md'));
  assert.equal(files.length, 4);

  for (const file of files) {
    const fm = frontmatter(join(dir, file));
    for (const key of ['title:', 'description:', 'role:', 'timeline:', 'outcome:', 'stack:', 'order:']) {
      assert.match(fm, new RegExp(key.replace(':', '')));
    }
  }
});

test('journal entries provide routable article metadata', () => {
  const dir = 'src/content/journal';
  const files = readdirSync(dir).filter((file) => file.endsWith('.md'));
  assert.equal(files.length, 1);

  const fm = frontmatter(join(dir, files[0]));
  for (const key of ['title:', 'description:', 'date:']) {
    assert.match(fm, new RegExp(key.replace(':', '')));
  }
});
```

- [ ] **Step 2: Run the content contract and verify it fails**

Run: `node --test tests/content-contract.test.mjs`

Expected: FAIL because `src/content/config.ts` and Markdown entries do not exist.

- [ ] **Step 3: Add content collection schema**

`src/content/config.ts`:

```ts
import { defineCollection, z } from 'astro:content';

const work = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    role: z.string(),
    timeline: z.string(),
    stack: z.array(z.string()),
    outcome: z.string(),
    featured: z.boolean().default(false),
    visual: z.enum(['navigation', 'pull-request', 'settings', 'systems']),
    order: z.number()
  })
});

const journal = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
  })
});

export const collections = { work, journal };
```

- [ ] **Step 4: Add work Markdown entries**

Each file needs frontmatter and body copy. Use these titles and metadata:

```yaml
---
title: "Bitbucket Navigation Architecture"
description: "Navigation improvements across core Bitbucket Cloud surfaces, helping developers move between repositories, pull requests, settings, and workspaces."
role: "Software Engineer"
timeline: "2024 - 2026"
stack:
  - React
  - TypeScript
  - Design Systems
  - Observability
outcome: "Improved discoverability across five core product surfaces."
featured: true
visual: "navigation"
order: 1
---
```

Body:

```md
## Challenge

Bitbucket Cloud had accumulated navigation paths across repository, pull request, settings, and workspace surfaces. Users could reach critical areas, but the product required too much orientation work from developers.

## Approach

I led navigation improvements across five core surfaces, pairing interface architecture with product constraints. The work emphasized clear information hierarchy, route consistency, and reliable frontend behavior.

## Impact

The improvements made common developer journeys easier to discover and helped reduce navigation friction reported across repositories and projects.
```

`draft-pull-requests.md` metadata:

```yaml
---
title: "Draft Pull Request Workflow"
description: "A new draft pull request workflow for Bitbucket Cloud, delivered while mentoring junior engineers and completing ahead of schedule."
role: "Lead Engineer"
timeline: "2023 - 2024"
stack:
  - React
  - TypeScript
  - REST APIs
  - Bitbucket Cloud
outcome: "Adopted by 20% of users within three months."
featured: true
visual: "pull-request"
order: 2
---
```

`repository-settings-platform.md` metadata:

```yaml
---
title: "Repository Settings Platform"
description: "Frontend architecture and reliability improvements for repository and project administration surfaces."
role: "Software Engineer"
timeline: "2022 - 2024"
stack:
  - React
  - TypeScript
  - Playwright
  - Cypress
outcome: "Reduced build times by 45% and frontend error rates by 60%."
featured: true
visual: "settings"
order: 3
---
```

`purdue-inventory-system.md` metadata:

```yaml
---
title: "Research Computing Inventory System"
description: "A Python, Flask, and SQL system cataloging more than 500 research computing systems at Purdue University."
role: "Student Systems Administrator"
timeline: "2018 - 2021"
stack:
  - Python
  - Flask
  - SQL
  - Automation
outcome: "Reduced maintenance response time by 20%."
featured: false
visual: "systems"
order: 4
---
```

Give each of the last three files the same section headings as the first file: `Challenge`, `Approach`, and `Impact`. Use only facts from the resume and the approved spec.

- [ ] **Step 5: Add the journal seed entry**

`src/content/journal/getting-started.md`:

```md
---
title: "Journal Setup"
description: "A short note proving that Markdown files become journal pages."
date: 2026-05-20
tags:
  - Journal
---

This entry exists to prove the Markdown journal workflow. Future posts can be added by creating a new file in `src/content/journal/` with title, description, date, and tags frontmatter.
```

- [ ] **Step 6: Run the content contract and verify it passes**

Run: `node --test tests/content-contract.test.mjs`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/content tests/content-contract.test.mjs
git commit -m "feat: add markdown content collections"
```

---

### Task 4: Shared Editorial Components

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/SiteHeader.astro`
- Create: `src/components/SiteFooter.astro`
- Create: `src/components/PageIntro.astro`
- Create: `src/components/EditorialVisual.astro`
- Create: `src/components/ProjectFeature.astro`
- Create: `src/components/JournalList.astro`
- Create: `src/components/ResumeSection.astro`

- [ ] **Step 1: Write the failing component check inside the route contract**

Create `tests/route-contract.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const componentFiles = [
  'src/layouts/BaseLayout.astro',
  'src/components/SiteHeader.astro',
  'src/components/SiteFooter.astro',
  'src/components/PageIntro.astro',
  'src/components/EditorialVisual.astro',
  'src/components/ProjectFeature.astro',
  'src/components/JournalList.astro',
  'src/components/ResumeSection.astro'
];

test('shared editorial components exist', () => {
  for (const file of componentFiles) {
    assert.equal(existsSync(file), true, `${file} exists`);
  }
});

test('base layout imports global CSS and renders header/footer', () => {
  const layout = readFileSync('src/layouts/BaseLayout.astro', 'utf8');
  assert.match(layout, /global\.css/);
  assert.match(layout, /SiteHeader/);
  assert.match(layout, /SiteFooter/);
});
```

- [ ] **Step 2: Run the route contract and verify it fails**

Run: `node --test tests/route-contract.test.mjs`

Expected: FAIL because shared components do not exist.

- [ ] **Step 3: Add `BaseLayout.astro`**

Use this structure:

```astro
---
import SiteHeader from '@components/SiteHeader.astro';
import SiteFooter from '@components/SiteFooter.astro';
import '@styles/global.css';

const {
  title = 'Seth Maxwell',
  description = 'Software engineer at Atlassian building Bitbucket Cloud product surfaces and developer workflows.'
} = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="description" content={description} />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to content</a>
    <div class="site-shell">
      <SiteHeader />
      <main id="main">
        <slot />
      </main>
      <SiteFooter />
    </div>
  </body>
</html>
```

- [ ] **Step 4: Add navigation and footer components**

`SiteHeader.astro` should import `site`, render `Seth Maxwell` as the home link, and map `site.nav`.

`SiteFooter.astro` should import `site`, render social/contact links, and show `© 2026 Seth Maxwell`.

Use semantic `header`, `nav`, and `footer` elements. Keep styling in component-scoped `<style>` blocks and use sharp borders with `var(--color-outline)`.

- [ ] **Step 5: Add content display components**

Required prop contracts:

```astro
--- 
// PageIntro.astro
const { eyebrow, title, description } = Astro.props;
---
```

```astro
---
// EditorialVisual.astro
const { variant = 'navigation', label = '' } = Astro.props;
---
```

```astro
---
// ProjectFeature.astro
const { project, href, reverse = false } = Astro.props;
---
```

```astro
---
// JournalList.astro
const { posts } = Astro.props;
---
```

```astro
---
// ResumeSection.astro
const { title, items } = Astro.props;
---
```

`EditorialVisual.astro` should render local CSS panels with abstract shapes and labels, not external images. The variants are `navigation`, `pull-request`, `settings`, and `systems`.

- [ ] **Step 6: Run the route contract and verify the component assertions pass**

Run: `node --test tests/route-contract.test.mjs`

Expected: PASS for the two component assertions.

- [ ] **Step 7: Commit**

```bash
git add src/components src/layouts tests/route-contract.test.mjs
git commit -m "feat: add editorial layout components"
```

---

### Task 5: Pages And Generated Routes

**Files:**
- Modify: `tests/route-contract.test.mjs`
- Create: `src/pages/index.astro`
- Create: `src/pages/work/index.astro`
- Create: `src/pages/work/[slug].astro`
- Create: `src/pages/about.astro`
- Create: `src/pages/journal/index.astro`
- Create: `src/pages/journal/[slug].astro`
- Create: `src/pages/contact.astro`
- Create: `src/pages/resume.astro`

- [ ] **Step 1: Extend the route contract test**

Append this to `tests/route-contract.test.mjs`:

```js
const routeFiles = [
  'src/pages/index.astro',
  'src/pages/work/index.astro',
  'src/pages/work/[slug].astro',
  'src/pages/about.astro',
  'src/pages/journal/index.astro',
  'src/pages/journal/[slug].astro',
  'src/pages/contact.astro',
  'src/pages/resume.astro'
];

test('approved site route files exist', () => {
  for (const file of routeFiles) {
    assert.equal(existsSync(file), true, `${file} exists`);
  }
});

test('dynamic journal and work pages use getStaticPaths', () => {
  const work = readFileSync('src/pages/work/[slug].astro', 'utf8');
  const journal = readFileSync('src/pages/journal/[slug].astro', 'utf8');
  assert.match(work, /getStaticPaths/);
  assert.match(work, /getCollection\('work'\)/);
  assert.match(journal, /getStaticPaths/);
  assert.match(journal, /getCollection\('journal'\)/);
});
```

- [ ] **Step 2: Run the route contract and verify it fails**

Run: `node --test tests/route-contract.test.mjs`

Expected: FAIL because page files do not exist.

- [ ] **Step 3: Add home, work, about, contact, and resume pages**

Page requirements:

- `index.astro`: render Seth's name in the first viewport, a concise engineering position statement, and two featured projects from `getCollection('work')`.
- `work/index.astro`: render all work entries sorted by `order`, using `ProjectFeature`.
- `about.astro`: render a Stitch-style editorial intro, focus areas from `resume.focusAreas`, and a narrative grounded in current Atlassian work and Purdue background.
- `contact.astro`: render email, LinkedIn, GitHub, and location from `site`.
- `resume.astro`: render experience, education, and skills from `resume`, plus a link to `/resume/Seth-Maxwell-Resume.pdf`.

Use `BaseLayout`, `PageIntro`, and existing components. Keep visible feature descriptions out of UI chrome; content should read like portfolio copy, not instructions.

- [ ] **Step 4: Add dynamic work page**

`src/pages/work/[slug].astro` must use:

```astro
---
import { getCollection, render } from 'astro:content';
import BaseLayout from '@layouts/BaseLayout.astro';
import EditorialVisual from '@components/EditorialVisual.astro';

export async function getStaticPaths() {
  const projects = await getCollection('work');
  return projects.map((project) => ({
    params: { slug: project.id },
    props: { project }
  }));
}

const { project } = Astro.props;
const { Content } = await render(project);
---
```

Render the metadata grid with `role`, `timeline`, `stack`, and `outcome`, then render `<Content />`.

- [ ] **Step 5: Add journal index and dynamic article page**

`src/pages/journal/index.astro` must call `getCollection('journal')`, sort by descending `date`, and pass posts to `JournalList`.

`src/pages/journal/[slug].astro` must use:

```astro
---
import { getCollection, render } from 'astro:content';
import BaseLayout from '@layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('journal');
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post }
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---
```

Render title, description, date, tags, and `<Content />`.

- [ ] **Step 6: Run route contract and verify it passes**

Run: `node --test tests/route-contract.test.mjs`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/pages tests/route-contract.test.mjs
git commit -m "feat: add portfolio pages and routes"
```

---

### Task 6: Resume PDF And Static Assets

**Files:**
- Create: `public/resume/Seth-Maxwell-Resume.pdf`
- Modify: `src/pages/resume.astro`

- [ ] **Step 1: Copy the resume PDF into the public directory**

Run:

```bash
mkdir -p public/resume
cp "/Users/sethmaxwl/Library/Mobile Documents/com~apple~CloudDocs/Seth Maxwell Resume.pdf" public/resume/Seth-Maxwell-Resume.pdf
```

Expected: `public/resume/Seth-Maxwell-Resume.pdf` exists.

- [ ] **Step 2: Verify the PDF link target exists**

Run: `test -f public/resume/Seth-Maxwell-Resume.pdf`

Expected: exit code 0.

- [ ] **Step 3: Ensure the resume page links to the copied file**

`src/pages/resume.astro` should include:

```astro
<a class="button button-primary" href="/resume/Seth-Maxwell-Resume.pdf">Download PDF</a>
```

- [ ] **Step 4: Commit**

```bash
git add public/resume/Seth-Maxwell-Resume.pdf src/pages/resume.astro
git commit -m "feat: add downloadable resume"
```

---

### Task 7: Install, Validate, Build, And Browser Review

**Files:**
- Create or modify: `package-lock.json`
- Validate: all implementation files

- [ ] **Step 1: Install dependencies**

Run: `npm install`

Expected: `node_modules/` and `package-lock.json` are created. If sandboxed network access fails, rerun with escalation.

- [ ] **Step 2: Run unit contracts**

Run: `npm test`

Expected: all Node test files pass.

- [ ] **Step 3: Run Astro validation**

Run: `npm run check`

Expected: Astro reports no TypeScript or content collection errors.

- [ ] **Step 4: Build the static site**

Run: `npm run build`

Expected: Astro builds `dist/` and emits routes for `/`, `/work/`, `/work/bitbucket-navigation/`, `/about/`, `/journal/`, `/journal/getting-started/`, `/contact/`, and `/resume/`.

- [ ] **Step 5: Start the dev server**

Run: `npm run dev`

Expected: Astro prints a local URL, usually `http://localhost:4321/`.

- [ ] **Step 6: Browser review**

Use the Browser plugin to inspect:

- Desktop home page.
- Desktop work detail page.
- Desktop journal page and generated article page.
- Mobile home page.
- Mobile navigation layout.

Checks:

- First viewport clearly identifies Seth Maxwell.
- Navigation links route correctly.
- Journal index links to Markdown-generated article pages.
- Pages use warm editorial design, sharp geometry, thin dividers, and stable local visuals.
- No text overlaps at mobile width.
- No external generated Stitch image URLs are used.

- [ ] **Step 7: Commit verification updates**

```bash
git add package-lock.json
git commit -m "chore: verify portfolio build"
```

Skip this commit only if `package-lock.json` was already committed in an earlier task.

---

## Self-Review

Spec coverage:

- Multi-page Astro site: Tasks 1, 5, and 7.
- Stitch warm editorial design: Tasks 1 and 4.
- Resume-backed content: Tasks 2, 3, 5, and 6.
- Markdown journal with generated pages: Tasks 3 and 5.
- Project case studies: Tasks 3 and 5.
- Contact details: Tasks 2 and 5.
- Static resume PDF link: Task 6.
- Build and browser verification: Task 7.

Risk notes:

- Dependency install requires network access. If sandboxed install fails, request escalation for `npm install`.
- Astro version should be adjusted during implementation if the registry resolves a newer major version with content collection API changes.
- Browser verification depends on dependencies installing successfully.

