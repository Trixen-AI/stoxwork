/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Reown (WalletConnect) project ID. */
  readonly VITE_REOWN_PROJECT_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
