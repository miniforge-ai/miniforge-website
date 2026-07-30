// Syncs architecture content into the site from its CANONICAL homes —
// the source repos' origin/main:
//
//   miniforge       docs/architecture/diagrams/*.svg    -> assets/diagrams/
//   thesium-career  docs/architecture/diagrams/*.svg    -> assets/diagrams/thesium/
//   miniforge       docs/architecture/explainers/*.html -> architectures/ (ELI9 stories)
//   thesium-career  docs/architecture/explainers/*.html -> architectures/ (ELI9 stories)
//
// The repos are the single source of truth; this script is the only
// way diagrams and stories enter the website (same convention as
// build-posts.mjs: canonical content upstream, generated/synced output
// committed here). Reads from origin/main via git — the local
// checkout's branch or working tree state does not matter. Run after
// a PR merges upstream, then commit the diff. CI runs it the same way
// with SYNC_WS pointing at a directory of fresh clones.
import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ws = process.env.SYNC_WS || join(root, '..');

// Story pages keep their site URLs stable regardless of upstream
// filename; anything not in this map lands under its own basename.
const STORY_DEST = {
  'the-fort-building-robots.html': 'eli9-the-fort-building-robots.html',
  'the-robot-helpers-and-the-sticker-rules.html': 'eli9-robot-helpers-sticker-rules.html',
  'your-house-their-clubhouse-and-the-passes.html': 'eli9-your-house-their-clubhouse.html',
};

const sources = [
  { repo: join(ws, 'miniforge'), src: 'docs/architecture/diagrams', ext: '.svg', dest: join(root, 'assets', 'diagrams') },
  { repo: join(ws, 'thesium-career'), src: 'docs/architecture/diagrams', ext: '.svg', dest: join(root, 'assets', 'diagrams', 'thesium') },
  { repo: join(ws, 'miniforge'), src: 'docs/architecture/explainers', ext: '.html', dest: join(root, 'architectures'), rename: STORY_DEST },
  { repo: join(ws, 'thesium-career'), src: 'docs/architecture/explainers', ext: '.html', dest: join(root, 'architectures'), rename: STORY_DEST },
];

const git = (repo, args, opts = {}) =>
  execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, ...opts });

for (const { repo, src, ext, dest, rename } of sources) {
  git(repo, ['fetch', 'origin', 'main', '--quiet']);
  const files = git(repo, ['ls-tree', '-r', '--name-only', 'origin/main', '--', src])
    .split('\n')
    .filter((f) => f.endsWith(ext));
  if (files.length === 0) { console.log(`${basename(repo)}: nothing under ${src}`); continue; }
  mkdirSync(dest, { recursive: true });
  for (const f of files) {
    let content = git(repo, ['show', `origin/main:${f}`]);
    // Site chrome concern, injected at projection time: story pages
    // already style :root[data-theme], so the site's saved theme
    // choice must be applied before first paint here too.
    if (ext === '.html' && !content.includes("localStorage.getItem('theme')")) {
      content = content.replace('</head>', `  <script>
    (function () {
      var t = localStorage.getItem('theme');
      if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t;
    })();
  </script>
</head>`);
    }
    const name = rename ? (rename[basename(f)] || basename(f)) : basename(f);
    writeFileSync(join(dest, name), content);
  }
  console.log(`${basename(repo)}: ${files.length} ${ext} files ${src} -> ${dest.replace(root + '/', '')}`);
}
