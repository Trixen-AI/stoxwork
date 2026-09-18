import { Seo } from '@/components/Seo'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { FeeSplit } from '@/components/sections/FeeSplit'
import { FooterCta } from '@/components/sections/FooterCta'
import { Guarded } from '@/components/sections/Guarded'
import { Hero } from '@/components/sections/Hero'
import { Lending, Strategies, Vaults } from '@/components/sections/Products'
import { ProtocolFigures } from '@/components/sections/ProtocolFigures'
import { TopVaults } from '@/components/sections/TopVaults'

export default function Landing() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Seo />
      <Header />
      <main className="flex-1">
        <Hero />
        <TopVaults />
        <ProtocolFigures />
        <Vaults />
        <Lending />
        <Strategies />
        <FeeSplit />
        <Guarded />
        <FooterCta />
      </main>
      <Footer />
    </div>
  )
}
