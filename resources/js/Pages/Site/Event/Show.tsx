import { Head } from '@inertiajs/react';
import SiteLayout from '@/Layouts/SiteLayout';
import { cn } from '@/lib/utils';
import { safeGoogleMapsEmbedUrl } from '@/lib/mapsEmbedUrl';
import { sanitizeCmsHtmlForDisplay } from '@/lib/sanitizeHtml';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

type CityLite = {
    name: string;
    state?: { name: string } | null;
};

type SiteEventShow = {
    title: string;
    image: string;
    start: string;
    end: string;
    description: string;
    google_maps_src?: string | null;
    is_online?: boolean;
    link?: string | null;
    address?: string | null;
    city?: CityLite | null;
};

export default function Show({ event }: { event: SiteEventShow }) {
    dayjs.locale('es');

    const safeDescription = sanitizeCmsHtmlForDisplay(event.description);
    const mapEmbed = safeGoogleMapsEmbedUrl(event.google_maps_src);

    const headerClass = cn(
        'relative flex w-full min-h-[55vh] items-center bg-cover bg-center',
    );

    return (
        <SiteLayout>
            <Head title={event.title} />
            <div className="w-full overflow-hidden">
                <div className={headerClass} style={{ backgroundImage: `url("${event.image}")` }}>
                    <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-md" />

                    <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-10 px-4 py-12 md:flex-row md:items-center md:px-10 md:py-10">
                        <div className="flex w-full flex-col items-center break-words text-white md:w-3/5 md:items-start">
                            <h1 className="mb-6 text-center text-3xl font-extrabold leading-tight md:text-left md:text-5xl">
                                {event.title}
                            </h1>

                            <div className="flex flex-wrap items-center justify-center gap-3 text-lg md:justify-start">
                                <i className="fa-solid fa-calendar-days text-white/70" aria-hidden />
                                {event.start !== event.end ? (
                                    <div className="flex items-center gap-2">
                                        <span>{dayjs(event.start).format('DD MMM YYYY')}</span>
                                        <i className="fa-solid fa-arrows-left-right text-xs opacity-50" aria-hidden />
                                        <span>{dayjs(event.end).format('DD MMM YYYY')}</span>
                                    </div>
                                ) : (
                                    <span>{dayjs(event.start).format('DD MMM YYYY')}</span>
                                )}
                            </div>

                            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-lg md:justify-start">
                                {event.is_online ? (
                                    <div className="flex items-center gap-2">
                                        <i className="fa-solid fa-globe text-white/70" aria-hidden />
                                        <span>Evento Online</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-stone-200">
                                        <i className="fa-solid fa-location-dot text-white/70" aria-hidden />
                                        <span className="text-center md:text-left">
                                            {event.address}
                                            {event.city?.name ? `, ${event.city.name}` : ''}
                                            {event.city?.state?.name ? `, ${event.city.state.name}` : ''}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex w-full justify-center md:w-2/5 md:justify-end">
                            <img
                                src={event.image}
                                alt={event.title}
                                className="max-h-[50vh] rounded-xl border border-white/10 object-contain shadow-2xl"
                            />
                        </div>
                    </div>
                </div>

                <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 pb-20 pt-12 md:flex-row">
                    <div className="w-full break-words md:w-2/3">
                        <h2 className="mb-6 border-b border-gray-100 pb-2 text-2xl font-bold text-gray-800 dark:border-border dark:text-foreground">
                            Descrição do evento
                        </h2>
                        <div
                            className="prose prose-stone max-w-none leading-relaxed text-gray-600 dark:prose-invert dark:text-muted-foreground"
                            dangerouslySetInnerHTML={{ __html: safeDescription }}
                        />
                    </div>

                    <div className="mt-8 w-full md:mt-0 md:w-1/3">
                        <div className="sticky top-5 overflow-hidden rounded-xl bg-white md:border md:border-gray-100 md:shadow-lg dark:border-border dark:bg-card">
                            <div className="flex flex-wrap items-center gap-3 border-b border-gray-100 bg-gray-50 px-6 py-4 font-bold text-gray-800 dark:border-border dark:bg-muted dark:text-foreground">
                                {event.is_online ? (
                                    <>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="text-blue-600 dark:text-primary"
                                            aria-hidden
                                        >
                                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                        </svg>
                                        <h3>Acesso Digital</h3>
                                    </>
                                ) : (
                                    <>
                                        <i className="fa-solid fa-location-dot text-blue-400" aria-hidden />
                                        <h3>Localização</h3>
                                    </>
                                )}
                            </div>

                            <div className="p-6">
                                {event.is_online ? (
                                    <div className="space-y-6 text-center md:text-left">
                                        <p className="text-sm leading-relaxed text-gray-600 dark:text-muted-foreground">
                                            Este evento será realizado de forma digital. Clique no botão abaixo
                                            para ser redirecionado ao link oficial de participação.
                                        </p>
                                        {event.link ? (
                                            <a
                                                href={event.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-4 font-bold text-white shadow-md transition-all hover:bg-blue-700 dark:bg-primary dark:hover:bg-primary/90"
                                            >
                                                <span>Ir para o evento</span>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="transition-transform group-hover:translate-x-1"
                                                    aria-hidden
                                                >
                                                    <path d="M5 12h14" />
                                                    <path d="m12 5 7 7-7 7" />
                                                </svg>
                                            </a>
                                        ) : null}
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <p className="text-sm font-medium leading-relaxed text-gray-600 dark:text-muted-foreground">
                                            {event.address}
                                            {event.city?.name ? `, ${event.city.name}` : ''}
                                            {event.city?.state?.name ? `, ${event.city.state.name}` : ''}
                                        </p>
                                        {mapEmbed ? (
                                            <div className="h-[250px] w-full overflow-hidden rounded-lg border border-gray-200 dark:border-border">
                                                <iframe
                                                    className="h-full w-full"
                                                    src={mapEmbed}
                                                    title="Mapa"
                                                    loading="lazy"
                                                    referrerPolicy="strict-origin-when-cross-origin"
                                                />
                                            </div>
                                        ) : null}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SiteLayout>
    );
}
