#!/usr/bin/env bash
set -euo pipefail

# Prefetch GitHub issues + PRs into data/github.json for Hugo to render.
# Tolerant of network/rate-limit failures: emits empty arrays and exits 0.

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="$ROOT/data"
OUT_FILE="$OUT_DIR/github.json"

mkdir -p "$OUT_DIR"

# TTL cache: skip fetch if existing file is younger than the configured age.
# Override with GITHUB_CACHE_TTL_HOURS=0 (or any small value) to force a refresh.
CACHE_TTL_HOURS="${GITHUB_CACHE_TTL_HOURS:-6}"
if [ -f "$OUT_FILE" ] && [ "$CACHE_TTL_HOURS" -gt 0 ]; then
  mtime=$(stat -f %m "$OUT_FILE" 2>/dev/null || stat -c %Y "$OUT_FILE")
  age_seconds=$(( $(date +%s) - mtime ))
  ttl_seconds=$(( CACHE_TTL_HOURS * 3600 ))
  if [ "$age_seconds" -lt "$ttl_seconds" ]; then
    echo "github data cached ($((age_seconds / 60))m old, TTL ${CACHE_TTL_HOURS}h) — skipping fetch"
    exit 0
  fi
fi

LIMIT=6
QUERY_BASE='author:carlos-algms+-org:carlos-algms+-user:carlos-algms+-user:webdev-tools+-user:talesprates'

write_empty() {
  echo '{"issues":[],"prs":[]}' > "$OUT_FILE"
}

if ! command -v gh >/dev/null 2>&1; then
  echo "warning: gh CLI not found, writing empty GitHub data" >&2
  write_empty
  exit 0
fi

fetch_search() {
  local type="$1"
  local query="is:${type}+${QUERY_BASE}"
  gh api "search/issues?sort=created&order=desc&per_page=${LIMIT}&q=${query}" \
    --jq '.items'
}

# Issues: search endpoint already returns everything the template needs.
issues_json='[]'
if issues_json=$(fetch_search issue 2>/dev/null); then
  : # ok
else
  echo "warning: failed to fetch GitHub issues, using empty list" >&2
  issues_json='[]'
fi

# PRs: search returns the basic shape; per-PR enrichment needed for head/base/repo.
prs_json='[]'
if prs_search=$(fetch_search pr 2>/dev/null); then
  prs_json=$(
    echo "$prs_search" \
      | jq -c '.[]' \
      | while IFS= read -r pr; do
          pr_url=$(echo "$pr" | jq -r '.pull_request.url')
          if pr_detail=$(gh api "$pr_url" 2>/dev/null); then
            echo "$pr" | jq --argjson detail "$pr_detail" \
              '.pull_request = (.pull_request + $detail)'
          else
            # Drop this PR if detail fetch fails (e.g. deleted, 404).
            echo "warning: failed to enrich PR $pr_url, dropping" >&2
          fi
        done \
      | jq -s '.'
  ) || prs_json='[]'
else
  echo "warning: failed to fetch GitHub PRs, using empty list" >&2
  prs_json='[]'
fi

# Compose final JSON. Both payloads arrive on stdin rather than as --argjson:
# Linux caps a single argument at 128KB (MAX_ARG_STRLEN), which the enriched
# PR list now exceeds, so passing it in argv fails on CI with E2BIG.
printf '%s\n%s\n' "$issues_json" "$prs_json" \
  | jq -n -c 'input as $issues | input as $prs | {issues: $issues, prs: $prs}' \
  > "$OUT_FILE"

echo "fetched $(echo "$issues_json" | jq 'length') issues, $(echo "$prs_json" | jq 'length') PRs into $OUT_FILE"
