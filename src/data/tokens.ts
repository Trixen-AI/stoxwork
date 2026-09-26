/**
 * Canonical SPL mints on Solana mainnet.
 *
 * USDG (Global Dollar, issued by Paxos) and the xStocks tokenized equities issued by
 * Backed Finance. Every address here is taken from Jupiter's verified token list and
 * was checked on-chain (symbol and decimals) before being written down: many
 * unverified tokens copy these tickers, and balances are only ever read from these
 * mints.
 */

/** Native SOL, shown for network fees. Not an SPL mint. */
export const SOL_DECIMALS = 9

export const USDG = '2u1tszSeqZ3qBWF3uNGPFc8TzMk2tdiwknnRMWGWjGWH'
export const USDG_DECIMALS = 6

/** Ticker -> { mint, symbol of the on-chain token }. All xStocks use 8 decimals. */
export const STOCK_TOKENS: Record<string, { mint: string; symbol: string }> = {
  AAPL: { mint: 'XsbEhLAtcf6HdfpFZ5xEMdqW8nfAvcsP5bdudRLJzJp', symbol: 'AAPLx' },
  AMD: { mint: 'XsXcJ6GZ9kVnjqGsjBnktRcuwMBmvKWh8S93RefZ1rF', symbol: 'AMDx' },
  AMZN: { mint: 'Xs3eBt7uRfJX8QUs4suhyU8p2M6DoUDrJyWBa8LLZsg', symbol: 'AMZNx' },
  CRCL: { mint: 'XsueG8BtpquVJX9LVLLEGuViXUungE6WmK5YZ3p3bd1', symbol: 'CRCLx' },
  GME: { mint: 'Xsf9mBktVB9BSU5kf4nHxPq5hCBJ2j2ui3ecFGxPRGc', symbol: 'GMEx' },
  GOOGL: { mint: 'XsCPL9dNWBMvFtTmwcCA5v3xWPSMEBCszbQdiLLq6aN', symbol: 'GOOGLx' },
  INTC: { mint: 'XshPgPdXFRWB8tP1j82rebb2Q9rPgGX37RuqzohmArM', symbol: 'INTCx' },
  META: { mint: 'Xsa62P5mvPszXL1krVUnU5ar38bBSVcWAB6fmPCo5Zu', symbol: 'METAx' },
  MSFT: { mint: 'XspzcW1PRtgf6Wj92HCiZdjzKCyFekVD8P5Ueh3dRMX', symbol: 'MSFTx' },
  MSTR: { mint: 'XsP7xzNPvEHS1m6qfanPUGjNmdnmsLKEoNAnHjdxxyZ', symbol: 'MSTRx' },
  NVDA: { mint: 'Xsc9qvGR1efVDFGLrVsmkzv3qi45LTBjeUKSPmx9qEh', symbol: 'NVDAx' },
  SPY: { mint: 'XsoCS1TfEyfFhfvj8EtZ528L3CaKBDBRqRapnBbDF2W', symbol: 'SPYx' },
  TSLA: { mint: 'XsDoVfqeBukxuZHWhdvWHBhgEHjGNst4MLodqsJHzoB', symbol: 'TSLAx' },
}

/** mint -> ticker, for turning a wallet's token accounts back into markets. */
export const MINT_TO_TICKER = new Map(Object.entries(STOCK_TOKENS).map(([t, v]) => [v.mint, t]))

/**
 * EquiYield vault program accounts, one per market.
 * EMPTY until deployment: fill these in and the Deposit / Withdraw buttons send real
 * transactions. Until then they explain that the vault is not live and send nothing.
 */
export const VAULT_ADDRESSES: Partial<Record<string, string>> = {}

/** Public RPC by default; set VITE_SOLANA_RPC to your own endpoint for production. */
const RPC_FROM_ENV = (import.meta.env?.VITE_SOLANA_RPC as string | undefined)?.trim()
export const RPC_URL = RPC_FROM_ENV || 'https://api.mainnet-beta.solana.com'

export const EXPLORER = 'https://solscan.io'
export const explorerAddress = (a: string) => `${EXPLORER}/account/${a}`
export const explorerTx = (sig: string) => `${EXPLORER}/tx/${sig}`
