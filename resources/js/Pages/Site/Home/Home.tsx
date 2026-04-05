import { Head } from '@inertiajs/react';
import SiteLayout from '@/Layouts/SiteLayout';
import Events from '@/Pages/Site/Home/Events';
import Categories from '@/Pages/Site/Home/Categories';
import Hero from '@/Pages/Site/Home/Hero';

export default function Welcome() {
    return (
        <SiteLayout>
            <Head title="Destino Binacional" />
            <header className="relative isolate min-h-[50vh] overflow-hidden bg-black sm:min-h-[55vh] md:min-h-[60vh]">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster="/images/parque.webp"
                    preload="metadata"
                    className="absolute inset-0 z-0 h-full w-full object-cover object-center"
                >
                    <source src="/video/parque.mp4" type="video/mp4" />
                </video>
                <div
                    className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/60 via-black/25 to-black/80"
                    aria-hidden
                />
                <div className="relative z-10 flex min-h-[50vh] flex-col items-center justify-center px-4 pb-10 pt-8 text-center sm:min-h-[55vh] sm:px-6 sm:pb-12 sm:pt-10 md:min-h-[60vh] md:pb-14">
                    <div className="w-full max-w-[min(24rem,90vw)] shrink-0">
                        <img
                            src="/images/logotipo-blanco.svg"
                            alt="Destino Binacional"
                            className="mx-auto h-auto w-full object-contain drop-shadow-md"
                            width={384}
                            height={120}
                        />
                    </div>
                    <h1 className="mt-6 max-w-xl text-balance px-1 text-base font-medium leading-snug text-white sm:mt-8 sm:text-xl md:mt-10 md:text-2xl">
                        RIVERA - SANTANA DO LIVRAMENTO
                    </h1>
                </div>
            </header>
            <div className="mx-auto max-w-full px-2 sm:px-4 md:my-5 lg:max-w-7xl lg:px-8">
                <Events></Events>
                <Hero></Hero>
                <Categories></Categories>
            </div>
        </SiteLayout >
    );
}
