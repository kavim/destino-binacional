import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { CalendarDays, ChevronRight } from 'lucide-react';

const EVENT_IMG_FALLBACK = '/images/parque.webp';

type SiteEventRow = {
    slug: string;
    title: string;
    image?: string;
    start: string;
    end: string;
};

function formatEventDates(startIso: string, endIso: string): string {
    const s = dayjs(startIso);
    const e = dayjs(endIso);
    if (!s.isValid()) return '—';
    if (!e.isValid() || s.isSame(e, 'day')) {
        return s.locale('pt-br').format('D [de] MMMM');
    }
    return `${s.locale('pt-br').format('D MMM')} → ${e.locale('pt-br').format('D MMM YYYY')}`;
}

function EventListCard({ event }: { event: SiteEventRow }) {
    const initialSrc =
        typeof event.image === 'string' && event.image.length > 0
            ? event.image
            : EVENT_IMG_FALLBACK;
    const [imgSrc, setImgSrc] = useState(initialSrc);
    const dateLabel = formatEventDates(event.start, event.end);

    return (
        <Link
            href={route('site.events.show', event.slug)}
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
                                s !== EVENT_IMG_FALLBACK ? EVENT_IMG_FALLBACK : s,
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
                        {event.title}
                    </h2>
                    <span className="mt-auto inline-flex items-center gap-1 pt-1 text-sm font-medium text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:opacity-100">
                        Ver detalhes
                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </span>
                </div>
            </article>
        </Link>
    );
}

export default function EventList() {
    const raw = usePage().props as unknown as { events?: SiteEventRow[] };
    const events = Array.isArray(raw.events) ? raw.events : [];
    dayjs.locale('pt-br');

    if (!events.length) {
        return (
            <section className="mx-auto min-w-0 w-full max-w-2xl px-1" aria-labelledby="events-empty-heading">
                <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-14 text-center dark:bg-muted/15">
                    <CalendarDays
                        className="mx-auto mb-4 h-12 w-12 text-muted-foreground/70"
                        strokeWidth={1.25}
                        aria-hidden
                    />
                    <h2 id="events-empty-heading" className="text-lg font-semibold text-foreground">
                        Nenhum evento encontrado
                    </h2>
                    <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                        Tente ampliar o período nos filtros ou voltar mais tarde — a agenda é atualizada
                        conforme novas atividades são publicadas.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="mx-auto min-w-0 w-full" aria-labelledby="events-list-heading">
            <div className="mb-6 flex flex-col gap-1 px-1 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2 id="events-list-heading" className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                        Próximos eventos
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {events.length === 1
                            ? '1 evento na agenda.'
                            : `${events.length} eventos na agenda.`}
                    </p>
                </div>
            </div>
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7">
                {events.map((event) => (
                    <li key={event.slug} className="min-w-0">
                        <EventListCard event={event} />
                    </li>
                ))}
            </ul>
        </section>
    );
}
