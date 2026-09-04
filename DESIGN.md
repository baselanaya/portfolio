# Portfolio Redesign — Design Plan

Status: proposed · 2026-09-04
References studied: danlab.dev, melious.ai, sixtytwo.ai
North star: more user-friendly, more depth — more pages, real project previews, case studies.

---

## 1. What the references teach us

| Site | What it does well | What we take |
|---|---|---|
| **danlab.dev** | Retro-computing object as hero (Mac + live terminal); floating pill nav; floating stat chips; warm editorial surface; big rounded product cards with device mockups; status labels | Product-card anatomy; pill nav; a "living machine" centerpiece |
| **melious.ai** | Huge rounded gradient hero panel; giant humanist headline; triad subline; dual pill CTAs; trust strip; logo row; alternating light/dark sections; giant stats | Section rhythm via light/dark alternation; stats strips; bento chip grids |
| **sixtytwo.ai** | Light background + massive grotesque headline with accent period; **ASCII field that visualizes real data** (GPU prices); editorial two-column sections with sticky labels; hairline rules; mono tags; inline form | The ASCII-as-instrument idea; editorial section anatomy; restraint |

All three are **light, high-contrast, and spacious**. The current portfolio is dark, dense, mono-heavy — atmospheric but tiring and low-contrast in places. The redesign keeps the systems/terminal *soul* but moves it into a light, editorial, confident layout where the ASCII texture carries **real information** (sixtytwo proves this is world-class, not gimmick).

## 2. Direction — "Instrument Panel"

One sentence: *a light, editorial engineer's portfolio where a living ASCII instrument surfaces real data, and every project opens into a genuine case study.*

### Grounding
- **Subject:** Basel builds infrastructure for autonomous AI — kernel-level hypervisors, inference servers, trading systems.
- **Audience:** founders/hiring managers (decide fast), engineers (verify depth), collaborators.
- **The site's one job:** prove he ships real systems, then make it effortless to go deep and get in touch.

### Tokens

```css
/* Palette — "paper & ink & cobalt" (orange retired 2026-09-04 per Basel) */
--paper:        #FAFAF7;  /* page surface */
--paper-2:      #F1EFE9;  /* raised surface / cards */
--ink:          #16150F;  /* headings, body-strong */
--graphite:     #57564F;  /* body text (7:1 on paper) */
--line:         #E3E1D8;  /* hairline rules */
--signal:       #2B5CFF;  /* electric cobalt — the accent */
--signal-ink:   #1D3FBF;  /* dim cobalt for labels (AA on paper) */
--terminal:     #12110D;  /* dark islands (sections, code, instruments) */
--terminal-fg:  #F5F0E8;
--live:         #16A34A;  /* "live data" green, used only for real data */
--danger:       #DC2626;
--accent-cyan:  #00B4D8;  /* gradient partner for cobalt */
```

- Dark terminal sections survive as **islands** (hero instrument, code blocks, the 404) — giving the melious-style light/dark rhythm while the default reading surface becomes paper.
- **Type:** Bricolage Grotesque (display — characterful, not templated) + Instrument Sans (body — friendly, readable) + Geist Mono (labels, data, code — continuity with today). Font sizes step up: body 17–18px, hero clamp(56px, 9vw, 128px).
- **Layout:** max-w-6xl–7xl, 12-col grid, hairline `--line` rules between editorial rows (sixtytwo), rounded-2xl cards (danlab/melious), floating pill nav that detaches on scroll.
- **Texture:** subtle paper grain (existing noise SVG, retuned for light), 8px grid.

### The signature — the ASCII Instrument
ASCII on this site means *instrument*, never wallpaper (background redesign, 2026-09-04): the full-page ASCII canvas was removed — it read as grime on the paper theme. The page base is now **engineering paper**: a fine structural grid behind the opening viewport (`.page-grid`, fades out below the fold) plus faint film grain. ASCII lives only inside dark islands where it carries meaning:
1. Hero: live render of his GitHub contribution year (the heatmap, ASCII-fied — data already fetched client-side).
2. Work cards: each project's cover is a procedural ASCII pattern unique to it (kernel rings for Kernex, schema tables for Mercer, candlesticks for Cynosure) on a `--terminal` dark panel — instant, zero-asset, ownable covers.
3. Case studies: architecture diagrams drawn as ASCII inside dark code islands.
4. Lab (phase 3): benchmark tables rendered as ASCII bar charts.
Motion rule: only the instrument animates ambiently; everything else animates on entry/hover. Reduced-motion renders it static (pattern exists).

## 3. Information architecture — the new site map

```
/                    Home — narrative: hero + instrument, selected work (3 big cards),
                     capabilities, numbers strip, writing teaser, contact CTA
/work                All projects — filter chips (tag/status), big preview cards
/work/[slug]         Case studies ← the depth (MDX-driven)
/about               Story, photo, timeline (existing data), education, résumé PDF
/lab                 Playground — experiments, snake game (out of hiding),
                     ASCII benchmark charts, heatmap instrument
/writing             Blog (keep, restyle) + /writing/[slug]
/now                 What Basel is building now (status.json-powered), reading, learning
/contact             Form (keep) + socials + response-time note + calendar link
/uses      (opt)     Gear & stack
/404                 Terminal joke page (the old soul, one easter egg on purpose)
```

Kept from today: ⌘K command palette (re-indexed for new pages), hidden terminal (` — re-skinned light), Konami → moves openly to /lab. Removed: AskBasel (done), decorative matrix background.

## 4. Page anatomy

### Home
1. **Hero** — pill nav; left: mono eyebrow `// MAXIMLABS — AI INFRASTRUCTURE`, giant two-line statement ("Infrastructure for / autonomous AI."), triad subline (sixtytwo/melious pattern: *kernels. inference. agents.*), dual CTAs (solid ink pill "View work →", ghost pill "Get in touch"). Right or below: the ASCII instrument rendering his contribution year, with a live-count chip.
2. **Selected work** — three large cards (alternating), each: ASCII cover panel, name, one-liner, 2–3 metric chips (e.g. "FP8 · ~7.2GB VRAM"), status badge, hover lift + arrow. Card → case study.
3. **Capabilities** — three pillars w/ sticky label layout (sixtytwo): *Inference systems / Agent security / Data & pipelines*, each with 2-line proof.
4. **Numbers strip** — dark island: 5 projects · 3+ yrs · 6 roles · 1 hypervisor (melious stats pattern).
5. **Writing teaser** — latest 3 posts as hairline rows.
6. **Contact CTA** — dark island: "Have something to build?" + button (keeps today's strong close).

### Work index (`/work`)
Header + filter chips (tag + status, current logic reused). Cards alternate media-left/media-right; each card = cover, summary, metric chips, year, links. Empty-state keeps the existing friendly copy.

### Case studies (`/work/[slug]`) — the core "depth" addition
MDX with a typed frontmatter schema:
```yaml
title, tagline, year, status, role, stack[], metrics[{label, value}],
cover, gallery[], repo, links[]
```
Layout: full-bleed cover → meta sidebar (sticky: role/stack/metrics/links) + narrative column → sections *Problem / Approach / Architecture (ASCII diagram) / Results / What I learned* → gallery grid → prev/next pager. Three launch case studies drafted from existing material: **Kernex** (zero-trust model), **Mercer** (SGLang + Qwen2.5 on messy schemas — the blog post has real flags/numbers), **Cynosure** (local trading stack;Chronos-2 + DuckDB). Encleare + Valerie added as archived entries with lighter studies.

### About
Portrait, short story (from bio), full timeline (data exists), education, languages, "how I work" bullets, résumé PDF button.

### Lab
Open playground: snake (openly linked, no Konami needed), contribution instrument, ASCII benchmark charts from blog data, experiment stubs. This is the page that makes recruiters remember him.

### Now & Contact
`/now` driven by `status.json` + manual notes — cheap to maintain, high signal. Contact keeps the hardened form; adds response-time line and socials row.

## 5. Motion & interaction

- One orchestrated hero entry (instrument boots left-to-right — reusing the current boot sweep inside the instrument panel only).
- Scroll reveals: once, subtle y+fade (existing pattern, retuned).
- Cards: hover lift + cover character shimmer.
- Case studies: sticky sidebar; ASCII diagrams can draw on scroll.
- Palette ⌘K + terminal ` stay; re-skin to light paper.
- `prefers-reduced-motion` respected everywhere (established pattern).

## 6. Implementation plan

| Phase | Scope | Notes |
|---|---|---|
| **0 — Foundations** ✅ 2026-09-04 | Tokens in `@theme` (old var names bridged to the light palette), Bricolage Grotesque + Instrument Sans via `next/font`, pill nav + floating mobile island, footer, `.theme-dark` island class, `.btn-solid`/`.btn-ghost`, ASCII background retuned to ink, contrast hotspots fixed | Shipped |
| **1 — Home + Work** ✅ 2026-09-04 | New home narrative (hero statement + live ASCII instrument, selected-work cards, capabilities, stats island, writing teaser, CTA island), `/work` index with filter pills, `/work/[slug]` case-study shell, procedural `AsciiCover` (rings/tables/candles/spark/wave), `lib/projects.ts` expanded to 5 projects with metrics, `/projects → /work` redirect, sitemap updated, superseded components deleted | Shipped — case-study bodies still placeholders |
| **2 — Case studies** ✅ 2026-09-04 | Five MDX case studies written (`src/content/work/*.mdx`) from Basel's own blog material, rendered via `compileMDX` into the sticky-sidebar layout with ASCII architecture diagrams; full-page ASCII canvas removed and replaced with the engineering-paper grid + film grain background | Shipped — galleries await screenshots/recordings |
| **3 — Depth pages** ✅ 2026-09-04 | `/about` (ASCII portrait + story + quick facts), `/lab` (snake out of hiding behind "insert coin", ASCII 8GB-VRAM benchmark chart, experiment links — dark island), `/now` (status.json live card + building/day-job/learning), terminal 404 (`command not found`), experience page redesigned to editorial rows, blog list + blog post + contact restyled to the new system, PageHeader component replaces SectionHeading; snake moved from Konami easter egg to /lab | Shipped — résumé PDF pending |
| **4 — Polish** | Per-route OG images, page transitions, motion pass (hero instrument boot, scroll reveals), a11y + contrast audit, performance pass | |

## 7. Content needs from Basel
1. Screenshots or screen recordings per project (terminal captures are fine and on-brand).
2. Confirmation of what's public (esp. Cynosure trading details).
3. 3–5 concrete metrics per project (tok/s, VRAM, latency, $ — several already in blog posts).
4. A portrait for /about; résumé PDF.
5. Any testimonials from Deriv/Barzan/Alef colleagues (optional but high-value).

## 8. Explicitly rejected (and why)
- Keeping the current full-dark theme with higher polish — it's the closest to "AI default look #2" and the user asked for friendlier; light-first is also what all three references share.
- Claymorphism/glassmorphism and gradient-mesh heroes — off-subject for a kernel-level engineer.
- Template portfolio grids (small equal cards) — case studies need editorial scale.
