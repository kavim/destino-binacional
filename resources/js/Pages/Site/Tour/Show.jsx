import { Head, Link, usePage } from '@inertiajs/react';
import SiteLayout from '@/Layouts/SiteLayout';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { es } from 'dayjs/locale/es';
import { trans } from '@/utils';

export default function Show({ tour }) {
    dayjs.locale("es");

    const className = classNames(
        [
            'text-xl text-center whitespace-nowrap align-baseline font-bold',
            'inline-block leading-none',
            'h-[50vh]',
            'text-sm',
            'text-white',
            'flex',
            'items-center',
            "bg-[url('" + tour.image + "')]",
            'bg-cover bg-center',
        ],
    );

    return (
        <SiteLayout>
            <Head title={tour.title} />
            <div className="w-full overflow-hidden">
                <div className={className} style={{ backgroundImage: `url("` + tour.image + `")` }}>
                    <div className='flex justify-center items-center w-full h-full mx-auto md:px-10 bg-gradient-to-b from-transparent to-stone-800'>
                        <div className="flex flex-col justify-center items-center">
                            <div className='flex flex-col md:flex-row justify-center items-center break-words whitespace-normal'>
                                <span className='md:text-5xl text-3xl font-extrabold'>
                                    {tour.title}
                                </span>
                            </div>
                            <div className='w-full flex items-center justify-center md:justify-start p-2 md:p-0 md:mt-4'>
                                {tour.start !== tour.end ? (
                                    <>
                                        <i className="fa-solid fa-calendar-days mr-2 shadow-sm"></i>
                                        {dayjs(tour.start).format('DD MMMM')}
                                        <i className="fa-solid fa-arrows-left-right mx-2 shadow-sm"></i>
                                        <i className="fa-solid fa-calendar-days mr-2 shadow-sm"></i>
                                        {dayjs(tour.end).format('DD MMMM')}
                                    </>
                                ) : (
                                    <>
                                        <i className="fa-solid fa-calendar-days mr-2"></i>
                                        {dayjs(tour.start).format('DD MMMM')}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col-reverse md:flex-row'>
                    <div className='p-3 break-words w-full md:w-2/3 bg-white md:my-2 md:ml-5 rounded-lg'>
                        <div dangerouslySetInnerHTML={{ __html: tour.description }} />
                    </div>
                    <div className='w-full break-words md:w-1/3 md:my-2 md:mx-5 rounded-xl px-4 py-4 md:py-0'>
                        <img src={tour.image} alt="" className='rounded-xl' />
                    </div>
                </div>
                <div className='flex flex-col relative md:p-4 md:mt-5'>
                    {tour.google_maps_src && (
                        <div className="w-full h-[60vh] md:h-[60vh] rounded-lg">
                            <iframe className="w-full h-full md:rounded-lg" src={tour.google_maps_src} title={tour.name} loading="lazy"></iframe>
                        </div>
                    )}
                </div>
            </div >
        </SiteLayout>
    );
}
