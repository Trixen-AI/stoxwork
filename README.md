# EquiYield

Landing page and dashboard for EquiYield, a protocol that runs one vault per tokenized
stock market on Solana. Deposit USDG into a market's vault, earn a share of
the trading fees its liquidity collects.

Live at **https://equiyield.xyz**. The landing page is at `/`, the dashboard at `/app`.

## Run it

```bash
cp .env.example .env   # then fill in VITE_REOWN_PROJECT_ID
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production bundle
npm run lint
```

## Environment variables

| name | required | what it is |
|---|---|---|
| `VITE_REOWN_PROJECT_ID` | yes | Reown (WalletConnect) project ID for the Connect wallet modal, from https://dashboard.reown.com |
| `VITE_SOLANA_RPC` | no | Solana RPC endpoint for reading balances. Defaults to the public mainnet RPC, which is rate limited: set your own for production. |

Vite inlines `VITE_*` variables at build time, so change them and rebuild. In the Reown
dashboard, allowlist `https://equiyield.xyz`, `https://www.equiyield.xyz` and your local
dev URL, or wallets will refuse to connect. Without the variable the site still works;
the dashboard shows "Wallet not configured" in place of the Connect button.

## Deploy (Vercel)

`vercel.json` holds the whole setup: Vite preset, `npm ci`, `npm run build`, output `dist`,
the SPA rewrite so routes like `/app/lending` survive a refresh, a `www` to apex redirect,
cache headers (hashed assets cached for a year, HTML always fresh) and security headers.
Node is pinned to 22 through `engines` in `package.json`.

1. Vercel: **Add New > Project**, import the GitHub repo. The Vite preset and build settings
   come from `vercel.json`; leave the form's defaults.
2. **Settings > Environment Variables**: add `VITE_REOWN_PROJECT_ID` (and `VITE_SOLANA_RPC`),
   ticking Production and Preview.
3. **Settings > Domains**: add `equiyield.xyz` and `www.equiyield.xyz`. Point DNS at Vercel as
   the dashboard instructs (A record `76.76.21.21` for the apex, CNAME `cname.vercel-dns.com`
   for `www`); HTTPS is issued automatically.
4. Deploy. Every push to `main` then deploys to production, other branches get previews.
   After changing an environment variable, redeploy.

In the Reown dashboard, allowlist `https://equiyield.xyz` and `https://www.equiyield.xyz`.
Preview deployments get their own `*.vercel.app` URL: add it too if you want to test
wallet connections on a preview.

`netlify.toml` is kept for anyone deploying to Netlify instead; Vercel ignores it.

## SEO

`index.html` carries the title, description, Open Graph and X card tags (image:
`public/og.png`, 1200x630), and Organization / WebSite / WebApplication structured data.
Each route sets its own `<title>` and canonical URL (`src/components/Seo.tsx`).
`public/robots.txt` and `public/sitemap.xml` list the public routes on `equiyield.xyz`.
Regenerate the share image and app icons with `node scripts/build-social.mjs`.

## Onchain

Wallet balances are read live from Solana mainnet: native SOL for fees, USDG, and the 13
canonical xStocks by Backed. Every mint in `src/data/tokens.ts` comes from Jupiter's
verified token list and was checked on-chain for symbol and decimals; USDG and the
xStocks are Token-2022 mints. Vault deposits and withdrawals are wired once each
market's program account is set in `VAULT_ADDRESSES` in that file. Until then the
buttons stay usable and explain that the vault is not live, and send nothing.

## Layout

```
src/
  assets/
    partners/        official third-party brand SVGs, unmodified (SOURCES.md)
    social/          official social marks, downloaded for reference (SOURCES.md)
  components/
    brand/           logo, mark, outlined wordmark, ticker chips, partner logos
    hero/            the hero's media stack, lattice, instrumentation, market field
    layout/          header (nav, chips, mobile menu) and footer
    sections/        one file per page section
    ui/              section shell, headings, buttons, pills, icons, rotating word
  data/              copy and figures as typed constants
  lib/               class merge, shared motion variants and easing
  styles/            tokens.css, base.css, components.css
scripts/
  build-logo.mjs     regenerates the logo family and the outlined wordmark
  fonts/             brand font instance used to outline the wordmark (OFL)
```

## Brand

One hue does the work: gold carries the vault, a data blue carries the borrow side,
and a rose appears only on the short leg of the delta-neutral card. Everything else is
neutral ink on `#0e0f11`.

- Type: Schibsted Grotesk (sans) and JetBrains Mono (mono), both open licence.
- Logo: one continuous S whose top stroke kicks up like a price tick, on a gold tile
  (stocks, put to work). The wordmark is outlined to paths from the brand font, so it
  renders identically without the webfont.

Regenerate the logo family after any change to the mark:

```bash
node scripts/build-logo.mjs
```

That writes `public/brand/logo.svg`, `logo-light.svg`, `mark.svg`, `public/favicon.svg`,
two 500x500 PNGs, and `src/components/brand/wordmark.ts`. It reads
`scripts/fonts/SchibstedGrotesk-600.ttf`, the variable font instanced at `wght=600`
and shipped under the OFL alongside its licence.

## Placeholders to fill in

| what | where |
|---|---|
| **Protocol figures are sample data** until deployment (TVL, APR, inventory, lending rates, EQY burns) | `src/data/markets.ts` |
| Vault contract addresses (empty until deployed) | `src/data/tokens.ts` → `VAULT_ADDRESSES` |
| SPY logo (no official SVG available, shows a ticker chip) | `src/components/brand/StockLogo.tsx` |
| Internal routes (all links are in-page anchors) | `src/data/site.ts` |

Logo sources: `src/assets/partners/SOURCES.md`, `src/assets/stocks/SOURCES.md`,
`src/assets/social/SOURCES.md`.

## Notes

Brand names, logos and ticker symbols identify the networks, contracts and underlying
assets the protocol works with. They are not partnerships or endorsements.
