import { createBrowserRouter } from 'react-router'
import Landing from '@/pages/Landing'
import NotFound from '@/pages/NotFound'
import { Mark } from '@/components/brand/Logo'

// Each dashboard page is its own chunk, and the dashboard shell (with the wallet
// kit) is another: visitors who never open the app never download any of it.
const page = (load: () => Promise<{ default: React.ComponentType }>) => async () => ({ Component: (await load()).default })

/** Shown while the dashboard chunk loads on a direct visit to /app/... */
function AppLoading() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background" role="status" aria-label="Loading app">
      <Mark className="h-9 w-9 animate-pulse" />
    </div>
  )
}

export const router = createBrowserRouter([
  { path: '/', Component: Landing },
  {
    path: '/app',
    lazy: page(() => import('@/app/AppLayout')),
    HydrateFallback: AppLoading,
    children: [
      { index: true, lazy: page(() => import('@/app/pages/Portfolio')) },
      { path: 'vaults', lazy: page(() => import('@/app/pages/Vaults')) },
      { path: 'vaults/:ticker', lazy: page(() => import('@/app/pages/VaultDetail')) },
      { path: 'lending', lazy: page(() => import('@/app/pages/Lending')) },
      { path: 'trade', lazy: page(() => import('@/app/pages/Trade')) },
      { path: 'strategies', lazy: page(() => import('@/app/pages/Strategies')) },
      { path: 'intelligence', lazy: page(() => import('@/app/pages/Intelligence')) },
      { path: 'activity', lazy: page(() => import('@/app/pages/Activity')) },
    ],
  },
  { path: '*', Component: NotFound },
])
