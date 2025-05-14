import Link from 'next/link'
import Image from 'next/image'

export default function CommunitySection() {
    return (
        <section>
            <div className="py-16 md:py-32">
                <div className="mx-auto max-w-5xl px-6">
                    <div className="text-center">
                        <h2 className="text-balance text-3xl font-semibold md:text-4xl">
                            Built by the Community <br /> for the Community
                        </h2>
                        <p className="text-muted-foreground mt-6">Harum quae dolore orrupti aut temporibus ariatur.</p>
                    </div>
                    <div className="mx-auto mt-12 flex max-w-lg flex-wrap justify-center gap-3">
                        <Link href="https://github.com/meschacirung" target="_blank" title="Méschac Irung" className="size-16 rounded-full border *:size-full *:rounded-full *:object-cover">
                            <Image alt="John Doe" src="https://randomuser.me/api/portraits/men/1.jpg" width={120} height={120} className="size-full rounded-full object-cover" />
                        </Link>
                        <Link href="https://github.com/meschacirung" target="_blank" title="Méschac Irung" className="size-16 rounded-full border *:size-full *:rounded-full *:object-cover">
                            <Image alt="John Doe" src="https://randomuser.me/api/portraits/men/2.jpg" width={120} height={120} className="size-full rounded-full object-cover" />
                        </Link>
                        <Link href="https://github.com/meschacirung" target="_blank" title="Méschac Irung" className="size-16 rounded-full border *:size-full *:rounded-full *:object-cover">
                            <Image alt="John Doe" src="https://randomuser.me/api/portraits/men/3.jpg" width={120} height={120} className="size-full rounded-full object-cover" />
                        </Link>
                        <Link href="https://github.com/meschacirung" target="_blank" title="Méschac Irung" className="size-16 rounded-full border *:size-full *:rounded-full *:object-cover">
                            <Image alt="John Doe" src="https://randomuser.me/api/portraits/men/4.jpg" width={120} height={120} className="size-full rounded-full object-cover" />
                        </Link>
                        <Link href="https://github.com/meschacirung" target="_blank" title="Méschac Irung" className="size-16 rounded-full border *:size-full *:rounded-full *:object-cover">
                            <Image alt="John Doe" src="https://randomuser.me/api/portraits/men/5.jpg" width={120} height={120} className="size-full rounded-full object-cover" />
                        </Link>
                        <Link href="https://github.com/meschacirung" target="_blank" title="Méschac Irung" className="size-16 rounded-full border *:size-full *:rounded-full *:object-cover">
                            <Image alt="John Doe" src="https://randomuser.me/api/portraits/men/6.jpg" width={120} height={120} className="size-full rounded-full object-cover" />
                        </Link>
                        <Link href="https://github.com/meschacirung" target="_blank" title="Méschac Irung" className="size-16 rounded-full border *:size-full *:rounded-full *:object-cover">
                            <Image alt="John Doe" src="https://randomuser.me/api/portraits/men/7.jpg" width={120} height={120} className="size-full rounded-full object-cover" />
                        </Link>
                        <Link href="https://github.com/meschacirung" target="_blank" title="Méschac Irung" className="size-16 rounded-full border *:size-full *:rounded-full *:object-cover">
                            <Image alt="John Doe" src="https://randomuser.me/api/portraits/men/1.jpg" width={120} height={120} className="size-full rounded-full object-cover" />
                        </Link>
                        <Link href="https://github.com/meschacirung" target="_blank" title="Méschac Irung" className="size-16 rounded-full border *:size-full *:rounded-full *:object-cover">
                            <Image alt="John Doe" src="https://randomuser.me/api/portraits/men/8.jpg" width={120} height={120} className="size-full rounded-full object-cover" />
                        </Link>
                        <Link href="https://github.com/meschacirung" target="_blank" title="Méschac Irung" className="size-16 rounded-full border *:size-full *:rounded-full *:object-cover">
                            <Image alt="John Doe" src="https://randomuser.me/api/portraits/men/9.jpg" width={120} height={120} className="size-full rounded-full object-cover" />
                        </Link>
                        <Link href="https://github.com/meschacirung" target="_blank" title="Méschac Irung" className="size-16 rounded-full border *:size-full *:rounded-full *:object-cover">
                            <Image alt="John Doe" src="https://randomuser.me/api/portraits/men/10.jpg" width={120} height={120} className="size-full rounded-full object-cover" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
