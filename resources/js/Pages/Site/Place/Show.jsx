import { Head, Link, usePage } from '@inertiajs/react';
import SiteLayout from '@/Layouts/SiteLayout';
import classNames from 'classnames';

export default function Show({ place }) {

    const className = classNames(
        [
            'text-xl text-center whitespace-nowrap align-baseline font-bold',
            'inline-block leading-none',
            'h-[35vh]',
            'text-sm',
            'text-white',
            'flex',
            'items-center',
            "bg-[url('" + place.image + "')]",
            'bg-cover bg-center',
        ],
    );

    return (
        <SiteLayout>
            <Head title={place.name} />
            <div className="w-full overflow-hidden">
                <div className={className} style={{ backgroundImage: `url("` + place.image + `")` }}>
                    <div className='flex justify-center items-center w-full h-full mx-auto md:px-10 bg-gradient-to-b from-transparent to-stone-800'>
                        <div className="flex flex-col md:flex-row justify-center items-center break-words whitespace-normal">
                            <h2 className='md:text-5xl text-3xl font-extrabold'>
                                {place.name}
                            </h2>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col-reverse md:flex-row '>
                    <div className='p-3 break-words w-full md:w-2/3 bg-white md:my-2 md:ml-5 rounded-lg'>
                        <div dangerouslySetInnerHTML={{ __html: place.description }} />
                    </div>
                    <div className='break-words w-full md:w-1/3 my-2 md:mx-5 hidden md:inline'>
                        <img src={place.image} alt="" className='rounded-lg' />
                    </div>
                </div>
                <div className='flex flex-col relative md:p-4 md:mt-5'>
                    {place.google_maps_src && (
                        <div className="w-full h-[90vh] sm:h-[30vh] md:h-[60vh] rounded-lg">
                            <iframe className="w-full h-full rounded-lg" src={place.google_maps_src} title={place.name} loading="lazy"></iframe>
                        </div>
                    )}
                </div>
            </div >
        </SiteLayout>
    );
}
