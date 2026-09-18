# StoxWork

Landing page for StoxWork, a protocol that runs one ERC-4626 vault per tokenized
stock market on Robinhood Chain. Deposit USDG into a market's vault, earn a share of
the trading fees its liquidity collects.

Live at **https://stoxwork.xyz**. The landing page is at `/`, the dashboard at `/app`.

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

Vite inlines `VITE_*` variables at build time, so change them and rebuild. In the Reown
dashboard, allowlist `https://stoxwork.xyz`, `https://www.stoxwork.xyz` and your local
dev URL, or wallets will refuse to connect. Without the variable the site still works;
the dashboard shows "Wallet not configured" in place of the Connect button.

## Deploy (Netlify)

`netlify.toml` holds the whole setup: `npm run build`, publish `dist`, Node 22, the SPA
fallback so routes like `/app/lending` survive a refresh, a `www` to apex redirect, cache
headers and security headers.

1. Netlify: **Add new site > Import an existing project**, pick this GitHub repo.
   Build settings are read from `netlify.toml`; leave the form's defaults.
2. **Site configuration > Environment variables**: add `VITE_REOWN_PROJECT_ID`.
3. **Domain management**: add `stoxwork.xyz` as the primary domain (and `www.stoxwork.xyz`),
   then point DNS at Netlify and let it issue the HTTPS certificate.
4. Deploy. After changing an environment variable, trigger a new deploy.

## SEO

`index.html` carries the title, description, Open Graph and X card tags (image:
`public/og.png`, 1200x630), and Organization / WebSite / WebApplication structured data.
Each route sets its own `<title>` and canonical URL (`src/components/Seo.tsx`).
`public/robots.txt` and `public/sitemap.xml` list the public routes on `stoxwork.xyz`.
Regenerate the share image and app icons with `node scripts/build-social.mjs`.

## Onchain

Wallet balances are read live from Robinhood Chain (chain 4663) for ETH, USDG and the 13
canonical Stock Tokens (`src/data/tokens.ts`, sourced from Robinhood's asset registry).
Vault deposits and withdrawals call the ERC-4626 vaults as soon as their addresses are set
in `VAULT_ADDRESSES` in that file; until then the buttons explain that the vault is not
live and send nothing.

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
| **Protocol figures are sample data** until deployment (TVL, APR, inventory, lending rates, STOX burns) | `src/data/markets.ts` |
| Vault contract addresses (empty until deployed) | `src/data/tokens.ts` → `VAULT_ADDRESSES` |
| SPY logo (no official SVG available, shows a ticker chip) | `src/components/brand/StockLogo.tsx` |
| Internal routes (all links are in-page anchors) | `src/data/site.ts` |

Logo sources: `src/assets/partners/SOURCES.md`, `src/assets/stocks/SOURCES.md`,
`src/assets/social/SOURCES.md`.

## Notes

Brand names, logos and ticker symbols identify the networks, contracts and underlying
assets the protocol works with. They are not partnerships or endorsements.
