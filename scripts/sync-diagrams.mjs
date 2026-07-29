// Syncs architecture diagram SVGs into assets/diagrams/ from their
// CANONICAL homes — the source repos' origin/main:
//
//   miniforge       docs/architecture/diagrams/  ->  assets/diagrams/
//   thesium-career  docs/architecture/diagrams/  ->  assets/diagrams/thesium/
//
// The repos are the single source of truth; this script is the only
// way diagrams enter the website (same convention as build-posts.mjs:
// canonical content upstream, generated/synced output committed here).
// Reads from origin/main via git — the local checkout's branch or
// working tree state does not matter. Run after a diagram PR merges
// upstream, then commit the diff.
import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ws = join(root, '..');

const sources = [
  { repo: join(ws, 'miniforge'), src: 'docs/architecture/diagrams', dest: join(root, 'assets', 'diagrams') },
  { repo: join(ws, 'thesium-career'), src: 'docs/architecture/diagrams', dest: join(root, 'assets', 'diagrams', 'thesium') },
];

const git = (repo, args, opts = {}) =>
  execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, ...opts });

for (const { repo, src, dest } of sources) {
  git(repo, ['fetch', 'origin', 'main', '--quiet']);
  const files = git(repo, ['ls-tree', '-r', '--name-only', 'origin/main', '--', src])
    .split('\n')
    .filter((f) => f.endsWith('.svg'));
  mkdirSync(dest, { recursive: true });
  for (const f of files) {
    const svg = git(repo, ['show', `origin/main:${f}`]);
    writeFileSync(join(dest, basename(f)), svg);
  }
  console.log(`${basename(repo)}: ${files.length} diagrams -> ${dest.replace(root + '/', '')}`);
}
