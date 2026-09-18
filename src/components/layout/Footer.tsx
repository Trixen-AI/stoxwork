import { Logo } from '@/components/brand/Logo'
import { SmartLink } from '@/components/ui/SmartLink'
import { Container } from '@/components/ui/Container'
import { ArrowUpRight, SocialIcon } from '@/components/ui/icons'
import { BRAND, FOOTER_COLUMNS, LEGAL, SOCIAL } from '@/data/site'

export function Footer() {
  return (
    <footer className="relative border-t border-foreground/5 bg-background">
      <div className="divider-gradient absolute top-0 right-0 left-0" />
      <Container className="py-16 lg:py-20">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <a href="#top" aria-label={`${BRAND.name} home`}>
              <Logo className="h-5 w-auto text-foreground" />
            </a>
            <p className="mt-4 text-sm text-foreground/50">{BRAND.tagline}</p>
            <div className="mt-6 flex items-center gap-3">
              {SOCIAL.map((s) => (
                <a
                  key={s.key}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="text-foreground/40 transition-colors hover:text-foreground"
                >
                  <SocialIcon name={s.key} className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-medium text-foreground/80">{col.title}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <SmartLink
                      href={link.href}
                      {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="inline-flex items-center gap-1 text-sm text-foreground/40 transition-colors hover:text-foreground"
                    >
                      {link.label}
                      {link.external && <ArrowUpRight className="h-3 w-3 text-foreground/30" />}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col-reverse items-center gap-6 border-t border-foreground/5 pt-8 sm:flex-row sm:justify-between">
          <p className="text-xs text-foreground/30">
            © 2026 {BRAND.name}
            <span className="mx-2 text-foreground/15">·</span>
            Built on {BRAND.chain}
          </p>
        </div>

        <p className="mt-8 max-w-4xl text-[11px] leading-relaxed text-foreground/25">{LEGAL}</p>
      </Container>
    </footer>
  )
}
