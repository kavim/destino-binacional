import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { CalendarDays, ChevronRight } from 'lucide-react';

const TOUR_IMG_FALLBACK = '/images/parque.webp';

type TourRow = {
    slug: string;
    title: string;
    image?: string;
    start?: string | null;
    end?: string | null;
};

/** Mesma lógica de formatação que a lista pública de eventos (com datas opcionais). */
function formatTourDates(startIso?: string | null, endIso?: string | null): string {
    if (!startIso && !endIso) return '—';
    const s = startIso ? dayjs(startIso) : null;
    const e = endIso ? dayjs(endIso) : null;
    if (s?.isValid()) {
        if (!e?.isValid() || s.isSame(e, 'day')) {
            return s.locale('pt-br').format('D [de] MMMM');
        }
        return `${s.locale('pt-br').format('D MMM')} → ${e.locale('pt-br').format('D MMM YYYY')}`;
    }
    if (e?.isValid()) {
        return e.locale('pt-br').format('D MMM YYYY');
    }
    return '—';
}

function TourListCard({ tour }: { tour: TourRow }) {
    const initialSrc =
        typeof tour.image === 'string' && tour.image.length > 0
            ? tour.image
            : TOUR_IMG_FALLBACK;
    const [imgSrc, setImgSrc] = useState(initialSrc);
    const dateLabel = formatTourDates(tour.start, tour.end);

    return (
        <Link
            href={route('site.tours.show', tour.slug)}
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
                                s !== TOUR_IMG_FALLBACK ? TOUR_IMG_FALLBACK : s,
                            )
                        }
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 to-transparent sm:from-black/40" />
                    <div className="pointer-events-none absolute bottom-2 left-2 right-2 flex items-end justify-between gap-2 sm:bottom-3 sm:left-3 sm:right-3">
                        <span className="inline-flex max-w-[85%] items-center gap-1 rounded-lg bg-black/55 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur-sm sm:text-xs">
                            <CalendarDays className="h-3 w-3 shrink-0 opacity-90" aria-hidden />
                            <span className="truncate tabular-nums">{dateLabel}</span>
                        </span>
                    </div>
                </figure>
                <div className="flex flex-1 flex-col gap-2 p-4 pb-5 sm:p-5 md:p-6">
                    <h2 className="line-clamp-2 text-balance text-lg font-semibold leading-snug tracking-tight text-foreground sm:text-xl md:text-[1.35rem]">
                        {tour.title}
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

export default function TourList() {
    const { tours } = usePage().props as unknown as { tours?: TourRow[] };
    const list = Array.isArray(tours) ? tours : [];
    dayjs.locale('pt-br');

    if (!list.length) {
        return (
            <section className="mx-auto min-w-0 w-full max-w-2xl px-1" aria-labelledby="tours-empty-heading">
                <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-14 text-center dark:bg-muted/15">
                    <CalendarDays
                        className="mx-auto mb-4 h-12 w-12 text-muted-foreground/70"
                        strokeWidth={1.25}
                        aria-hidden
                    />
                    <h2 id="tours-empty-heading" className="text-lg font-semibold text-foreground">
                        Nenhum tour encontrado
                    </h2>
                    <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                        Tente outra categoria nos filtros ou volte mais tarde — novos roteiros são
                        publicados conforme ficam disponíveis.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="mx-auto min-w-0 w-full" aria-labelledby="tours-list-heading">
            <div className="mb-6 flex flex-col gap-1 px-1 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2 id="tours-list-heading" className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                        Próximos tours
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {list.length === 1 ? '1 tour na agenda.' : `${list.length} tours na agenda.`}
                    </p>
                </div>
            </div>
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7">
                {list.map((tour) => (
                    <li key={tour.slug} className="min-w-0">
                        <TourListCard tour={tour} />
                    </li>
                ))}
            </ul>
        </section>
    );
}
