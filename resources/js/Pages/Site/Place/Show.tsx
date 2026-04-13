import { Head } from '@inertiajs/react';
import SiteLayout from '@/Layouts/SiteLayout';
import GoogleMapsEmbedFrame from '@/Components/site/GoogleMapsEmbedFrame';
import { cn } from '@/lib/utils';
import { googleMapsOpenUrl, normalizeGoogleMapsEmbedSrc } from '@/lib/mapsEmbedUrl';
import { cmsRichTextDisplayClassName } from '@/lib/cmsRichTextDisplay';
import { sanitizeCmsHtmlForDisplay } from '@/lib/sanitizeHtml';
import { Building2, ExternalLink, MapPin } from 'lucide-react';

type CityLite = {
    name: string;
    state?: { name: string } | null;
};

type SitePlaceShow = {
    name: string;
    slug: string;
    image: string;
    description: string;
    address?: string | null;
    google_maps_src?: string | null;
    city?: CityLite | null;
    place_type?: { name: string } | null;
    categories?: Array<{ name: string; slug: string }>;
};

export default function Show({ place }: { place: SitePlaceShow }) {
    const safeDescription = sanitizeCmsHtmlForDisplay(place.description);
    const categories = Array.isArray(place.categories) ? place.categories : [];

    const headerClass = cn(
        'relative flex w-full min-h-[55vh] items-center bg-cover bg-center',
    );

    const locationLine = [
        place.address?.trim(),
        place.city?.name,
        place.city?.state?.name,
    ]
        .filter(Boolean)
        .join(', ');

    const mapEmbed = normalizeGoogleMapsEmbedSrc(place.google_maps_src);
    const mapsOpenUrl = googleMapsOpenUrl(place.google_maps_src ?? undefined, locationLine || null);

    return (
        <SiteLayout>
            <Head title={place.name} />
            <div className="w-full overflow-hidden">
                <div className={headerClass} style={{ backgroundImage: `url("${place.image}")` }}>
                    <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-md" />

                    <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-10 px-4 py-12 md:flex-row md:items-center md:px-10 md:py-10">
                        <div className="flex w-full flex-col items-center break-words text-white md:w-3/5 md:items-start">
                            {place.place_type?.name ? (
                                <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-white/75 md:text-left">
                                    {place.place_type.name}
                                </p>
                            ) : null}

                            <h1 className="mb-6 text-center text-3xl font-extrabold leading-tight md:text-left md:text-5xl">
                                {place.name}
                            </h1>

                            {categories.length > 0 ? (
                                <div className="mb-4 flex flex-wrap justify-center gap-2 md:justify-start">
                                    {categories.map((c) => (
                                        <span
                                            key={`${c.slug}-${c.name}`}
                                            className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm"
                                        >
                                            {c.name}
                                        </span>
                                    ))}
                                </div>
                            ) : null}

                            {locationLine ? (
                                <div className="flex flex-wrap items-center justify-center gap-3 text-base text-stone-200 md:justify-start md:text-lg">
                                    <MapPin className="h-5 w-5 shrink-0 text-white/70" aria-hidden />
                                    <span className="text-center md:text-left">{locationLine}</span>
                                </div>
                            ) : null}
                        </div>

                        <div className="flex w-full justify-center md:w-2/5 md:justify-end">
                            <img
                                src={place.image}
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
                                <h2 className="mb-6 flex items-center gap-2 border-b border-border pb-2 text-2xl font-bold text-foreground">
                                    <Building2 className="h-6 w-6 text-primary" aria-hidden />
                                    Descripción del lugar
                                </h2>
                                <div
                                    className={cmsRichTextDisplayClassName(
                                        'max-w-none text-muted-foreground',
                                    )}
                                    dangerouslySetInnerHTML={{ __html: safeDescription }}
                                />
                            </div>
                        </div>

                        <div className="mt-8 w-full md:mt-0 md:w-1/3">
                            <div className="sticky top-5 overflow-hidden rounded-xl border border-border bg-card shadow-lg dark:bg-card">
                                <div className="flex flex-wrap items-center gap-3 border-b border-border bg-muted px-6 py-4 font-bold text-foreground">
                                    <MapPin className="h-5 w-5 text-primary" aria-hidden />
                                    <h3>Ubicación</h3>
                                </div>

                                <div className="p-6">
                                    <div className="space-y-4">
                                        {locationLine ? (
                                            <p className="text-sm font-medium leading-relaxed text-muted-foreground">
                                                {locationLine}
                                            </p>
                                        ) : (
                                            <p className="text-sm leading-relaxed text-muted-foreground">
                                                Consulte el mapa siguiente o contacte al destino.
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
