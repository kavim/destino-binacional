import { useState } from 'react';
import { Link } from '@inertiajs/react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es');

const EVENT_IMAGE_PLACEHOLDER = '/images/parque.webp';

type EventCardProps = {
    event: {
        slug: string;
        image?: string;
        title: string;
        start: string;
        end: string;
    };
};

export function EventCard({ event }: EventCardProps) {
    const initialSrc =
        typeof event.image === 'string' && event.image.length > 0
            ? event.image
            : EVENT_IMAGE_PLACEHOLDER;
    const [imgSrc, setImgSrc] = useState(initialSrc);

    return (
        <>
            <Link href={route('site.events.show', event.slug)} className="snap-start shrink-0">
                <div className="mr-3 flex w-[min(260px,calc(100vw-1.75rem))] max-w-[260px] cursor-pointer flex-col rounded-xl border border-border bg-card shadow-md transition-transform duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg sm:mr-5 dark:shadow-black/25 dark:hover:shadow-black/35">
                    <figure className="relative aspect-square w-full shrink-0 overflow-hidden rounded-t-xl bg-muted">
                        <img
                            src={imgSrc}
                            alt={event.title}
                            width={260}
                            height={260}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover"
                            onError={() => setImgSrc(EVENT_IMAGE_PLACEHOLDER)}
                        />
                    </figure>
                    <div className="flex flex-col gap-2 whitespace-normal break-words rounded-b-xl p-3 sm:p-2">
                        <div>
                            <span className="overflow-hidden text-ellipsis text-base font-semibold leading-snug sm:text-lg [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
                                {event.title}
                            </span>
                        </div>
                        <div className="flex w-full items-center justify-start text-sm font-light">
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
