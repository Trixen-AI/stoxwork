import { useCallback, useState } from 'react'
import { useToast } from './Toasts'
import { useStore, validate, type TxAction } from '@/app/state/store'
import { VAULT_ADDRESSES } from '@/data/tokens'

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

/**
 * Submits a transaction.
 *
 * The amount is always checked against the wallet's real balance first. The vault
 * programs are not deployed on Solana yet, so nothing can be signed: the button
 * stays usable and says so plainly instead of pretending. Once a market's program
 * account is set in data/tokens.ts, wire the instruction here.
 */
export function useTx() {
  const { state } = useStore()
  const { push } = useToast()
  const [pending] = useState(false)

  const run = useCallback(
    (action: TxAction, _success: string) => {
      const err = validate(state, action)
      if (err) {
        push({ tone: 'error', title: 'Transaction not sent', body: err })
        return
      }
      if (!VAULT_ADDRESSES[action.ticker]) {
        push({
          tone: 'info',
          title: `${action.ticker} ${PRODUCT[action.type]} is not live yet`,
          body: 'The EquiYield program for this is not deployed on Solana yet. Nothing was sent and your balance is unchanged.',
        })
      }
    },
    [state, push],
  )

  return { run, pending }
}
