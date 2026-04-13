import { Head, Link } from '@inertiajs/react';
import SiteLayout from '@/Layouts/SiteLayout';
import GoogleMapsEmbedFrame from '@/Components/site/GoogleMapsEmbedFrame';
import { cn } from '@/lib/utils';
import { googleMapsOpenUrl, normalizeGoogleMapsEmbedSrc } from '@/lib/mapsEmbedUrl';
import { cmsRichTextDisplayClassName } from '@/lib/cmsRichTextDisplay';
import { sanitizeCmsHtmlForDisplay } from '@/lib/sanitizeHtml';
import { formatCurrencyCents } from '@/lib/format';
import { ExternalLink } from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

type TourCategory = {
    name: string;
    slug: string;
};

type SiteTourShow = {
    title: string;
    slug: string;
    image: string;
    start?: string | null;
    end?: string | null;
    description: string;
    google_maps_src?: string | null;
    meeting_point?: string | null;
    guide?: string | null;
    price?: number | null;
    currency?: string | null;
    recurrence_enabled?: boolean;
    categories?: TourCategory[];
};

export default function Show({ tour }: { tour: SiteTourShow }) {
    dayjs.locale('pt-br');

    const safeDescription = sanitizeCmsHtmlForDisplay(tour.description);
    const categories = Array.isArray(tour.categories) ? tour.categories : [];

    const headerClass = cn(
        'relative flex w-full min-h-[55vh] items-center bg-cover bg-center',
    );

    const s = tour.start ? dayjs(tour.start) : null;
    const e = tour.end ? dayjs(tour.end) : null;
    const sOk = s?.isValid() ?? false;
    const eOk = e?.isValid() ?? false;
    const sameDay = sOk && eOk && s && e && s.isSame(e, 'day');

    const priceLabel =
        typeof tour.price === 'number' && tour.price > 0
            ? formatCurrencyCents(tour.price, tour.currency)
            : null;

    const meeting = typeof tour.meeting_point === 'string' ? tour.meeting_point.trim() : '';
    const mapEmbed = normalizeGoogleMapsEmbedSrc(tour.google_maps_src);
    const mapsOpenUrl = googleMapsOpenUrl(tour.google_maps_src ?? undefined, meeting || null);

    return (
        <SiteLayout>
            <Head title={tour.title} />
            <div className="w-full overflow-hidden">
                <div className={headerClass} style={{ backgroundImage: `url("${tour.image}")` }}>
                    <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-md" />

                    <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-10 px-4 py-12 md:flex-row md:items-center md:px-10 md:py-10">
                        <div className="flex w-full flex-col items-center break-words text-white md:w-3/5 md:items-start">
                            <h1 className="mb-6 text-center text-3xl font-extrabold leading-tight md:text-left md:text-5xl">
                                {tour.title}
                            </h1>

                            {categories.length > 0 ? (
                                <div className="mb-4 flex flex-wrap justify-center gap-2 md:justify-start">
                                    {categories.map((c) => (
                                        <Link
                                            key={`${c.slug}-${c.name}`}
                                            href={route('site.tours.index', { category: c.slug })}
                                            className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/25"
                                        >
                                            {c.name}
                                        </Link>
                                    ))}
                                </div>
                            ) : null}

                            {sOk || eOk ? (
                                <div className="flex flex-wrap items-center justify-center gap-3 text-lg md:justify-start">
                                    <i className="fa-solid fa-calendar-days text-white/70" aria-hidden />
                                    {sOk && eOk && !sameDay ? (
                                        <div className="flex items-center gap-2">
                                            <span>{s!.format('DD MMM YYYY')}</span>
                                            <i
                                                className="fa-solid fa-arrows-left-right text-xs opacity-50"
                                                aria-hidden
                                            />
                                            <span>{e!.format('DD MMM YYYY')}</span>
                                        </div>
                                    ) : sOk ? (
                                        <span>{s!.format('DD MMM YYYY')}</span>
                                    ) : (
                                        <span>{e!.format('DD MMM YYYY')}</span>
                                    )}
                                </div>
                            ) : null}

                            {tour.recurrence_enabled ? (
                                <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-lg text-stone-200 md:justify-start">
                                    <i className="fa-solid fa-repeat text-white/70" aria-hidden />
                                    <span>Atividade recorrente</span>
                                </div>
                            ) : null}

                            {meeting ? (
                                <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-lg md:justify-start">
                                    <div className="flex items-center gap-2 text-stone-200">
                                        <i className="fa-solid fa-location-dot text-white/70" aria-hidden />
                                        <span className="text-center md:text-left">{meeting}</span>
                                    </div>
                                </div>
                            ) : null}

                            {tour.guide ? (
                                <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-lg md:justify-start">
                                    <div className="flex items-center gap-2 text-stone-200">
                                        <i className="fa-solid fa-user text-white/70" aria-hidden />
                                        <span className="text-center md:text-left">{tour.guide}</span>
                                    </div>
                                </div>
                            ) : null}

                            {priceLabel ? (
                                <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-lg md:justify-start">
                                    <div className="flex items-center gap-2 font-semibold text-white">
                                        <i className="fa-solid fa-tag text-white/70" aria-hidden />
                                        <span>{priceLabel}</span>
                                    </div>
                                </div>
                            ) : null}
                        </div>

                        <div className="flex w-full justify-center md:w-2/5 md:justify-end">
                            <img
                                src={tour.image}
                                alt=""
                                className="max-h-[50vh] rounded-xl border border-white/10 object-contain shadow-2xl"
                            />
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-6xl px-5 pb-20 pt-12">
                    <div className="flex flex-col gap-10 md:flex-row">
                        <div className="w-full break-words md:w-2/3">
                            <div className="overflow-hidden rounded-xl border border-border bg-white p-6 shadow-lg dark:bg-card">
                                <h2 className="mb-6 border-b border-gray-100 pb-2 text-2xl font-bold text-gray-800 dark:border-border dark:text-foreground">
                                    Sobre o tour
                                </h2>
                                <div
                                    className={cmsRichTextDisplayClassName(
                                        'max-w-none text-gray-600 dark:text-muted-foreground',
                                    )}
                                    dangerouslySetInnerHTML={{ __html: safeDescription }}
                                />
                            </div>
                        </div>

                        <div className="mt-8 w-full md:mt-0 md:w-1/3">
                            <div className="sticky top-5 overflow-hidden rounded-xl bg-white md:border md:border-gray-100 md:shadow-lg dark:border-border dark:bg-card">
                                <div className="flex flex-wrap items-center gap-3 border-b border-gray-100 bg-gray-50 px-6 py-4 font-bold text-gray-800 dark:border-border dark:bg-muted dark:text-foreground">
                                    <i className="fa-solid fa-location-dot text-blue-400" aria-hidden />
                                    <h3>Localização</h3>
                                </div>

                                <div className="p-6">
                                    <div className="space-y-4">
                                        {meeting ? (
                                            <p className="text-sm font-medium leading-relaxed text-gray-600 dark:text-muted-foreground">
                                                {meeting}
                                            </p>
                                        ) : (
                                            <p className="text-sm leading-relaxed text-gray-600 dark:text-muted-foreground">
                                                Ponto de encontro a combinar com o organizador.
                                            </p>
                                        )}
                                        {mapsOpenUrl ? (
                                            <a
                                                href={mapsOpenUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-semibold text-primary transition hover:bg-primary/15"
                                            >
                                                Abrir no Google Maps
                                                <ExternalLink className="h-4 w-4" aria-hidden />
                                            </a>
                                        ) : null}
                                        {mapEmbed ? (
                                            <GoogleMapsEmbedFrame src={mapEmbed} title="Mapa" />
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SiteLayout>
    );
}
