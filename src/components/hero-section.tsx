'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { HeroHeader } from '@/components/hero-header'
import LogoCloud from '@/components/logo-cloud'
import Features from '@/components/features-4'
import IntegrationsSection from '@/components/integrations-7'
import PricingComparator from '@/components/pricing-comparator'
import FooterSection from '@/components/footer'

export default function HeroSection() {
    return (
        <>
            <HeroHeader />

            <main>
                <div
                    aria-hidden
                    className="z-2 absolute inset-0 isolate hidden opacity-50 contain-strict lg:block">
                    <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
                    <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
                    <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
                </div>

                <section className="overflow-hidden bg-background dark:bg-transparent">
                    <div className="relative mx-auto max-w-5xl px-6 pt-40 pb-28 lg:pt-36 lg:pb-24">
                        <div className="relative z-10 mx-auto max-w-2xl text-center">
                            <h1 className="text-balance text-4xl font-semibold md:text-5xl lg:text-6xl">Modern Software testing reimagined</h1>
                            <p className="mx-auto my-8 max-w-2xl text-xl">Officiis laudantium excepturi ducimus rerum dignissimos, and tempora nam vitae, excepturi ducimus iste provident dolores.</p>

                            <Button
                                asChild
                                size="lg">
                                <Link href="/auth">
                                    <span className="btn-label">Start Building</span>
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <div className="mx-auto -mt-16 max-w-7xl pb-40 md:pb-52 lg:pb-64">
                        <div className="perspective-distant -mr-16 pl-16 lg:-mr-56 lg:pl-56">
                            <div className="[transform:rotateX(20deg);]">
                                <div className="lg:h-176 relative skew-x-[.36rad]">
                                    <div
                                        aria-hidden
                                        className="bg-linear-to-b from-background to-background z-1 absolute inset-0 via-transparent"
                                    />
                                    <div
                                        aria-hidden
                                        className="bg-linear-to-r from-background to-background z-1 absolute inset-0 bg-background/50 via-transparent dark:bg-transparent"
                                    />

                                    <div
                                        aria-hidden
                                        className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px] [--color-border:var(--color-zinc-400)] dark:[--color-border:color-mix(in_oklab,var(--color-white)_20%,transparent)]"
                                    />
                                    <div
                                        aria-hidden
                                        className="from-background z-11 absolute inset-0 bg-gradient-to-l"
                                    />
                                    <div
                                        aria-hidden
                                        className="z-2 absolute inset-0 size-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,transparent_40%,var(--color-background)_100%)]"
                                    />
                                    <div
                                        aria-hidden
                                        className="z-2 absolute inset-0 size-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,transparent_40%,var(--color-background)_100%)]"
                                    />

                                    <div className="relative z-1 dark:hidden outline outline-2 outline-black rounded-(--radius) overflow-hidden">
                                        <Image
                                            className="rounded-(--radius) z-1 relative w-full h-auto"
                                            src="/card.png"
                                            alt="Algoz Tech hero section"
                                            width={2880}
                                            height={2074}
                                        />
                                    </div>
                                    <div className="relative z-1 hidden dark:block outline outline-2 outline-white rounded-(--radius) overflow-hidden">
                                        <Image
                                            className="rounded-(--radius) z-1 relative w-full h-auto"
                                            src="/dark-card.webp"
                                            alt="Algoz Tech hero section"
                                            width={2880}
                                            height={2074}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Logo Cloud Section */}
                <LogoCloud />

                {/* Features Section */}
                <Features />

                {/* Integrations Section */}
                <IntegrationsSection />

                {/* Comparator Section */}
                <PricingComparator />

                {/* Footer Section */}
                <FooterSection />
            </main>
        </>
    )
}
