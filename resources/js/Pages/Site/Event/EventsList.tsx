import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

const EVENT_IMG_FALLBACK = '/images/parque.webp';

type SiteEventRow = {
    slug: string;
    title: string;
    image?: string;
    start: string;
    end: string;
};

function EventListCard({ event }: { event: SiteEventRow }) {
    const initialSrc =
        typeof event.image === 'string' && event.image.length > 0
            ? event.image
            : EVENT_IMG_FALLBACK;
    const [imgSrc, setImgSrc] = useState(initialSrc);

    return (
        <Link href={route('site.events.show', event.slug)} className="block cursor-pointer">
            <div className="mb-4 w-full cursor-pointer rounded-lg border border-border bg-card text-card-foreground shadow-sm transition-colors hover:border-primary/25">
                <figure className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                    <img
                        src={imgSrc}
                        alt={event.title}
                        width={800}
                        height={500}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                        onError={() =>
                            setImgSrc((s) =>
                                s !== EVENT_IMG_FALLBACK ? EVENT_IMG_FALLBACK : s,
                            )
                        }
                    />
                </figure>
                <div className="flex flex-col space-y-1.5 p-6">
                    <div className="flex items-center gap-2 pt-0">
                        <div className="inline-flex items-center rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-semibold">
                            {dayjs(event.start).format('DD/MM')}
                        </div>
                    </div>
                    <h2 className="text-2xl font-semibold leading-none tracking-tight">
                        {event.title}
                    </h2>
                </div>
            </div>
        </Link>
    );
}

export default function EventList() {
    const { events } = usePage().props as unknown as { events: SiteEventRow[] };
    dayjs.locale('es');

    if (!events?.length) {
        return (
            <div className="px-3 py-8 text-center text-muted-foreground">
                No hay eventos para mostrar con estos filtros.
            </div>
        );
    }

    return (
        <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-4 px-3 sm:px-5 md:grid-cols-2 md:gap-8 lg:max-w-6xl lg:grid-cols-3 lg:gap-6">
            {events.map((event) => (
                <EventListCard key={event.slug} event={event} />
            ))}
        </div>
    );
}
