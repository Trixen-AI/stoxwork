import { useLocation } from 'react-router'

export const SITE_URL = 'https://stoxwork.xyz'

/**
 * Per-page <title> and canonical URL. React 19 hoists both into <head>, so each route
 * gets its own without a helmet library. The description and social tags live once,
 * statically, in index.html.
 */
export function Seo({ title }: { title?: string }) {
  const { pathname } = useLocation()
  const full = title ? `${title} · StoxWork` : 'StoxWork · Tokenized Stock Vaults on Robinhood Chain'
  const path = pathname === '/' ? '/' : pathname.replace(/\/+$/, '')
  return (
    <>
      <title>{full}</title>
      <link rel="canonical" href={`${SITE_URL}${path}`} />
    </>
  )
}
