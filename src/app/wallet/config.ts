import { SolanaAdapter } from '@reown/appkit-adapter-solana/react'
import { solana } from '@reown/appkit/networks'
import { createAppKit } from '@reown/appkit/react'

/** Set in .env as VITE_REOWN_PROJECT_ID (from https://dashboard.reown.com). */
export const projectId = (import.meta.env?.VITE_REOWN_PROJECT_ID as string | undefined)?.trim() ?? ''

/** Without a project ID the modal cannot start, so the UI shows a setup notice instead. */
export const walletEnabled = projectId.length > 0

export const solanaNetwork = solana

if (walletEnabled) {
  createAppKit({
    adapters: [new SolanaAdapter()],
    projectId,
    networks: [solana],
    defaultNetwork: solana,
    metadata: {
      name: 'EquiYield',
      description: 'Put your USDG to work in tokenized stock vaults on Solana.',
      url: window.location.origin,
      icons: [`${window.location.origin}/brand/logo-500.png`],
    },
    // Wallet connections only: email and social logins need extra setup in the
    // Reown dashboard and are not part of this product's flow.
    features: { email: false, socials: false, analytics: false },
    // The modal remembers the last wallet used and marks it "Recent", and the
    // session is restored on reload, so returning users reconnect in one tap.
    themeMode: 'dark',
    themeVariables: {
      '--w3m-accent': '#f98500',
      '--w3m-color-mix': '#0a0a0b',
      '--w3m-color-mix-strength': 20,
      '--w3m-font-family': '"Schibsted Grotesk Variable", ui-sans-serif, system-ui, sans-serif',
      '--w3m-border-radius-master': '2px',
    },
  })
}
