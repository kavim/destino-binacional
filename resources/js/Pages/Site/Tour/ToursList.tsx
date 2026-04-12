import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

const TOUR_IMG_FALLBACK = '/images/parque.webp';

type TourRow = {
    slug: string;
    title: string;
    image?: string;
    start: string;
    end: string;
};

function TourListCard({ tour }: { tour: TourRow }) {
    const initialSrc =
        typeof tour.image === 'string' && tour.image.length > 0
            ? tour.image
            : TOUR_IMG_FALLBACK;
    const [imgSrc, setImgSrc] = useState(initialSrc);

    return (
        <Link href={route('site.tours.show', tour.slug)} className="block cursor-pointer">
            <div className="mb-4 w-full cursor-pointer rounded-lg border border-border bg-card text-card-foreground shadow-sm transition-colors hover:border-primary/25">
                <figure className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                    <img
                        src={imgSrc}
                        alt={tour.title}
                        width={800}
                        height={500}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                        onError={() =>
                            setImgSrc((s) =>
                                s !== TOUR_IMG_FALLBACK ? TOUR_IMG_FALLBACK : s,
                            )
                        }
                    />
                </figure>
                <div className="flex flex-col space-y-1.5 p-6">
                    {tour.start && tour.end && (
                        <div className="flex items-center gap-2 pt-0">
                            <div className="inline-flex items-center rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-semibold">
                                <i
                                    className="fa-solid fa-calendar-days mr-2 text-muted-foreground"
                                    aria-hidden
                                />
                                {dayjs(tour.start).format('DD/MM')}
                            </div>
                        </div>
                    )}
                    <h2 className="text-2xl font-semibold leading-none tracking-tight">
                        {tour.title}
                    </h2>
                </div>
            </div>
        </Link>
    );
}

export default function TourList() {
    const { tours } = usePage().props as unknown as { tours: TourRow[] };
    dayjs.locale('es');

    return (
        <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-4 px-3 sm:px-5 md:grid-cols-2 md:gap-8 lg:max-w-6xl lg:grid-cols-3 lg:gap-6">
            {tours.map((tour) => (
                <TourListCard key={tour.slug} tour={tour} />
            ))}
        </div>
    );
}
