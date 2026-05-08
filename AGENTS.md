# Agent guide

This is the user's personal Blog and Experiments playground.

The user uses it for:

1. publish blog posts
2. host css, javascript, typescript, html, etc.. experiments as static files
3. Practice languages: Portuguese BR native, English, and German (not all pages are translated)

## Stack

- Hugo Extended (pinned via `.hugo-version`)
- Tailwind CSS 4 (in-pipeline via `css.TailwindCSS`)
- esbuild (per-page TS bundles)
- pnpm (pinned via `packageManager` in `package.json`)
- oxfmt (`.oxfmtrc.json`)
- GitHub Pages deploy via `peaceiris/actions-gh-pages@v4`

## Hugo binary

Pinned by `.hugo-version`. Installed by `scripts/install-hugo.sh` from the
official `gohugoio/hugo` GitHub release with SHA256 verification before
extraction. Output at `.tools/hugo/bin/hugo`.

Always invoke via `scripts/hugo` (the wrapper). It auto-installs on first
run, re-installs on version mismatch, honors `HUGO_BIN` env var (CI sets
this to skip the local install).

Version-match regex is anchored: `v${HUGO_VERSION}([^0-9]|$)`. Prevents
`0.160.10` from matching a pin of `0.160.1`.

Do not install Hugo via Homebrew, mise, asdf, `peaceiris/actions-hugo`,
`hugo-bin`, or apt. The pinned-binary install is the only supported path.

To bump Hugo: edit `.hugo-version`, delete `.tools/hugo/`, run
`scripts/hugo version` to verify the new install.

## Build pipeline

`pnpm build` runs in order:

1. `build:partytown`: copies `@builder.io/partytown` library files into
   `themes/<theme>/static/~partytown/`.
2. `fetch:github`: writes `data/github.json` (with TTL cache, see below).
3. `build:ts`: bundles `content/**/script*.ts` and `themes/<theme>/assets/ts/*.ts`.
4. `build:hugo`: `scripts/hugo --minify`. Tailwind processes CSS inline
   via `css.TailwindCSS`.

Any reordering breaks: Partytown files must exist before Hugo serves them,
GitHub data must exist before Hugo reads `hugo.Data.github.*`, TS bundles
must exist before Hugo treats them as page-bundle resources.

`pnpm dev` runs `predev` (partytown copy + github fetch) then launches
`hugo server` + esbuild watch concurrently.

## Production-only scripts

These load only when `hugo.IsProduction == true` (templates check
`hugo.IsProduction`, not env vars):

- Partytown loader + GA4 gtag scripts (in `_partials/head.html`)
- Disqus embed (`_partials/disqus.html`)

Dev builds emit none of them. Disqus dev shows a "disabled" placeholder.
Disqus also guards on `site.Params.disqusShortname` being non-empty in
production.

## Page bundle conventions

### TypeScript (`scripts/build-ts.mjs`)

- `content/**/script.ts` and `content/**/script.*.ts` are entry points
  -> sibling `script.js` / `script.*.js`. Auto-injected by
  `_partials/page-scripts.html` (globs `script*.js` only).
- `themes/<theme>/assets/ts/*.ts` (top-level only) are entries
  -> `themes/<theme>/static/js/<name>.js`. Loaded manually from
  `baseof.html` end of `<body>`.
- Any other `.ts` (`helpers.ts`, `lib/foo.ts`, etc.) is a module.
  Pulled in by `import` from an entry, inlined via `bundle: true`.
  Never enumerated, never auto-injected.
- No `splitting`. No shared chunks. Per-page isolation by design.

### CSS

- `content/**/styles.css` and `content/**/styles.*.css` are entries
  -> fingerprinted, processed via `css.TailwindCSS`, auto-injected by
  `_partials/page-styles.html` (called from `baseof.html` `<head>` after
  the global CSS partial).
- Page-local CSS can use Tailwind utilities and `@apply`. Tailwind sees
  the same `hugo_stats.json` that drives the site-wide CSS.
- `@import "./_tokens.css"` works for module CSS.

### Generated artifacts (gitignored)

| Path                                        | Producer            |
| ------------------------------------------- | ------------------- |
| `content/**/*.js`, `content/**/*.js.map`    | esbuild             |
| `themes/<theme>/static/js/`                 | esbuild             |
| `themes/<theme>/static/~partytown/`         | `build:partytown`   |
| `data/github.json`                          | `fetch:github`      |
| `hugo_stats.json`                           | Hugo (`buildStats`) |
| `public/`, `resources/`, `.hugo_build.lock` | Hugo                |
| `.tools/`                                   | `install-hugo.sh`   |

Never commit any of these.

## GitHub data prefetch

`scripts/fetch-github.sh` calls `gh api search/issues` for issues + PRs,
enriches each PR with detail data, writes `data/github.json`.

TTL cache: skips fetch if `data/github.json` is younger than
`GITHUB_CACHE_TTL_HOURS` (default 6h). Override with
`GITHUB_CACHE_TTL_HOURS=0`. CI runners always fetch (fresh checkout).

`ubuntu-latest` ships `gh` and `jq` pre-installed. Local dev needs
`gh auth login` once.

## CI / deploy

`.github/workflows/deploy-gh-pages.yml`:

- Triggers on push to `main` or `master`, plus manual `workflow_dispatch`.
- Installs Hugo via the same script flow as local (downloads pinned
  release tarball, verifies SHA256). Sets `HUGO_BIN` so `scripts/hugo`
  uses the pre-extracted binary.
- `GH_TOKEN` is scoped to the Build step only, not job-wide.
- Deploys `public/` to the `gh-pages` branch.

`peaceiris/actions-gh-pages` uses its own `github_token` input, separate
from `GH_TOKEN`.

## Hugo config quirks

`hugo.toml`:

- `disableKinds = ["taxonomy"]`: suppresses the `/blog/tags/` aggregate
  index. Per-tag term pages at `/blog/tags/{tag}/` still render.
- `disableAliases = true`: suppresses Hugo's `aliases:` redirects. Does
  NOT suppress paginator-page-1 redirects at `/blog/1/index.html` and
  `/experiments/1/index.html`. Those are intrinsic to Hugo's paginator;
  they meta-refresh to the section root and are accepted as harmless.
- `pagination.path = ""`: emits `/blog/2/`, not Hugo's default
  `/blog/page/2/`.
- `[permalinks.page]` uses `:contentbasename`. Do not change to `:slug`
  (resolves to title-derived slugs which can mismatch directory names)
  or `:filename` (deprecated since Hugo 0.144).
- `[markup.goldmark.renderer] unsafe = true`: required for content with
  raw HTML (iframe, `<em lang>`, code wrappers). Goldmark strips raw
  HTML silently without it.
- `[build.buildStats] enable = true` plus the two `[[module.mounts]]`
  blocks wire `hugo_stats.json` into Tailwind's class scanner.
  `disableWatch = true` on the stats mount prevents rebuild storms.

A custom `themes/<theme>/layouts/sitemap.xml` overrides Hugo's default
sitemap to include paginator pages 2..N for paginated sections.

## Sort order

Section + term templates use Hugo's default sort (date desc). Editing an
old post (typo, link fix) does not bump it onto page 1. Do not switch
to `lastmod` desc.

This also avoids a Hugo paginator caching gotcha: `head.html` reads
`.Paginator` for paginated titles + canonical, which pre-initializes the
cached paginator with default ordering. Anything in section/term
templates that calls `.Paginate $sortedDifferently` would be silently
overridden. Sticking with default sort means there is no contention.

## i18n

Three languages declared in `hugo.toml`:

- `pt-br`: weight 1, active.
- `en`: weight 2, disabled, URL prefix `/en/`.
- `de`: weight 3, disabled, URL prefix `/de/`.

i18n YAML files exist for all three at `i18n/{pt-br,en,de}.yaml`.
Translation strings are kept in sync across all three.

All internal navigation must use `relLangURL`:

```go-html-template
href="{{ relLangURL "blog/" }}"
```

Hardcoded `/blog/`, `/`, etc. work today (single language at root) but
break the moment a language is enabled. Always use the helper.

Posts can override page language via frontmatter `contentLang`. Templates
use `default .Lang .Params.contentLang` to set `<article lang>`,
JSON-LD `inLanguage`, and the `Continue reading` heading. The heading
uses a literal dict lookup keyed on `contentLang` because Hugo's `i18n`
function is site-language-scoped, not page-content-lang scoped.

To enable `en` or `de`:

1. Author at least one translated post per language.
2. Flip `disabled = true` to `false` in `hugo.toml`.
3. See `docs/migration-debt.md` for posts that need renaming
   (`index.pt-br.md` -> `index.en.md`) at the same time.

## Theme toggle + FOUC

Three coupled pieces:

1. `_partials/theme-init.html`: inline blocking script in `<head>`, runs
   before the CSS link, sets the `dark` class on `<html>` from
   `localStorage.theme`. Must NOT be `defer`/`async`/`type=module`.
2. `_partials/theme-toggle.html`: label + `sr-only` checkbox + visual
   track. The input has `aria-label`; the visual track is `aria-hidden`.
   Do not add `role="switch"` to the visual track (contradictory with
   `aria-hidden`).
3. `assets/ts/theme-toggle.ts`: click handler. Reads `<html>` dark class,
   syncs the checkbox, on change flips the class and persists.

## Theme structure

Hugo 0.146+ flat layout:

- Layouts directly in `themes/<theme>/layouts/` (no `_default/`):
  `baseof.html`, `home.html`, `page.html`, `section.html`, `term.html`,
  `404.html`, `sitemap.xml`.
- Partials at `themes/<theme>/layouts/_partials/` (underscore prefix).
- Inline SVG icons at `themes/<theme>/assets/icons/*.svg`, rendered via
  `_partials/icon.html`. Pass `name` and `class` via dict.

## Static assets

- `static/images/`: favicons, apple-touch-icons. Hugo serves them at
  `/images/`.
- `static/robots.txt`: references `/sitemap-index.xml` (compatibility
  alias, not Hugo's default `/sitemap.xml`).
- `static/sitemap-index.xml`: static compatibility sitemap index that
  points at `/sitemap.xml`. Crawlers that cached the old entry point
  still get a valid chain.

## Tooling

- pnpm-only. Do not run `npm` or `yarn`.
- `pnpm-workspace.yaml` exists for `onlyBuiltDependencies` (pnpm v10
  install-script gate). Not a workspace.
- Formatter: `pnpm format` (oxfmt). Hugo templates are excluded by
  `.oxfmtrc.json` ignore patterns.
- No tests, no stylelint, no ESLint.

## Hard never-dos

- Sort by `lastmod` desc.
- Hardcode internal links (always use `relLangURL`).
- Disable `markup.goldmark.renderer.unsafe`.
- Remove `disableKinds = ["taxonomy"]` or `disableAliases = true`.
- Change permalink token from `:contentbasename`.
- Change `pagination.path = ""`.
- Install Hugo via any method other than `scripts/hugo`.
- Commit any of the gitignored generated artifacts.
- Add `role="switch"` to a `aria-hidden` element.
- Run scripts with `npm` or `yarn`.
