import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronRight, MapPin } from 'lucide-react';
import { trans } from '@/utils';

const PLACE_IMG_FALLBACK = '/images/parque.webp';

export type PlaceCard = {
    slug: string;
    name: string;
    image?: string;
    /** Linha secundária (tipo · cidade), opcional */
    meta?: string | null;
};

function PlaceCardItem({ place }: { place: PlaceCard }) {
    const initialSrc =
        typeof place.image === 'string' && place.image.length > 0
            ? place.image
            : PLACE_IMG_FALLBACK;
    const [imgSrc, setImgSrc] = useState(initialSrc);
    const meta =
        typeof place.meta === 'string' && place.meta.trim() !== '' ? place.meta.trim() : null;

    return (
        <Link
            href={route('places.byPlaceIdentifier', place.slug)}
            className="group block h-full min-w-0 cursor-pointer no-underline outline-none active:scale-[0.99] motion-safe:transition-transform motion-reduce:transform-none"
        >
            <article className="flex h-full min-h-[260px] flex-col overflow-hidden rounded-2xl border border-border/90 bg-card text-card-foreground shadow-sm ring-1 ring-black/[0.03] transition-[box-shadow,transform,border-color] duration-200 hover:border-primary/35 hover:shadow-md dark:ring-white/[0.05]">
                <figure className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-muted">
                    <img
                        src={imgSrc}
                        alt=""
                        width={800}
                        height={500}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                        onError={() =>
                            setImgSrc((s) =>
                                s !== PLACE_IMG_FALLBACK ? PLACE_IMG_FALLBACK : s,
                            )
                        }
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 to-transparent sm:from-black/40" />
                    {meta ? (
                        <div className="pointer-events-none absolute bottom-2 left-2 right-2 flex items-end justify-between gap-2 sm:bottom-3 sm:left-3 sm:right-3">
                            <span className="inline-flex max-w-[90%] items-center gap-1 rounded-lg bg-black/55 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur-sm sm:text-xs">
                                <MapPin className="h-3 w-3 shrink-0 opacity-90" aria-hidden />
                                <span className="truncate">{meta}</span>
                            </span>
                        </div>
                    ) : null}
                </figure>
                <div className="flex flex-1 flex-col gap-2 p-4 pb-5 sm:p-5 md:p-6">
                    <h2 className="line-clamp-2 text-balance text-lg font-semibold leading-snug tracking-tight text-foreground sm:text-xl md:text-[1.35rem]">
                        {place.name}
                    </h2>
                    <span className="mt-auto inline-flex items-center gap-1 pt-1 text-sm font-medium text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:opacity-100">
                        Ver detalhes
                        <ChevronRight
                            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                            aria-hidden
                        />
                    </span>
                </div>
            </article>
        </Link>
    );
}

export default function PlaceCardList({ places }: { places: PlaceCard[] }) {
    if (places.length === 0) {
        return (
            <section
                className="mx-auto min-w-0 w-full max-w-2xl px-1"
                aria-labelledby="places-empty-heading"
            >
                <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-14 text-center dark:bg-muted/15">
                    <MapPin
                        className="mx-auto mb-4 h-12 w-12 text-muted-foreground/70"
                        strokeWidth={1.25}
                        aria-hidden
                    />
                    <h2
                        id="places-empty-heading"
                        className="text-lg font-semibold text-foreground"
                    >
                        {trans('places.no_places')}
                    </h2>
                </div>
            </section>
        );
    }

    return (
        <section className="mx-auto min-w-0 w-full" aria-labelledby="places-list-heading">
            <div className="mb-6 flex flex-col gap-1 px-1 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2
                        id="places-list-heading"
                        className="text-xl font-bold tracking-tight text-foreground sm:text-2xl"
                    >
                        Lugares en esta categoría
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {places.length === 1
                            ? '1 lugar en la lista.'
                            : `${places.length} lugares en la lista.`}
                    </p>
                </div>
            </div>
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7">
                {places.map((place) => (
                    <li key={place.slug} className="min-w-0">
                        <PlaceCardItem place={place} />
                    </li>
                ))}
            </ul>
        </section>
    );
}
