import { getAccount, readContract, switchChain, waitForTransactionReceipt, writeContract } from '@wagmi/core'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { parseUnits, type Address } from 'viem'
import { useToast } from './Toasts'
import { useStore, validate, type TxAction } from '@/app/state/store'
import { erc20Abi, erc4626Abi } from '@/app/wallet/abi'
import { wagmiAdapter } from '@/app/wallet/config'
import { CHAIN_ID, EXPLORER, USDG, VAULT_ADDRESSES } from '@/data/tokens'

const PRODUCT: Record<TxAction['type'], string> = {
  deposit: 'vault',
  withdraw: 'vault',
  supply: 'lending market',
  withdrawSupply: 'lending market',
  lock: 'lending market',
  unlock: 'lending market',
  borrow: 'lending market',
  repay: 'lending market',
  swap: 'vault pool',
}

/** Turns a wallet or RPC error into one short sentence a person can act on. */
function reason(e: unknown) {
  const msg = e instanceof Error ? e.message : String(e)
  if (/user rejected|denied|rejected the request/i.test(msg)) return 'You rejected the request in your wallet.'
  if (/insufficient funds/i.test(msg)) return 'Not enough ETH on Robinhood Chain to pay for gas.'
  return msg.split('\n')[0].slice(0, 160)
}

/**
 * Submits a transaction for real. Vault deposits and withdrawals go straight to the
 * vault's ERC-4626 contract once its address is set in data/tokens.ts. Anything
 * whose contract is not deployed yet is refused with a plain explanation: nothing
 * is sent and no balance changes.
 */
export function useTx() {
  const { state } = useStore()
  const { push } = useToast()
  const queryClient = useQueryClient()
  const [pending, setPending] = useState(false)

  const run = useCallback(
    async (action: TxAction, success: string) => {
      const err = validate(state, action)
      if (err) {
        push({ tone: 'error', title: 'Transaction not sent', body: err })
        return
      }

      const vault = VAULT_ADDRESSES[action.ticker]
      const supported = action.type === 'deposit' || action.type === 'withdraw'
      if (!vault || !supported || !wagmiAdapter) {
        push({
          tone: 'info',
          title: `${action.ticker} ${PRODUCT[action.type]} is not live yet`,
          body: 'The StoxWork contract for this is not deployed on Robinhood Chain yet. Nothing was sent and your balance is unchanged.',
        })
        return
      }

      const config = wagmiAdapter.wagmiConfig
      const owner = state.wallet.address as Address
      setPending(true)
      try {
        if (getAccount(config).chainId !== CHAIN_ID) await switchChain(config, { chainId: CHAIN_ID })

        const decimals = Number(await readContract(config, { address: USDG, abi: erc20Abi, functionName: 'decimals', chainId: CHAIN_ID }))
        const usdgAmount = action.type === 'deposit' ? action.usdg : action.shares * state.vaults[action.ticker].pricePerShare
        const assets = parseUnits(usdgAmount.toFixed(Math.min(decimals, 8)), decimals)

        let hash: `0x${string}`
        if (action.type === 'deposit') {
          // Approve only what this deposit needs, and only when the allowance is short.
          const allowance = await readContract(config, { address: USDG, abi: erc20Abi, functionName: 'allowance', args: [owner, vault], chainId: CHAIN_ID })
          if (allowance < assets) {
            push({ tone: 'info', title: 'Approve USDG', body: 'Confirm the spending approval in your wallet first.' })
            const approveHash = await writeContract(config, { address: USDG, abi: erc20Abi, functionName: 'approve', args: [vault, assets], chainId: CHAIN_ID })
            await waitForTransactionReceipt(config, { hash: approveHash, chainId: CHAIN_ID })
          }
          hash = await writeContract(config, { address: vault, abi: erc4626Abi, functionName: 'deposit', args: [assets, owner], chainId: CHAIN_ID })
        } else {
          hash = await writeContract(config, { address: vault, abi: erc4626Abi, functionName: 'withdraw', args: [assets, owner, owner], chainId: CHAIN_ID })
        }

        const receipt = await waitForTransactionReceipt(config, { hash, chainId: CHAIN_ID })
        if (receipt.status !== 'success') throw new Error('The transaction reverted onchain.')
        push({ tone: 'success', title: success, body: `Confirmed on Robinhood Chain · ${EXPLORER}/tx/${hash}` })
        // Balances come from chain: re-read them now instead of waiting for the next poll.
        await queryClient.invalidateQueries()
      } catch (e) {
        push({ tone: 'error', title: 'Transaction failed', body: reason(e) })
      } finally {
        setPending(false)
      }
    },
    [state, push, queryClient],
  )

  return { run, pending }
}
