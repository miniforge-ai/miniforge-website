// Builds blog/*.html and blog/index.html from posts/*.md.
// Posts are the canonical content, synced from GitHub; run this after
// adding or editing a post, commit the generated HTML alongside it.
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const postsDir = join(root, 'posts');
const outDir = join(root, 'blog');
mkdirSync(outDir, { recursive: true });

function frontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n/);
  const meta = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].replace(/^"(.*)"$/, '$1');
  }
  return { meta, body: src.slice(m[0].length) };
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const header = `<header class="site-header">
  <div class="frame">
    <a class="brand" href="/">
      <svg class="mark" width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#ff5e1a" d="M12 1.5 13.2 4 16 4.6 13.9 6.4 14.4 9.2 12 7.8 9.6 9.2 10.1 6.4 8 4.6 10.8 4Z"/>
        <path fill="#dad9d9" d="M2.5 11h12.5c2.8 0 5.2 1 6.5 2.6-1.8.6-3.9.9-6 .9h-2v2.2c0 1.2.8 2.2 2 2.7v1.6H8v-1.6c1.2-.5 2-1.5 2-2.7v-2.2H7L5 13H2.5Z"/>
      </svg>
      <span>miniforge<span class="tld">.ai</span></span>
    </a>
    <nav class="site-nav" aria-label="Primary">
      <a href="/miniforge">Miniforge</a>
      <a href="/products">Products</a>
      <a href="/architectures">Architectures</a>
      <a href="/blog/" aria-current="page">Blog</a>
      <a href="/about">About</a>
    </nav>
  </div>
</header>`;

const footer = `<footer class="site-footer">
  <div class="frame">
    <div class="title-block">
      <div class="tb-cell"><span class="k">Project</span><span class="v">miniforge.ai — industrial software factory</span></div>
      <div class="tb-cell"><span class="k">Rev</span><span class="v">2026.07</span></div>
      <div class="tb-cell"><span class="k">License</span><span class="v">Apache-2.0</span></div>
      <div class="tb-cell"><span class="k">Source</span><span class="v"><a href="https://github.com/miniforge-ai/miniforge">github</a></span></div>
      <div class="tb-cell"><span class="k">Contact</span><span class="v"><a href="mailto:christopher@miniforge.ai">email</a></span></div>
    </div>
    <nav class="footer-nav" aria-label="Footer">
      <a href="/miniforge">Miniforge</a>
      <a href="/products">Products</a>
      <a href="/architectures">Architectures</a>
      <a href="/blog/">Blog</a>
      <a href="/about">About</a>
      <a href="/feed.xml">RSS</a>
    </nav>
  </div>
</footer>`;

const head = (title, description) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="alternate" type="application/rss+xml" title="miniforge.ai blog" href="https://miniforge.ai/feed.xml">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=IBM+Plex+Sans:ital,wght@0,400;0,600;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/style.css">
</head>
<body>`;

const posts = readdirSync(postsDir)
  .filter((f) => f.endsWith('.md'))
  .map((f) => {
    const { meta, body } = frontmatter(readFileSync(join(postsDir, f), 'utf8'));
    return { slug: f.replace(/\.md$/, ''), ...meta, html: marked.parse(body) };
  })
  .sort((a, b) => b.date.localeCompare(a.date));

for (const p of posts) {
  const page = `${head(`${p.title} — miniforge.ai`, p.description)}

${header}

<main>
  <section class="article-hero">
    <div class="frame">
      <span class="plate-label">LOG ENTRY <b>//</b> ${p.date}</span>
      <h1>${esc(p.title)}</h1>
      <p class="meta"><time datetime="${p.date}">${p.date}</time> · Christopher Lester</p>
    </div>
  </section>
  <article class="article">
    <div class="frame">
${p.html}
    </div>
  </article>
</main>

${footer}

</body>
</html>
`;
  writeFileSync(join(outDir, `${p.slug}.html`), page);
}

const rows = posts
  .map(
    (p) => `        <a class="post-row" href="/blog/${p.slug}">
          <time datetime="${p.date}">${p.date}</time>
          <span class="t">${esc(p.title)}
            <span class="sub">${esc(p.description)}</span></span>
          <span class="go">READ →</span>
        </a>`
  )
  .join('\n');

const index = `${head('Blog — miniforge.ai', 'Writing on industrializing software: governance, autonomous delivery, and the factory that builds the factory.')}

${header}

<main>
  <section class="hero">
    <div class="frame">
      <span class="plate-label">SHIP LOG</span>
      <h1>Industrializing <span class="hot">software</span>.</h1>
      <p class="lede">Writing on the shift from craft to industrial process — governance, autonomous delivery, and the machines that make the machines.</p>
    </div>
  </section>
  <section class="section light">
    <div class="frame">
      <div class="post-list">
${rows}
      </div>
    </div>
  </section>
</main>

${footer}

</body>
</html>
`;
writeFileSync(join(outDir, 'index.html'), index);

// RSS 2.0 feed at /feed.xml. Absolute URLs throughout so items read
// correctly in feed readers and RSS-to-email services.
const SITE = 'https://miniforge.ai';
const absolutize = (html) => html.replace(/(href|src)="\//g, `$1="${SITE}/`);
const rfc822 = (d) => new Date(`${d}T12:00:00Z`).toUTCString();

const items = posts
  .map(
    (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${SITE}/blog/${p.slug}</link>
      <guid isPermaLink="true">${SITE}/blog/${p.slug}</guid>
      <pubDate>${rfc822(p.date)}</pubDate>
      <description>${esc(p.description)}</description>
      <content:encoded><![CDATA[${absolutize(p.html)}]]></content:encoded>
    </item>`
  )
  .join('\n');

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>miniforge.ai — Industrializing software</title>
    <link>${SITE}/blog/</link>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>Writing on the shift from craft to industrial process — governance, autonomous delivery, and the machines that make the machines.</description>
    <language>en</language>
    <lastBuildDate>${rfc822(posts[0].date)}</lastBuildDate>
${items}
  </channel>
</rss>
`;
writeFileSync(join(root, 'feed.xml'), feed);
console.log(`built ${posts.length} posts + index + feed.xml`);
