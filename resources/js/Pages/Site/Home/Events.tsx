import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type FormEvent,
} from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { trans } from '@/utils';
import { cn } from '@/lib/utils';
import {
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Search,
} from 'lucide-react';

type HomeEventItem = {
    slug: string;
    image: string;
    title: string;
    start: string;
    end: string;
};

type GroupedEventsMap = Record<string, HomeEventItem[]>;

const PLACEHOLDER_IMG = '/images/parque.webp';

function flattenGrouped(grouped: GroupedEventsMap): HomeEventItem[] {
    const keys = Object.keys(grouped).sort();
    const seen = new Set<string>();
    const out: HomeEventItem[] = [];
    for (const k of keys) {
        for (const ev of grouped[k]) {
            if (!seen.has(ev.slug)) {
                seen.add(ev.slug);
                out.push(ev);
            }
        }
    }
    return out;
}

function formatEventWhen(startIso: string, endIso: string): string {
    const s = dayjs(startIso);
    const e = dayjs(endIso);
    if (!s.isValid()) return '';
    const dayStr = s.locale('pt-br').format('dddd, D [de] MMMM');
    if (!e.isValid() || s.isSame(e, 'day')) {
        return dayStr;
    }
    return `${s.locale('pt-br').format('D MMM')} → ${e.locale('pt-br').format('D MMM YYYY')}`;
}

/** Rótulo curto do mês tipo calendário de mesa (ex.: ABR). */
function calendarMonthStrip(d: dayjs.Dayjs): string {
    if (!d.isValid()) return '';
    return d
        .locale('pt-br')
        .format('MMM')
        .replace(/\.$/, '')
        .toUpperCase();
}

function CarouselPoster({
    src,
    className,
}: {
    src: string;
    className?: string;
}) {
    const initial = src || PLACEHOLDER_IMG;
    const [imgSrc, setImgSrc] = useState(initial);
    useEffect(() => {
        setImgSrc(src || PLACEHOLDER_IMG);
    }, [src]);

    return (
        <img
            src={imgSrc}
            alt=""
            className={className}
            width={440}
            height={550}
            loading="lazy"
            decoding="async"
            onError={() => setImgSrc(PLACEHOLDER_IMG)}
        />
    );
}

export default function Events() {
    dayjs.locale('pt-br');
    const { grouped_events } = usePage().props as unknown as {
        grouped_events: GroupedEventsMap;
    };

    const [searchQuery, setSearchQuery] = useState('');
    const [searchExpanded, setSearchExpanded] = useState(false);
    const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const allFlat = useMemo(() => flattenGrouped(grouped_events), [grouped_events]);

    const visibleEvents = useMemo(() => {
        if (selectedDateKey && grouped_events[selectedDateKey]) {
            return grouped_events[selectedDateKey];
        }
        return allFlat;
    }, [selectedDateKey, grouped_events, allFlat]);

    useEffect(() => {
        setActiveIndex((i) => {
            if (!visibleEvents.length) return 0;
            return Math.min(i, visibleEvents.length - 1);
        });
    }, [visibleEvents.length]);

    const goPrev = useCallback(() => {
        setActiveIndex((i) =>
            visibleEvents.length ? (i <= 0 ? visibleEvents.length - 1 : i - 1) : 0,
        );
    }, [visibleEvents.length]);

    const goNext = useCallback(() => {
        setActiveIndex((i) =>
            visibleEvents.length
                ? i >= visibleEvents.length - 1
                    ? 0
                    : i + 1
                : 0,
        );
    }, [visibleEvents.length]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (
                e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLTextAreaElement
            ) {
                return;
            }
            if (e.key === 'ArrowLeft') goPrev();
            if (e.key === 'ArrowRight') goNext();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [goPrev, goNext]);

    const onSearchSubmit = (e: FormEvent) => {
        e.preventDefault();
        const q = searchQuery.trim();
        router.get(
            route('site.events.index'),
            { search: q, start: '', end: '' },
            { preserveState: false },
        );
    };

    const dateKeys = useMemo(
        () => Object.keys(grouped_events).sort(),
        [grouped_events],
    );

    const activeEvent = visibleEvents[activeIndex];

    if (Object.keys(grouped_events).length === 0) {
        return (
            <section
                className="relative overflow-hidden px-3 py-12 sm:px-4 md:py-16"
                aria-labelledby="home-events-heading"
            >
                <div className="mx-auto max-w-2xl rounded-3xl border border-dashed border-border bg-muted/20 px-6 py-14 text-center dark:bg-muted/10">
                    <CalendarDays
                        className="mx-auto mb-4 h-12 w-12 text-muted-foreground/70"
                        strokeWidth={1.25}
                        aria-hidden
                    />
                    <h2
                        id="home-events-heading"
                        className="text-lg font-semibold text-foreground"
                    >
                        Nenhum evento na agenda
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Volte em breve — novos eventos são publicados regularmente.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section
            className="relative overflow-hidden bg-gradient-to-b from-background via-muted/15 to-background px-3 py-10 sm:px-5 md:py-14"
            aria-labelledby="home-events-heading"
        >
            <div className="mx-auto max-w-6xl">
                <div className="mb-8 text-center sm:mb-10">
                    <h2
                        id="home-events-heading"
                        className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-[2.35rem]"
                    >
                        Experiências e eventos na região
                    </h2>
                    <p className="mx-auto mt-2 max-w-xl text-pretty text-sm text-muted-foreground sm:text-base">
                        Em destaque na agenda — explore datas e abra cada evento para mais
                        detalhes.
                    </p>
                </div>

                <div className="mx-auto mb-8 max-w-3xl sm:mb-10">
                    {searchExpanded ? (
                        <form
                            onSubmit={onSearchSubmit}
                            className="flex flex-col gap-3 rounded-2xl border border-border bg-card/80 p-3 shadow-sm sm:flex-row sm:items-stretch sm:gap-2 sm:p-2"
                        >
                            <div className="relative min-w-0 flex-1">
                                <Search
                                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                                    aria-hidden
                                />
                                <input
                                    type="search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Título do evento…"
                                    className="h-11 w-full rounded-xl border border-input bg-background py-2 pl-10 pr-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring sm:h-12"
                                    aria-label="Buscar eventos por título"
                                    autoComplete="off"
                                    autoFocus
                                />
                            </div>
                            <div className="flex shrink-0 gap-2 sm:items-stretch">
                                <button
                                    type="submit"
                                    className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 sm:flex-initial sm:px-6"
                                >
                                    Ir para agenda
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchExpanded(false);
                                        setSearchQuery('');
                                    }}
                                    className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-background px-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                                >
                                    Ocultar
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={() => setSearchExpanded(true)}
                                className="inline-flex items-center gap-2 rounded-full border border-transparent px-3 py-2 text-sm text-muted-foreground transition hover:border-border hover:bg-muted/50 hover:text-foreground"
                                aria-expanded={searchExpanded}
                            >
                                <Search className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                                <span>Buscar na agenda</span>
                            </button>
                        </div>
                    )}
                </div>

                {dateKeys.length > 1 ? (
                    <div className="scrollbar-hide mb-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-0.5 pb-2 pt-1 [-webkit-overflow-scrolling:touch] sm:gap-4">
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedDateKey(null);
                                setActiveIndex(0);
                            }}
                            aria-pressed={selectedDateKey === null}
                            aria-label="Mostrar eventos de todas as datas"
                            className={cn(
                                'group relative flex w-[4.75rem] shrink-0 snap-start flex-col overflow-hidden rounded-xl border-2 bg-card text-center shadow-sm transition-all duration-200 sm:w-[5.35rem]',
                                selectedDateKey === null
                                    ? 'border-primary shadow-md ring-2 ring-primary/20'
                                    : 'border-border/80 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md',
                            )}
                        >
                            <span
                                className={cn(
                                    'px-1.5 py-1.5 text-[9px] font-bold uppercase leading-none tracking-[0.14em] sm:text-[10px]',
                                    selectedDateKey === null
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-gradient-to-b from-muted to-muted/70 text-muted-foreground group-hover:text-foreground',
                                )}
                            >
                                Agenda
                            </span>
                            <span className="flex min-h-[3rem] flex-1 flex-col items-center justify-center py-1 sm:min-h-[3.25rem]">
                                <CalendarDays
                                    className={cn(
                                        'h-7 w-7 sm:h-8 sm:w-8',
                                        selectedDateKey === null
                                            ? 'text-primary'
                                            : 'text-muted-foreground group-hover:text-foreground',
                                    )}
                                    strokeWidth={1.75}
                                    aria-hidden
                                />
                            </span>
                            <span
                                className={cn(
                                    'border-t px-1 py-1.5 text-[10px] font-semibold leading-none sm:text-[11px]',
                                    selectedDateKey === null
                                        ? 'border-primary/15 bg-primary/5 text-primary'
                                        : 'border-border/70 bg-muted/25 text-muted-foreground group-hover:text-foreground',
                                )}
                            >
                                Todas
                            </span>
                        </button>
                        {dateKeys.map((key) => {
                            const d = dayjs(key);
                            const month = calendarMonthStrip(d);
                            const dayNum = d.isValid() ? d.format('DD') : '';
                            const weekday = d.isValid()
                                ? d.locale('pt-br').format('ddd')
                                : '';
                            const selected = selectedDateKey === key;

                            return (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => {
                                        setSelectedDateKey(key);
                                        setActiveIndex(0);
                                    }}
                                    aria-pressed={selected}
                                    aria-label={
                                        d.isValid()
                                            ? `Eventos do dia ${d.locale('pt-br').format('D [de] MMMM [de] YYYY')}`
                                            : 'Filtrar por data'
                                    }
                                    className={cn(
                                        'group relative flex w-[4.75rem] shrink-0 snap-start flex-col overflow-hidden rounded-xl border-2 bg-card text-center shadow-sm transition-all duration-200 sm:w-[5.35rem]',
                                        selected
                                            ? 'border-primary shadow-md ring-2 ring-primary/20'
                                            : 'border-border/80 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md',
                                    )}
                                >
                                    <span
                                        className={cn(
                                            'px-1.5 py-1.5 text-[9px] font-bold uppercase leading-none tracking-[0.15em] sm:text-[10px]',
                                            selected
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-gradient-to-b from-muted to-muted/70 text-muted-foreground group-hover:text-foreground',
                                        )}
                                    >
                                        {month}
                                    </span>
                                    <span
                                        className={cn(
                                            'flex min-h-[3rem] items-center justify-center py-1 tabular-nums sm:min-h-[3.25rem]',
                                            'text-[1.65rem] font-black leading-none sm:text-4xl',
                                            selected
                                                ? 'text-primary'
                                                : 'text-foreground',
                                        )}
                                    >
                                        {dayNum}
                                    </span>
                                    <span
                                        className={cn(
                                            'border-t px-1 py-1.5 text-[10px] font-medium capitalize leading-none sm:text-[11px]',
                                            selected
                                                ? 'border-primary/15 bg-primary/5 text-primary'
                                                : 'border-border/70 bg-muted/25 text-muted-foreground group-hover:text-foreground',
                                        )}
                                    >
                                        {weekday}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                ) : null}

                <div className="relative mx-auto min-h-[min(28rem,calc(100svh-12rem))] max-w-5xl select-none">
                    <button
                        type="button"
                        onClick={goPrev}
                        className="absolute left-0 top-[42%] z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/95 text-primary shadow-md backdrop-blur-sm transition hover:bg-muted md:left-1"
                        aria-label="Evento anterior"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                        type="button"
                        onClick={goNext}
                        className="absolute right-0 top-[42%] z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/95 text-primary shadow-md backdrop-blur-sm transition hover:bg-muted md:right-1"
                        aria-label="Próximo evento"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>

                    <div
                        className="relative mx-auto flex h-[min(22rem,58vw)] items-center justify-center [transform-style:preserve-3d] sm:h-[min(26rem,50vw)] md:h-[28rem]"
                        style={{ perspective: '1200px' }}
                    >
                        {visibleEvents.map((event, i) => {
                            const offset = i - activeIndex;
                            const dist = Math.abs(offset);
                            if (dist > 3) return null;

                            const translateX = offset * 240;
                            const rotateY = -offset * 22;
                            const scale = Math.max(0.72, 1 - dist * 0.11);
                            const opacity = Math.max(0, 1 - dist * 0.28);
                            const zIndex = 20 - dist;
                            const blurPx = dist === 0 ? 0 : dist * 0.8;

                            const img =
                                typeof event.image === 'string' &&
                                event.image.length > 0
                                    ? event.image
                                    : PLACEHOLDER_IMG;

                            return (
                                <Link
                                    key={event.slug}
                                    href={route('site.events.show', event.slug)}
                                    className={cn(
                                        'absolute left-1/2 top-1/2 w-[min(20rem,85vw)] origin-center overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xl ring-1 ring-black/[0.04] transition-[transform,opacity,filter] duration-500 ease-out motion-reduce:transition-none dark:ring-white/[0.06] sm:w-[22rem]',
                                        dist === 0 && 'ring-2 ring-primary/30',
                                    )}
                                    style={{
                                        transform: `translate(-50%, -50%) translateX(${translateX}px) rotateY(${rotateY}deg) scale(${scale})`,
                                        opacity,
                                        zIndex,
                                        filter:
                                            blurPx > 0 ? `blur(${blurPx}px)` : undefined,
                                        pointerEvents: dist === 0 ? 'auto' : 'none',
                                    }}
                                    aria-hidden={dist !== 0}
                                    tabIndex={dist === 0 ? 0 : -1}
                                >
                                    <div className="aspect-[3/4] w-full overflow-hidden bg-muted sm:aspect-[4/5]">
                                        <CarouselPoster
                                            src={img}
                                            className="h-full w-full object-cover"
                                        />
                                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {activeEvent ? (
                    <div className="mx-auto mt-6 max-w-xl px-2 text-center sm:mt-8">
                        <h3 className="text-balance text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                            {activeEvent.title}
                        </h3>
                        <div className="mt-3 flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground sm:flex-row sm:gap-6 sm:text-base">
                            <span className="inline-flex items-center gap-2">
                                <CalendarDays
                                    className="h-4 w-4 shrink-0 text-primary"
                                    aria-hidden
                                />
                                {formatEventWhen(activeEvent.start, activeEvent.end)}
                            </span>
                        </div>
                        <Link
                            href={route('site.events.show', activeEvent.slug)}
                            className="mt-5 inline-flex items-center justify-center text-sm font-semibold text-primary underline-offset-4 hover:underline"
                        >
                            Ver detalhes do evento
                        </Link>
                    </div>
                ) : null}

                {visibleEvents.length <= 15 ? (
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                        {visibleEvents.map((_, i) => (
                            <button
                                key={`dot-${i}`}
                                type="button"
                                onClick={() => setActiveIndex(i)}
                                className={cn(
                                    'h-2.5 w-2.5 rounded-full transition sm:h-2 sm:w-2',
                                    i === activeIndex
                                        ? 'scale-125 bg-primary'
                                        : 'bg-muted-foreground/35 hover:bg-muted-foreground/55',
                                )}
                                aria-label={`Ir para evento ${i + 1}`}
                                aria-current={i === activeIndex}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="mt-8 text-center text-sm tabular-nums text-muted-foreground">
                        {activeIndex + 1} / {visibleEvents.length}
                    </p>
                )}

                <div className="mt-10 flex justify-center">
                    <Link
                        href={route('site.events.index')}
                        className="inline-flex items-center justify-center rounded-full border-2 border-primary bg-background px-8 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
                    >
                        {trans('see_more')} eventos
                        <ChevronRight className="ml-2 h-4 w-4" aria-hidden />
                    </Link>
                </div>
            </div>
        </section>
    );
}
