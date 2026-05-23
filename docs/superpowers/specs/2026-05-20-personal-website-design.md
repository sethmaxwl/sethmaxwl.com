# Personal Website Design

Date: 2026-05-20

## Goal

Create a multi-page personal website for Seth Maxwell using the Stitch "Warm Editorial Studio" design as the visual source of truth and Seth's resume as the content source of truth.

The site should present Seth as a software engineer focused on frontend architecture, developer experience, navigation systems, reliability, AI-assisted workflows, observability, and full-stack product engineering.

## Source Material

- Stitch archive: `Stitch Playful Dev Portfolio.zip`
- Resume PDF: `Seth Maxwell Resume.pdf`
- Workspace: `/Users/sethmaxwl/Repositories/sethmaxwl.com`

The workspace was empty at design time and had no existing package or source files.

## Visual Direction

The site will follow Stitch's warm editorial design language:

- Warm cream and oatmeal surfaces.
- Sharp geometry and thin dividers.
- Serif editorial headlines inspired by Newsreader.
- Clean sans-serif body copy inspired by Public Sans.
- Large, spacious page intros.
- Alternating project layouts with image-led editorial panels.
- No shadow-heavy cards or decorative gradients.
- Minimal navigation with Work, About, Journal, Contact, and Resume access.

The implementation should adapt Stitch's page layouts rather than hotlinking the generated external image URLs. Local CSS-driven editorial panels or local static assets should provide stable visuals.

## Site Structure

The site will be a static Astro project with these routes:

- `/` home page
- `/work/` selected work index
- `/work/:slug/` project detail pages
- `/about/` about page
- `/journal/` journal index
- `/journal/:slug/` journal article pages
- `/contact/` contact page
- `/resume/` web resume page

The main navigation will expose Work, About, Journal, Contact, and Resume. The home page will act as a strong first viewport with Seth's name and engineering positioning visible immediately.

## Journal Requirements

The journal will be Markdown-driven. Adding a Markdown file under `src/content/journal/` should create:

- A generated article page at `/journal/:slug/`.
- A listing entry on `/journal/`.

Journal Markdown files will use frontmatter:

```yaml
---
title: "Article title"
description: "Short summary"
date: 2026-05-20
tags:
  - Engineering
---
```

Astro content collections will validate frontmatter and fail clearly at build time when required fields are missing or malformed.

The first implementation should include a journal index and may include one minimal example draft post only if needed to demonstrate routing. It should not invent long-form journal content.

## Work Content

Work pages will be based on resume-backed projects and accomplishments:

- Bitbucket Cloud navigation architecture and product surface improvements.
- Bitbucket Cloud draft pull request workflow.
- Repository settings and frontend reliability improvements.
- Purdue inventory-management system.
- Internships at Google and Atlassian, where useful as supporting context.

Project detail pages should be case-study style, matching Stitch's "Project Deep Dive" layout:

- Intro with project title and summary.
- Metadata grid for role, timeline, stack, and outcome.
- Challenge, approach, implementation, and impact sections.
- Outcome metrics from the resume where available.

## About And Resume Content

The about page will translate resume facts into a concise professional narrative:

- Current Software Engineer at Atlassian on Bitbucket Cloud.
- Purdue University Computer Science background.
- Work across frontend architecture, React, TypeScript, Python, JavaScript, Node, REST APIs, Playwright, Cypress, PostgreSQL, AWS, Docker, observability, and mentorship.

The resume page will present a structured web version of the PDF and should include a link to the original PDF if it is copied into `public/`.

## Contact Content

The contact page will include:

- Email: `sethmaxwl@gmail.com`
- Location: Knoxville, Tennessee
- LinkedIn: `linkedin.com/in/sethmaxwl/`
- GitHub: `github.com/sethmaxwl`

## Technical Architecture

Use Astro for routing, static generation, and Markdown content.

Expected project shape:

```text
src/
  components/
  content/
    config.ts
    journal/
    work/
  data/
  layouts/
  pages/
public/
```

Shared layout and component responsibilities:

- `BaseLayout`: document shell, metadata, global styles.
- `SiteHeader`: sticky editorial navigation.
- `SiteFooter`: social/contact links.
- `PageIntro`: shared page opening treatment.
- `ProjectCard` or `ProjectFeature`: work index entries.
- `JournalList`: journal index rendering.
- `ResumeSection`: reusable resume groups.

Use structured data or content collections for work and journal entries so content is not duplicated across pages.

## Testing And Verification

Implementation verification should include:

- Package install check.
- Astro type/content validation.
- Production build.
- Route generation check for home, work, project detail, about, journal, contact, and resume pages.
- Browser review of key pages after the dev server is running.
- Responsive review for desktop and mobile viewports.

## Out Of Scope

- Blog authoring UI or CMS.
- Real newsletter, RSS, or search unless later requested.
- Dynamic server features.
- Long-form invented journal posts.
- Recreating Stitch generated pages verbatim with placeholder copy.

