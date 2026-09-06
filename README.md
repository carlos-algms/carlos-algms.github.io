# Carlos A. Gomes — portfolio & blog

Live site: <https://carlos-algms.github.io/>

Built with [Hugo](https://gohugo.io/) + Tailwind CSS 4.

## Prerequisites

- Node 24+, pnpm 10
- [GitHub CLI](https://cli.github.com/) authenticated (`gh auth login`)
  for the home page's GitHub Issues / PRs sections. The script falls back
  to empty arrays if `gh` is missing or unauthenticated, so the site still
  builds — those sections just render empty.

`fetch:github` caches its result in `data/github.json` for 6h by default.
Override with `GITHUB_CACHE_TTL_HOURS=0 pnpm fetch:github` to force a refresh.

## Local development

```sh
pnpm install
pnpm dev          # hugo server + esbuild watch on http://localhost:1313/
```

## Production build

```sh
pnpm build        # partytown copy → github fetch → ts build → hugo build
```
