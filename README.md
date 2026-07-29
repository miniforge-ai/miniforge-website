# miniforge.ai website

Static site for `https://miniforge.ai`, replacing the previous
Squarespace site. Same pattern as `miniforge-ai/thesium-marketing`:
plain HTML + one stylesheet, no framework, deployed via Cloudflare
Workers Builds (Static Assets), so the deploy is decoupled from the
product repos.

Design: industrial. Brand palette kept from the original site
(forge orange `#FF5E1A`, mill gray `#DAD9D9`, black/white) extended
with steel darks. Space Grotesk display, IBM Plex Sans body, IBM
Plex Mono for data-plate labels. Signature elements: the animated
production-line schematic on the home page (spec in, PR out, gates
between stations) and the engineering-drawing title block used as
the footer.

## Layout

```
index.html               — home: hero, pipeline schematic, principles,
                           product line, latest posts
miniforge.html           — product page (phases, four loops, governance)
products.html            — product line: Miniforge, Fleet, Control, Minibench
architectures/           — architecture portfolio ("drawing register")
  index.html             — register
  miniforge.html         — Miniforge as-built + target (6 panels)
blog/                    — GENERATED from posts/ (committed)
posts/*.md               — canonical blog content (frontmatter + markdown)
scripts/build-posts.mjs  — posts/*.md → blog/*.html + blog/index.html
about.html               — about + contact
404.html                 — fallback
style.css                — the whole design system
assets/                  — favicon, brand banner, architecture diagram SVGs
wrangler.toml            — Cloudflare Workers Static Assets config
.assetsignore            — keeps sources (posts/, scripts/, node_modules)
                           out of the deployed asset set
```

## Content pulled from GitHub

1. Blog posts live as markdown in `posts/` — the canonical copy for
   the site. Add or edit a post, then regenerate and commit both:

   ```
   npm install
   node scripts/build-posts.mjs
   ```

   The script also regenerates `feed.xml` (RSS 2.0, full content,
   absolute URLs) at the site root. Publishing a post updates the
   feed; an RSS-to-email service (e.g. Buttondown) pointed at
   `https://miniforge.ai/feed.xml` turns posts into a newsletter
   with no extra steps.

2. Architecture diagrams are CANONICAL in their source repos and
   only projected here:
   `miniforge-ai/miniforge` → `docs/architecture/diagrams/*.svg`
   lands in `assets/diagrams/`; `miniforge-ai/thesium-career`
   (the Ariadne panels) lands in `assets/diagrams/thesium/`.
   After a diagram PR merges upstream, run
   `node scripts/sync-diagrams.mjs` (reads each repo's origin/main —
   local checkout state is irrelevant) and commit the diff. Never
   edit an SVG here. Each portfolio entry page links back to its
   source directory on GitHub.

## Deploy via Cloudflare Workers Builds

One-time setup:

1. Cloudflare dashboard → Workers & Pages → Create → Workers →
   Connect to Git → pick `miniforge-ai/miniforge-website`.
2. No build command needed; asset directory is the repo root
   (`.assetsignore` trims it).
3. Add the custom domain `miniforge.ai` (and `www.miniforge.ai`)
   to the Worker, then point the domain's DNS at Cloudflare.

Cloudflare's extension stripping serves `/miniforge` from
`miniforge.html`, `/blog/<slug>` from `blog/<slug>.html`, etc.

## Local preview

```
python3 -m http.server 8901
```
