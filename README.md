# Basel Anaya — Portfolio

Personal portfolio of [Basel Anaya](https://baselanaya.com), founder of Maximlabs. AI infrastructure: kernel-level sandboxes for autonomous agents, local LLM inference, and the data pipelines between them.

The site is a static-rendered Next.js app with a paper-and-ink editorial theme, cobalt signal accents, and animated "mechanism diagram" demos — miniature versions of each project's actual mechanics, drawn as SVG and driven by a shared loop clock.

## Stack

- **Next.js 16** (App Router, static prerendering, Turbopack)
- **Tailwind CSS v4** + a small token layer in `src/styles/globals.css`
- **Motion** (`motion/react`) for the demo loops, page transitions, and micro-interactions
- **MDX** case studies and blog posts (`next-mdx-remote`, `rehype-pretty-code` for Shiki-highlighted code)
- **Resend** for the contact form

## Structure

```
src/
  app/            # routes: /work /experience /blog /about /now /lab /contact
  components/     # nav, demos/, ascii-cover, field-monitor, ...
  content/        # MDX case studies (work/) and blog posts (blog/)
  lib/            # projects, case studies, experience, blog, seo helpers
  styles/         # globals.css — design tokens + instrument-island styles
```

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run start      # serve the production build
```

## Content

- **Case studies** live in `src/content/work/*.mdx` — one file per project, paired with the project entry in `src/lib/projects.ts` (name, tagline, status, metrics, cover pattern).
- **Blog posts** live in `src/content/blog/*.mdx` with `title`, `date`, `summary`, `tags`, and `readingTime` frontmatter.
- `src/content/profile.md` is personal and gitignored on purpose.

## Deployment

Any Node host works (`next build` + `next start`). The contact route needs `RESEND_API_KEY`; analytics load only when `NEXT_PUBLIC_GA_ID` is set.

---

© 2026 Basel Anaya, Maximlabs. All rights reserved unless a source file states otherwise.
