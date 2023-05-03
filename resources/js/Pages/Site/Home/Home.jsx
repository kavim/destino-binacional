import { Head } from '@inertiajs/react';
import SiteLayout from '@/Layouts/SiteLayout';
import Events from '@/Pages/Site/Home/Events';
import Categories from '@/Pages/Site/Home/Categories';
import Hero from '@/Pages/Site/Home/Hero';
import Footer from '@/Components/Footer'

export default function Welcome() {
    return (
        <SiteLayout>
            <Head title="Destino Binacional" />
            <header className="relative flex items-center justify-center h-[60vh] overflow-hidden">
                <div className="z-30 bg-gradient-to-b from-black to-transparent w-full h-full">
                    <div className='flex flex-col justify-center items-center w-full h-full'>
                        <div>
                            <img src="/images/logotipo-blanco.svg" alt="logotipo" className='w-96' />
                        </div>
                        <div>
                            <h1 className='text-white text-xl mt-5'>
                                RIVERA - SANTANA DO LIVRAMENTO
                            </h1>
                        </div>
                    </div>
                </div>
                <video autoPlay loop muted
                    poster="/images/parque.webp"
                    preload="none"
                    className="absolute z-10 w-auto min-w-full min-h-full max-w-none">
                    <source src="/video/parque.mp4" type="video/mp4" />
                    <img src="/images/parque.webp" alt="parqueInternacional" className="absolute z-10 w-auto min-w-full min-h-full max-w-none" />
                </video>
            </header>
            <div className="sm:max-w-full lg:max-w-7xl mx-auto md:my-5">
                <Events></Events>
                <Hero></Hero>
                <Categories></Categories>
            </div>
            <Footer></Footer>
        </SiteLayout >
    );
}
