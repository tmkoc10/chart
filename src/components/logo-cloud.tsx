import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'
import Image from 'next/image'

export default function LogoCloud() {
    return (
        <section className="bg-background overflow-hidden">
            <div className="group relative m-auto max-w-7xl px-6">
                <div className="flex flex-col items-center md:flex-row">
                    <div className="md:max-w-44 md:border-r md:pr-6">
                        <p className="text-end text-sm font-medium text-muted-foreground">Trusted by 110+ brokers</p>
                    </div>
                    <div className="relative md:w-[calc(100%-11rem)]">
                        <InfiniteSlider
                            speedOnHover={20}
                            speed={40}
                            gap={112}>
                            <div className="flex">
                                <Image
                                    className="mx-auto h-5 w-auto dark:invert"
                                    src="https://html.tailus.io/blocks/customers/nvidia.svg"
                                    alt="Nvidia Logo"
                                    height={20}
                                    width={100}
                                />
                            </div>

                            <div className="flex">
                                <Image
                                    className="mx-auto h-4 w-auto dark:invert"
                                    src="https://html.tailus.io/blocks/customers/github.svg"
                                    alt="GitHub Logo"
                                    height={16}
                                    width={80}
                                />
                            </div>

                            <div className="flex">
                                <Image
                                    className="mx-auto h-5 w-auto dark:invert"
                                    src="https://html.tailus.io/blocks/customers/nike.svg"
                                    alt="Nike Logo"
                                    height={20}
                                    width={80}
                                />
                            </div>

                            <div className="flex">
                                <Image
                                    className="mx-auto h-4 w-auto dark:invert"
                                    src="https://html.tailus.io/blocks/customers/laravel.svg"
                                    alt="Laravel Logo"
                                    height={16}
                                    width={80}
                                />
                            </div>

                            <div className="flex">
                                <Image
                                    className="mx-auto h-6 w-auto dark:invert"
                                    src="https://html.tailus.io/blocks/customers/openai.svg"
                                    alt="OpenAI Logo"
                                    height={24}
                                    width={100}
                                />
                            </div>

                            <div className="flex">
                                <Image
                                    className="mx-auto h-5 w-auto dark:invert"
                                    src="https://html.tailus.io/blocks/customers/column.svg"
                                    alt="Column Logo"
                                    height={16}
                                    width={80}
                                />
                            </div>

                            <div className="flex">
                                <Image
                                    className="mx-auto h-5 w-auto dark:invert"
                                    src="https://html.tailus.io/blocks/customers/lemonsqueezy.svg"
                                    alt="Lemon Squeezy Logo"
                                    height={20}
                                    width={100}
                                />
                            </div>

                            <div className="flex">
                                <Image
                                    className="mx-auto h-7 w-auto dark:invert"
                                    src="https://html.tailus.io/blocks/customers/lilly.svg"
                                    alt="Lilly Logo"
                                    height={28}
                                    width={100}
                                />
                            </div>
                        </InfiniteSlider>

                        <div className="bg-linear-to-r from-background absolute inset-y-0 left-0 w-20"></div>
                        <div className="bg-linear-to-l from-background absolute inset-y-0 right-0 w-20"></div>
                        <ProgressiveBlur
                            className="pointer-events-none absolute left-0 top-0 h-full w-20"
                            direction="left"
                            blurIntensity={1}
                        />
                        <ProgressiveBlur
                            className="pointer-events-none absolute right-0 top-0 h-full w-20"
                            direction="right"
                            blurIntensity={1}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}
