import { Head, Link, usePage } from '@inertiajs/react';
import SiteLayout from '@/Layouts/SiteLayout';
import classNames from 'classnames';

export default function Show({ event }) {

    const className = classNames(
        [
            'text-xl text-center whitespace-nowrap align-baseline font-bold',
            'inline-block leading-none',
            'h-[35vh]',
            'text-sm',
            'text-white',
            'flex',
            'items-center',
            "bg-[url('" + event.image + "')]",
            'bg-cover bg-center',
        ],
    );

    return (
        <SiteLayout>
            <Head title={event.title} />
            <div className="w-full">
                <div className={className} style={{ backgroundImage: `url("` + event.image + `")` }}>
                    <div className='flex justify-center items-center w-full h-full mx-auto px-10 bg-gradient-to-b from-transparent to-stone-800'>
                        <div className="flex flex-col md:flex-row justify-center items-center">
                            <h2 className='text-5xl font-extrabold'>
                                {event.title}
                            </h2>
                        </div>
                    </div>
                </div>
                <div className='p-3'>
                    <div dangerouslySetInnerHTML={{ __html: event.description }} />
                </div>
                <div>
                    {event.google_maps_embed_url && (
                        <div className="w-full">
                            <iframe className="w-full h-full" src={event.google_maps_embed_url} title={event.name} loading="lazy"></iframe>
                        </div>
                    )}
                </div>
            </div >
        </SiteLayout>
    );
}
