import { Cpu, Fingerprint, Pencil, Settings2, Sparkles, Zap } from 'lucide-react'

export default function Features() {
    return (
        <section className="py-12 md:py-20">
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
                <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
                    <h2 className="text-balance text-4xl font-medium lg:text-5xl">Built for Traders. Loved by Developers</h2>
                    <p>Launch intelligent trading strategies with AI, real-time data, and automation</p>
                </div>

                <div className="relative mx-auto grid max-w-4xl divide-x divide-y border *:p-12 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Zap className="size-4" />
                            <h3 className="text-sm font-medium">Fast Execution</h3>
                        </div>
                        <p className="text-sm">Lightning-speed trades with zero delay.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Cpu className="size-4" />
                            <h3 className="text-sm font-medium">Smart Charting</h3>
                        </div>
                        <p className="text-sm">Advanced, interactive charts in real time.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Fingerprint className="size-4" />
                            <h3 className="text-sm font-medium">Secure Platform</h3>
                        </div>
                        <p className="text-sm">Your data encrypted and safely stored.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Sparkles className="size-4" />
                            <h3 className="text-sm font-medium">AI-Powered</h3>
                        </div>
                        <p className="text-sm">Automate trading with intelligent algorithms.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Pencil className="size-4" />
                            <h3 className="text-sm font-medium">Full Customization</h3>
                        </div>
                        <p className="text-sm">Tailor every tool to your needs.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Settings2 className="size-4" />
                            <h3 className="text-sm font-medium">Dev Friendly</h3>
                        </div>
                        <p className="text-sm">Built with APIs and coders in mind.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
