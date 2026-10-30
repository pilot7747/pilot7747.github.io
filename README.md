# nikita-pavlichenko.com

Personal site and blog. Next.js 16 (App Router, fully static), React 19.3, Tailwind CSS 4, TypeScript 6.

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build, every route is prerendered
npm run lint
```

## Where things live

| What | Where |
| --- | --- |
| Bio, experience, publications, links, stats | `src/lib/site.ts` (all personal data, one file) |
| Hero "training run" figure | `src/lib/curve.ts` (data) and `src/components/training-curve.tsx` (render) |
| Blog posts | `content/blog/*.mdx` |
| Colors, type, motion | `src/app/globals.css` (OKLCH tokens via `light-dark()`) |
| Social cards | `src/app/opengraph-image.tsx`, `src/app/blog/[slug]/opengraph-image.tsx`, fonts in `assets/fonts` |

## Writing a post

Create `content/blog/<slug>.mdx`:

```mdx
---
title: "Post title"
date: "2026-11-15"
description: "One-sentence summary, used in lists, RSS and the social card."
tags: ["llm", "data"]
draft: true # optional, hidden in production builds
---

Markdown with GFM tables and footnotes, $\LaTeX$ math via KaTeX, and
syntax-highlighted code blocks (Shiki, light and dark themes).
```

`##` and `###` headings get anchor links, and posts with two or more `##` sections get a table of contents on wide screens.

## What's built in

- Light and dark themes that follow the OS, with a toggle that remembers an explicit choice
- View transitions: post titles morph between list and article; pages slide on forward/back navigation
- Scroll-driven reveals and a load-in sequence, all disabled under `prefers-reduced-motion`
- Generated Open Graph images, icons, web manifest, `sitemap.xml`, `robots.txt`, RSS at `/feed.xml`
- `/llms.txt`, a plain-text profile for language models and agents
- JSON-LD (`Person` and `BlogPosting`) for search engines

## Deployment

Deployed on Vercel (project `pilot7747-github-io`), canonical domain `www.nikita-pavlichenko.com`.
