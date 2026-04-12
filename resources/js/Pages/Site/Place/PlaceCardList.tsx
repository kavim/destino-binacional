import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { trans } from '@/utils';

const PLACE_IMG_FALLBACK = '/images/parque.webp';

type PlaceCard = {
    slug: string;
    name: string;
    image?: string;
};

function PlaceCardItem({ place }: { place: PlaceCard }) {
    const initialSrc =
        typeof place.image === 'string' && place.image.length > 0
            ? place.image
            : PLACE_IMG_FALLBACK;
    const [imgSrc, setImgSrc] = useState(initialSrc);

    return (
        <Link href={route('places.byPlaceIdentifier', place.slug)} className="block cursor-pointer">
            <article className="mb-6 flex flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm transition-colors hover:border-primary/25 md:mb-4 lg:flex-row">
                <figure className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-muted lg:aspect-auto lg:h-48 lg:w-56 lg:flex-none">
                    <img
                        src={imgSrc}
                        alt={place.name}
                        width={800}
                        height={600}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                        onError={() =>
                            setImgSrc((s) =>
                                s !== PLACE_IMG_FALLBACK ? PLACE_IMG_FALLBACK : s,
                            )
                        }
                    />
                </figure>
                <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 p-4 sm:p-6">
                    <h2 className="text-xl font-semibold leading-snug tracking-tight sm:text-2xl">
                        {place.name}
                    </h2>
                    <div className="flex justify-stretch pt-1 sm:justify-end">
                        <span className="inline-flex min-h-10 w-full items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium sm:min-h-9 sm:w-auto">
                            Ver Mas
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    );
}

export default function PlaceCardList({ places }: { places: PlaceCard[] }) {
    if (places.length === 0) {
        return (
            <div className="flex w-full justify-center px-3 text-center">
                <span>{trans('places.no_places')}</span>
            </div>
        );
    }

    return (
        <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-4 px-3 sm:px-5 md:grid-cols-2 md:gap-8 lg:max-w-6xl lg:gap-6">
            {places.map((place) => (
                <PlaceCardItem key={place.slug} place={place} />
            ))}
        </div>
    );
}
