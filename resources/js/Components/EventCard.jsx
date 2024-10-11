import { Link, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import { es } from 'dayjs/locale/es';

export function EventCard({ event, index }) {
    return (
        <>
            <Link key={index} href={route('site.events.show', event.slug)}>
                <div className='min-w-[260px] max-w-[260px] min-h-[300px] flex flex-col mr-5 cursor-pointer hover:scale-105 ease-in-out duration-300 rounded-lg shadow-md bg-white'>
                    <div>
                        <figure>
                            <img src={event.image} alt={event.image} className='w-full rounded-t-lg aspect-square' loading='lazy' />
                        </figure>
                    </div>
                    <div className='whitespace-normal p-2 break-all flex flex-col justify-between grow rounded-b-lg'>
                        <div>
                            <span className="text-lg font-semibold">
                                {event.title}
                            </span>
                        </div>
                        <div className='w-full flex items-center justify-start p-2 md:p-0 md:mt-4 font-light text-sm'>
                            {event.start !== event.end ? (
                                <>
                                    <i className="fa-solid fa-calendar-days mr-2 shadow-sm"></i>
                                    {dayjs(event.start).format('DD MMMM')}
                                    <i className="fa-solid fa-arrows-left-right mx-2 shadow-sm"></i>
                                    <i className="fa-solid fa-calendar-days mr-2 shadow-sm"></i>
                                    {dayjs(event.end).format('DD MMMM')}
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-calendar-days mr-2"></i>
                                    {dayjs(event.start).format('DD MMMM')}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </>
    );
}
