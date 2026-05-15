#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET_DIR="${1:-/root/voiddo-ops/drops/double-text-risk-live-route-sync-20260514}"
LIVE_DIR="/var/www/tells.voiddo.com/double-text-risk"
DIST_DIR="/var/www/tells.voiddo.com/frontend/dist/double-text-risk"

rm -rf "$TARGET_DIR"
mkdir -p "$TARGET_DIR/src"

cp "$ROOT_DIR/site/index.html" "$TARGET_DIR/index.html"
cp "$ROOT_DIR/site/compare-chatgpt-gemini.html" "$TARGET_DIR/compare-chatgpt-gemini.html"
cp "$ROOT_DIR/site/styles.css" "$TARGET_DIR/styles.css"
cp "$ROOT_DIR/site/app.js" "$TARGET_DIR/app.js"
cp "$ROOT_DIR/src/index.js" "$TARGET_DIR/src/index.js"
cp "$ROOT_DIR/brand-spec.md" "$TARGET_DIR/brand-spec.md"
cp "$ROOT_DIR/README.md" "$TARGET_DIR/README.md"
cp "$ROOT_DIR/compare-chatgpt-gemini.md" "$TARGET_DIR/compare-chatgpt-gemini.md"
cp "$ROOT_DIR/from-the-studio.md" "$TARGET_DIR/from-the-studio.md"

perl -0pi -e 's#\.\./src/index\.js#./src/index.js#g' "$TARGET_DIR/app.js"

cat > "$TARGET_DIR/verify-pack.sh" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

sha256sum -c SHA256SUMS

grep -q "double-text-risk" index.html
grep -q "double-text-risk vs ChatGPT or Gemini" compare-chatgpt-gemini.html
grep -q "ghost-or-go" compare-chatgpt-gemini.html
grep -q "message-next-step" compare-chatgpt-gemini.html

printf 'double-text-risk route pack checks passed\n'
EOF

chmod +x "$TARGET_DIR/verify-pack.sh"

cat > "$TARGET_DIR/README-DROP.md" <<'EOF'
# double-text-risk live route sync

Purpose: turn the stale `double-text-risk` tells SPA fallback into a real static acquisition route
and browser compare page aligned with the published npm package metadata.

Contents:

- dedicated live route `index.html`
- dedicated compare page `compare-chatgpt-gemini.html`
- browser app shell `app.js`
- deterministic analyzer source `src/index.js`
- README/package collateral copies for traceability

Verification:

```bash
./verify-pack.sh
```

Live follow-through when the webroot is writable:

```bash
./deploy-live.sh
```
EOF

cat > "$TARGET_DIR/deploy-live.sh" <<EOF
#!/usr/bin/env bash
set -euo pipefail

LIVE_DIR="${LIVE_DIR}"
DIST_DIR="${DIST_DIR}"
SOURCE_DIR="\$(cd "\$(dirname "\${BASH_SOURCE[0]}")" && pwd)"

mkdir -p "\$LIVE_DIR/src" "\$DIST_DIR/src"
cp "\$SOURCE_DIR/index.html" "\$LIVE_DIR/index.html"
cp "\$SOURCE_DIR/compare-chatgpt-gemini.html" "\$LIVE_DIR/compare-chatgpt-gemini.html"
cp "\$SOURCE_DIR/styles.css" "\$LIVE_DIR/styles.css"
cp "\$SOURCE_DIR/app.js" "\$LIVE_DIR/app.js"
cp "\$SOURCE_DIR/src/index.js" "\$LIVE_DIR/src/index.js"

cp "\$SOURCE_DIR/index.html" "\$DIST_DIR/index.html"
cp "\$SOURCE_DIR/compare-chatgpt-gemini.html" "\$DIST_DIR/compare-chatgpt-gemini.html"
cp "\$SOURCE_DIR/styles.css" "\$DIST_DIR/styles.css"
cp "\$SOURCE_DIR/app.js" "\$DIST_DIR/app.js"
cp "\$SOURCE_DIR/src/index.js" "\$DIST_DIR/src/index.js"

printf 'deployed double-text-risk bundle to %s and %s\n' "\$LIVE_DIR" "\$DIST_DIR"
EOF

chmod +x "$TARGET_DIR/deploy-live.sh"

cat > "$TARGET_DIR/DEPLOY-NOTES.md" <<'EOF'
# double-text-risk deploy notes

## Intended live route

- public URL: `https://tells.voiddo.com/double-text-risk/`
- live filesystem target: `/var/www/tells.voiddo.com/frontend/dist/double-text-risk/`

## Files to copy

- `index.html`
- `compare-chatgpt-gemini.html`
- `styles.css`
- `app.js`
- `src/index.js`

## Discovery wiring required at publish time

1. Add `/replytone/` sibling-style footer link in `/var/www/tells.voiddo.com/frontend/src/components/Footer.tsx`:
   - label: `double-text-risk`
   - href: `/double-text-risk/`
2. Add sitemap entry in `/var/www/tells.voiddo.com/frontend/public/sitemap.xml`:
   - `https://tells.voiddo.com/double-text-risk/`
   - `lastmod` current publish date
   - `changefreq` weekly
   - `priority` `0.81`
3. Rebuild frontend from `/var/www/tells.voiddo.com/frontend/` so `dist/sitemap.xml` and app shell stay in sync.

## Verification

- `curl -I https://tells.voiddo.com/double-text-risk/`
- `curl https://tells.voiddo.com/double-text-risk/ | rg "double-text-risk"`
- `curl https://tells.voiddo.com/double-text-risk/compare-chatgpt-gemini.html | rg "double-text-risk vs ChatGPT or Gemini"`
- browser/screenshot check on the public route
- confirm footer and sitemap now mention `double-text-risk`
EOF

(
  cd "$TARGET_DIR"
  sha256sum index.html compare-chatgpt-gemini.html styles.css app.js src/index.js README.md compare-chatgpt-gemini.md from-the-studio.md brand-spec.md DEPLOY-NOTES.md deploy-live.sh verify-pack.sh README-DROP.md > SHA256SUMS
)

printf 'staged double-text-risk site at %s\n' "$TARGET_DIR"
