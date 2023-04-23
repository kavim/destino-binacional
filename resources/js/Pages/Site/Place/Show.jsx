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
            <div className="w-full">
                <div className={className} style={{ backgroundImage: `url("` + place.image + `")` }}>
                    <div className='flex justify-center items-center w-full h-full mx-auto px-10 bg-gradient-to-b from-transparent to-stone-800'>
                        <div className="flex flex-col md:flex-row justify-center items-center">
                            <h2 className='text-5xl font-extrabold'>
                                {place.name}
                            </h2>
                        </div>
                    </div>
                </div>
                <div className='p-3'>
                    <div dangerouslySetInnerHTML={{ __html: place.description }} />
                </div>
                <div>
                    {place.google_maps_embed_url && (
                        <div className="w-full">
                            <iframe className="w-full h-full" src={place.google_maps_embed_url} title={place.name} loading="lazy"></iframe>
                        </div>
                    )}
                </div>
            </div >
        </SiteLayout>
    );
}
