import { Link } from 'react-router'
import { Logo } from '@/components/brand/Logo'
import { Seo } from '@/components/Seo'

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <Seo title="Page not found" />
      <meta name="robots" content="noindex" />
      <Logo className="h-6 w-auto text-foreground" />
      <div>
        <p className="font-mono text-xs tracking-[0.14em] text-foreground/40 uppercase">404</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">This page does not exist</h1>
      </div>
      <div className="flex gap-2">
        <Link to="/" className="rounded-lg border border-foreground/10 px-4 py-2 text-sm text-foreground/70 hover:text-foreground">
          Home
        </Link>
        <Link to="/app" className="cta-primary rounded-lg px-4 py-2 text-sm font-medium text-background hover:brightness-110">
          Launch App
        </Link>
      </div>
    </main>
  )
}
