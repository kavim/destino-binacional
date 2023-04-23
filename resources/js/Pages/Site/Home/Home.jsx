import { Link, Head } from '@inertiajs/react';
import SiteLayout from '@/Layouts/SiteLayout';
import Events from '@/Pages/Site/Home/Events';
import Categories from '@/Pages/Site/Home/Categories';
import Hero from '@/Pages/Site/Home/Hero';

export default function Welcome() {
    return (
        <SiteLayout>
            <Head title="Destino Binacional" />
            <header className="relative flex items-center justify-center h-[25vh] sm:h-[30vh] md:h-[60vh] overflow-hidden">
                <div className="relative z-30 bg-gradient-to-b from-black to-transparent w-full h-full flex justify-center">
                    <img src="/images/logotipo-blanco.svg" alt="logotipo" className='w-96' />
                </div>
                <video autoPlay loop muted className="absolute z-10 w-auto min-w-full min-h-full max-w-none">
                    {/* <source src="https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-heights-in-a-sunset-26070-large.mp4" type="video/mp4" />Your browser does not support the video tag. */}
                    <source src="/video/parque.mp4" type="video/mp4" />
                </video>
            </header>
            <div className="sm:max-w-full lg:max-w-7xl mx-auto my-5">
                <Events></Events>
                <Hero></Hero>
                <Categories></Categories>
            </div>
        </SiteLayout >
    );
}
