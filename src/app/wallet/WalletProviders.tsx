import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useMemo, type ReactNode } from 'react'
import { formatUnits, type Address } from 'viem'
import { useAccount, useBalance, useReadContracts, WagmiProvider } from 'wagmi'
import { useStore } from '@/app/state/store'
import { CHAIN_ID, STOCK_TOKENS, USDG } from '@/data/tokens'
import { erc20Abi } from './abi'
import { walletEnabled, wagmiAdapter } from './config'

const queryClient = new QueryClient()

/** Balances refresh in the background at this interval. */
const REFRESH_MS = 15_000

// Every token the dashboard shows a balance for, in display order.
const TOKENS: Array<{ symbol: string; address: Address }> = [
  { symbol: 'USDG', address: USDG },
  ...Object.entries(STOCK_TOKENS).map(([symbol, address]) => ({ symbol, address })),
]

/**
 * Mirrors the wagmi account into the dashboard store, so every page reads one state
 * object. Connect, disconnect, account switches and the automatic reconnect on
 * reload all flow through here.
 */
function WalletBridge() {
  const { address, isConnected } = useAccount()
  const { dispatch } = useStore()

  useEffect(() => {
    dispatch({ type: 'walletSync', connected: isConnected, address: address ?? '' })
  }, [isConnected, address, dispatch])

  return isConnected && address ? <BalanceReader owner={address} /> : null
}

/**
 * Reads the wallet's real balances from Robinhood Chain: native ETH, then USDG and
 * every Stock Token by their canonical addresses. Always asks chain 4663, whatever
 * network the wallet has selected, because that is where these tokens live.
 */
function BalanceReader({ owner }: { owner: Address }) {
  const { dispatch } = useStore()

  const eth = useBalance({ address: owner, chainId: CHAIN_ID, query: { refetchInterval: REFRESH_MS } })

  const contracts = useMemo(
    () =>
      TOKENS.flatMap((t) => [
        { address: t.address, abi: erc20Abi, functionName: 'balanceOf' as const, args: [owner] as const, chainId: CHAIN_ID },
        { address: t.address, abi: erc20Abi, functionName: 'decimals' as const, chainId: CHAIN_ID },
      ]),
    [owner],
  )
  const tokens = useReadContracts({ contracts, allowFailure: true, query: { refetchInterval: REFRESH_MS } })

  useEffect(() => {
    if (tokens.isPending || eth.isPending) {
      dispatch({ type: 'balances', status: 'loading' })
      return
    }
    if (tokens.isError && eth.isError) {
      dispatch({ type: 'balances', status: 'error' })
      return
    }
    const out: Record<string, number> = {}
    if (eth.data) out.ETH = Number(formatUnits(eth.data.value, eth.data.decimals))
    TOKENS.forEach((t, i) => {
      const b = tokens.data?.[i * 2]
      const d = tokens.data?.[i * 2 + 1]
      if (b?.status === 'success' && d?.status === 'success') {
        out[t.symbol] = Number(formatUnits(b.result as bigint, Number(d.result)))
      }
    })
    dispatch({ type: 'balances', status: 'ready', balances: out })
  }, [tokens.data, tokens.isPending, tokens.isError, eth.data, eth.isPending, eth.isError, dispatch])

  return null
}

export function WalletProviders({ children }: { children: ReactNode }) {
  // The query client is always present (forms use it), even before a project ID is set.
  if (!walletEnabled || !wagmiAdapter) return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <WalletBridge />
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
