import type { Address } from 'viem'

/**
 * Canonical token contracts on Robinhood Chain mainnet (chain 4663).
 *
 * USDG: https://docs.robinhood.com/chain/contracts
 * Stock Tokens: Robinhood's on-chain asset registry, as served by
 *   https://api.robinhood.com/rhj/assets (the source of the docs' live table).
 * A token with a matching ticker but a different address is NOT a Robinhood Stock
 * Token, so balances are only ever read from these addresses.
 */
export const CHAIN_ID = 4663

export const USDG: Address = '0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168'

export const STOCK_TOKENS: Record<string, Address> = {
  GME: '0x1b0E319c6A659F002271B69dB8A7df2F911c153E',
  CRCL: '0xdF0992E440dD0be65BD8439b609d6D4366bf1CB5',
  AMD: '0x86923f96303D656E4aa86D9d42D1e57ad2023fdC',
  AAPL: '0xaF3D76f1834A1d425780943C99Ea8A608f8a93f9',
  AMZN: '0x12f190a9F9d7D37a250758b26824B97CE941bF54',
  NVDA: '0xd0601CE157Db5bdC3162BbaC2a2C8aF5320D9EEC',
  TSLA: '0x322F0929c4625eD5bAd873c95208D54E1c003b2d',
  MSTR: '0xec262a75e413fAfD0dF80480274532C79D42da09',
  META: '0xc0D6457C16Cc70d6790Dd43521C899C87ce02f35',
  MSFT: '0xe93237C50D904957Cf27E7B1133b510C669c2e74',
  GOOGL: '0x2e0847E8910a9732eB3fb1bb4b70a580ADAD4FE3',
  INTC: '0xc72b96e0E48ecd4DC75E1e45396e26300BC39681',
  SPY: '0x117cc2133c37B721F49dE2A7a74833232B3B4C0C',
}

/**
 * StoxWork vault contracts (ERC-4626, one per Stock Token market).
 * EMPTY until deployment: fill in each vault's address and the Deposit / Withdraw
 * buttons send real transactions. Until then they explain that the vault is not live
 * and send nothing.
 */
export const VAULT_ADDRESSES: Partial<Record<string, Address>> = {}

export const EXPLORER = 'https://robinhoodchain.blockscout.com'
