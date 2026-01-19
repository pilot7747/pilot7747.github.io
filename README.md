# nikita-pavlichenko.com

Personal website and blog built with Next.js 16, TypeScript, and Tailwind CSS.

## Features

- **Home page** — Simplified CV with work experience, education, publications, and skills
- **Blog** — MDX-powered blog with syntax highlighting and custom components
- **Dark theme** — Modern, minimal design with terminal-inspired aesthetics
- **SEO** — Sitemap, Open Graph tags, and proper meta descriptions
- **Responsive** — Works on all screen sizes

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Blog**: MDX via next-mdx-remote
- **Deployment**: Vercel

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Adding Blog Posts

Create a new `.mdx` file in `content/blog/`:

```mdx
---
title: "Your Post Title"
date: "2025-01-19"
description: "A brief description of your post"
tags: ["tag1", "tag2"]
---

Your content here. Supports Markdown and JSX components.
```

## Project Structure

```
├── content/
│   └── blog/           # Blog posts (MDX files)
├── public/             # Static assets
└── src/
    ├── app/            # Next.js App Router pages
    │   ├── blog/       # Blog pages
    │   └── layout.tsx  # Root layout
    └── lib/            # Utilities (posts.ts)
```

## License

MIT
