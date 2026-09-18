import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { createAppKit } from '@reown/appkit/react'
import { defineChain } from '@reown/appkit/networks'

/**
 * Robinhood Chain, from the official network table:
 * https://docs.robinhood.com/chain/connecting and /chain/add-network-to-wallet
 */
export const robinhoodChain = defineChain({
  id: 4663,
  caipNetworkId: 'eip155:4663',
  chainNamespace: 'eip155',
  name: 'Robinhood Chain',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: { default: { http: ['https://rpc.mainnet.chain.robinhood.com'] } },
  blockExplorers: { default: { name: 'Blockscout', url: 'https://robinhoodchain.blockscout.com' } },
})

export const robinhoodChainTestnet = defineChain({
  id: 46630,
  caipNetworkId: 'eip155:46630',
  chainNamespace: 'eip155',
  name: 'Robinhood Chain Testnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: { default: { http: ['https://rpc.testnet.chain.robinhood.com'] } },
  blockExplorers: { default: { name: 'Explorer', url: 'https://explorer.testnet.chain.robinhood.com' } },
  testnet: true,
})

/** Set in .env as VITE_REOWN_PROJECT_ID (from https://dashboard.reown.com). */
export const projectId = (import.meta.env.VITE_REOWN_PROJECT_ID as string | undefined)?.trim() ?? ''

/** Without a project ID the modal cannot start, so the UI shows a setup notice instead. */
export const walletEnabled = projectId.length > 0

// Mainnet first, so it is the default network; testnet stays selectable in the modal.
const networks = [robinhoodChain, robinhoodChainTestnet] as [typeof robinhoodChain, typeof robinhoodChainTestnet]

export const wagmiAdapter = walletEnabled ? new WagmiAdapter({ projectId, networks }) : null

if (walletEnabled && wagmiAdapter) {
  createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks,
    defaultNetwork: robinhoodChain,
    metadata: {
      name: 'StoxWork',
      description: 'Put your USDG to work in tokenized stock vaults on Robinhood Chain.',
      url: window.location.origin,
      icons: [`${window.location.origin}/brand/logo-500.png`],
    },
    // Wallet connections only: email and social logins need extra setup in the
    // Reown dashboard and are not part of this product's flow.
    features: { email: false, socials: false, analytics: false },
    // The modal remembers the last wallet used and marks it "Recent", and wagmi
    // restores the session on reload, so returning users reconnect in one tap.
    themeMode: 'dark',
    themeVariables: {
      '--w3m-accent': '#f2c55c',
      '--w3m-color-mix': '#0e0f11',
      '--w3m-color-mix-strength': 20,
      '--w3m-font-family': '"Schibsted Grotesk Variable", ui-sans-serif, system-ui, sans-serif',
      '--w3m-border-radius-master': '2px',
    },
  })
}
