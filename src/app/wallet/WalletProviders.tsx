import { useAppKitAccount } from '@reown/appkit/react'
import { Connection, PublicKey } from '@solana/web3.js'
import { useEffect, type ReactNode } from 'react'
import { useStore } from '@/app/state/store'
import { MINT_TO_TICKER, RPC_URL, SOL_DECIMALS, USDG } from '@/data/tokens'
import { walletEnabled } from './config'

/** Balances refresh in the background at this interval. */
const REFRESH_MS = 15_000

// USDG and the xStocks are Token-2022 mints; the classic program is queried too so a
// wallet holding legacy token accounts still shows the right balance.
const TOKEN_PROGRAMS = [
  new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
  new PublicKey('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'),
]

const connection = new Connection(RPC_URL, 'confirmed')

/**
 * Mirrors the connected account into the store and reads its real balances from
 * Solana: native SOL for fees, USDG, and any xStock the wallet holds.
 */
function WalletBridge() {
  const { address, isConnected } = useAppKitAccount()
  const { dispatch } = useStore()

  useEffect(() => {
    dispatch({ type: 'walletSync', connected: isConnected, address: address ?? '' })
  }, [isConnected, address, dispatch])

  useEffect(() => {
    if (!isConnected || !address) return
    let alive = true

    const read = async () => {
      try {
        const owner = new PublicKey(address)
        const [lamports, ...accountSets] = await Promise.all([
          connection.getBalance(owner),
          ...TOKEN_PROGRAMS.map((programId) => connection.getParsedTokenAccountsByOwner(owner, { programId })),
        ])
        if (!alive) return

        const out: Record<string, number> = { SOL: lamports / 10 ** SOL_DECIMALS }
        for (const set of accountSets) {
          for (const { account } of set.value) {
            const info = account.data.parsed?.info
            const mint: string | undefined = info?.mint
            const ui: number = info?.tokenAmount?.uiAmount ?? 0
            if (!mint || ui <= 0) continue
            if (mint === USDG) out.USDG = (out.USDG ?? 0) + ui
            const ticker = MINT_TO_TICKER.get(mint)
            if (ticker) out[ticker] = (out[ticker] ?? 0) + ui
          }
        }
        dispatch({ type: 'balances', status: 'ready', balances: out })
      } catch {
        if (alive) dispatch({ type: 'balances', status: 'error' })
      }
    }

    dispatch({ type: 'balances', status: 'loading' })
    void read()
    const id = setInterval(read, REFRESH_MS)
    return () => {
      alive = false
      clearInterval(id)
    }
  }, [isConnected, address, dispatch])

  return null
}

export function WalletProviders({ children }: { children: ReactNode }) {
  return (
    <>
      {walletEnabled ? <WalletBridge /> : null}
      {children}
    </>
  )
}
