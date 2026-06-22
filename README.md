# Sify Blog

A modern blog theme built with Astro 6 + Tailwind CSS v4. Supports light/dark mode, MDX, math formulas, site search, and comments.

![Astro](https://img.shields.io/badge/Astro-6.x-BC52EE?logo=astro)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss)
![License](https://img.shields.io/badge/license-MIT-blue)

## Features

- **Markdown / MDX** — Standard Markdown and embedded JSX components
- **KaTeX math** — Inline and block LaTeX rendering
- **Code highlighting** — Shiki syntax highlighting + one-click copy
- **Dark mode** — System preference + manual toggle, persisted in `localStorage`
- **Site search** — Open with `Ctrl+K`, matches titles and body text with highlights
- **Waline comments** — Ready-to-use comment system
- **Friends page** — Friend links + blogroll feed
- **Post covers** — Remote URLs and local images
- **RSS feed** — Auto-generated `/rss.xml`
- **Responsive design** — Two-column desktop layout + mobile drawer sidebar
- **SEO** — Open Graph, Twitter Card, canonical URLs
- **Sidebar** — Profile, category/tag cloud, random picks

## Tech stack

| Technology | Purpose |
|------|------|
| [Astro 6](https://astro.build) | Static site generation |
| [Tailwind CSS v4](https://tailwindcss.com) | CSS framework |
| [Shiki](https://shiki.style) | Code syntax highlighting |
| [KaTeX](https://katex.org) | Math rendering |
| [MDX](https://mdxjs.com) | Markdown + JSX |
| [Waline](https://waline.js.org) | Comment system |

## Quick start

### Requirements

- [Bun](https://bun.sh) (recommended) or Node.js 18+

### Install

```bash
git clone <your-repo-url> my-blog
cd my-blog
npm install
```

### Local development

```bash
npm run dev
```

Open <http://localhost:4321>. Hot reload is enabled.

### Build

```bash
npm run build
```

Output goes to `dist/`.

### Preview production build

```bash
npm run preview
```

## Configuration

Edit `src/consts.ts`:

```typescript
export const SITE_TITLE = 'Sify Blog';
export const SITE_DESCRIPTION = 'A modern blog theme built with Astro';
export const SITE_AUTHOR = 'santisify';
export const SITE_URL = 'https://example.com';
export const SITE_AVATAR = '/favicon.svg';
export const SITE_COVER = '/images/cover.jpg';

export const PAGE_SIZE = 10;

export const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Weekly', href: '/weekly' },
  { label: 'Posts', href: '/archives' },
  { label: 'Friends', href: '/friends' },
  { label: 'About', href: '/about' },
];

export const SOCIAL_LINKS = [
  { name: 'GitHub', href: 'https://github.com/yourname', icon: 'github' },
  { name: 'RSS', href: '/rss.xml', icon: 'rss' },
];
```

### Custom theme colors

Edit `src/styles/global.css`:

```css
@theme {
  --color-primary: #e9536a;
  --color-bg-light: #f5f5f5;
  --color-bg-dark: #1a1a2e;
  --color-card-light: #ffffff;
  --color-card-dark: #1e2a45;
}
```

### Custom fonts

```css
--font-family-sans: 'Inter', sans-serif;
--font-family-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

## Writing posts

Create `.md` or `.mdx` files under `src/content/blog/`.

### Frontmatter

```yaml
---
title: Post title
description: Post description
date: 2024-06-01
updated: 2024-06-15     # Optional update date
tags: [tag1, tag2]
category: Category
cover: ./images/cover.webp  # Remote URL or local relative path
pinned: false              # Pin to top
draft: false               # Drafts are excluded from RSS
---
```

### Directory structure

Two layouts are supported:

```
src/content/blog/
├── my-post.md              # Single file (slug: my-post)
└── another-post/
    ├── index.md             # Directory form (slug: another-post)
    └── cover.webp           # Local image
```

### Weekly digest

Create posts under `src/content/weekly/` with an extra `issue` field:

```yaml
---
title: Weekly #1
date: 2024-06-02
tags: [Frontend]
issue: 1
cover: https://example.com/cover.jpg
---
```

## MDX and components

Import and use custom Astro components in MDX files:

```mdx
---
title: MDX example
date: 2024-06-01
---

import LinkCard from '../../../components/LinkCard.astro';

<LinkCard
  url="https://astro.build"
  title="Astro Documentation"
  description="A versatile web framework for content-driven sites"
/>
```

Built-in components:

- `LinkCard` — External link card (`src/components/LinkCard.astro`)

Create new components:

1. Add an `.astro` file under `src/components/`
2. Import and use it in your MDX file

## Math formulas

KaTeX is preconfigured. Use `$...$` or `$$...$$` in Markdown:

```markdown
Inline: $E = mc^2$

Block:
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

## Comments

Configure the Waline comment server:

Edit `src/components/waline/Comment.astro` and set `serverURL`:

```typescript
walineInit({
  el: '#waline',
  serverURL: 'https://your-waline-server.com',
  lang: 'en',
  // ...
});
```

## Friends

Edit `public/links.json` to add friend links:

```json
{
  "friends": [
    {
      "id_name": "cf-links",
      "desc": "Friend links",
      "link_list": [
        {
          "name": "Friend's Blog",
          "link": "https://friend.example.com",
          "avatar": "https://friend.example.com/avatar.jpg",
          "intro": "Personal bio"
        }
      ]
    }
  ]
}
```

## Deployment

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

One-click deploy with no extra configuration.

### Cloudflare Pages

| Setting | Value |
|--------|-----|
| Build command | `npm run build` |
| Output directory | `dist` |

### Other static hosts

Upload the contents of `dist/` to any static file server after building.

### Pre-deploy checklist

```bash
# Build
npm run build

# Preview (optional)
npm run preview
```

Make sure these files exist:
- `dist/index.html`
- `dist/rss.xml`
- `dist/search-index.json`
- `dist/favicon.svg`

## Project structure

```
astro-theme-sify/
├── src/
│   ├── components/       # Astro components
│   │   └── waline/       # Waline comment components
│   ├── content/
│   │   ├── blog/         # Blog posts
│   │   └── weekly/       # Weekly digest posts
│   ├── layouts/          # Layout components
│   ├── pages/            # Route pages
│   └── styles/           # Global styles
├── public/               # Static assets
│   └── links.json        # Friend link data
├── astro.config.ts       # Astro config
├── src/consts.ts         # Site config
├── src/content.config.ts # Content collection schema
└── package.json
```

## License

MIT
