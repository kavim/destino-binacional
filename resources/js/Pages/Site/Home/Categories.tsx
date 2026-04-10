import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";

const FALLBACK_FEATURED = "/images/parque.webp";
const FALLBACK_ICON = "/images/icons/default.svg";

type HomeCategoryCard = {
    slug: string;
    name: string;
    description: string | null;
    featured_image: string;
    icon: string;
    color?: string | null;
};

function CategoryCard({ cat }: { cat: HomeCategoryCard }) {
    const [featuredSrc, setFeaturedSrc] = useState(cat.featured_image);
    const [iconSrc, setIconSrc] = useState(cat.icon);
    const accent = cat.color?.trim() || null;

    return (
        <Link
            href={route("site.categories.show", cat.slug)}
            className="group flex h-full min-h-0 cursor-pointer rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
            <article className="relative flex min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-card/40 shadow-md shadow-black/5 ring-1 ring-black/[0.04] transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/10 dark:border-white/10 dark:bg-card/30 dark:shadow-black/40 dark:ring-white/[0.06] dark:hover:shadow-black/50">
                <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-muted">
                    <img
                        src={featuredSrc}
                        alt=""
                        width={1280}
                        height={800}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                        onError={() => {
                            setFeaturedSrc((prev) =>
                                prev !== FALLBACK_FEATURED
                                    ? FALLBACK_FEATURED
                                    : prev,
                            );
                        }}
                    />
                    <div
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent dark:from-black/70 dark:via-black/25"
                        aria-hidden
                    />
                    <div
                        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent dark:from-white/[0.07]"
                        aria-hidden
                    />

                    <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
                        <div
                            className="flex h-28 w-28 items-center justify-center rounded-3xl border border-white/45 bg-white/25 p-4 shadow-lg backdrop-blur-xl backdrop-saturate-150 dark:border-white/20 dark:bg-black/35 dark:backdrop-blur-2xl sm:h-32 sm:w-32 sm:p-5 md:h-36 md:w-36 md:p-6"
                            style={
                                accent
                                    ? {
                                          boxShadow: `0 16px 48px color-mix(in srgb, ${accent} 26%, transparent), 0 0 0 1px color-mix(in srgb, ${accent} 18%, transparent) inset`,
                                      }
                                    : undefined
                            }
                        >
                            <img
                                src={iconSrc}
                                alt=""
                                width={128}
                                height={128}
                                decoding="async"
                                className="max-h-full max-w-full object-contain drop-shadow-lg"
                                onError={() => {
                                    setIconSrc((prev) =>
                                        prev !== FALLBACK_ICON
                                            ? FALLBACK_ICON
                                            : prev,
                                    );
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="relative z-10 -mt-5 flex min-h-0 flex-1 flex-col rounded-2xl border border-white/60 bg-white/72 px-5 py-5 shadow-lg backdrop-blur-2xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/55 dark:border-white/[0.12] dark:bg-zinc-950/55 dark:shadow-black/40 supports-[backdrop-filter]:dark:bg-zinc-950/45 sm:-mt-7 sm:mx-4 sm:mb-4 sm:px-6 sm:py-6">
                    {accent ? (
                        <div
                            className="mb-3 h-1 w-10 shrink-0 rounded-full opacity-90"
                            style={{
                                background: `linear-gradient(90deg, ${accent}, color-mix(in srgb, ${accent} 35%, transparent))`,
                            }}
                            aria-hidden
                        />
                    ) : (
                        <div className="mb-3 h-1 w-10 shrink-0 rounded-full bg-primary/80" />
                    )}
                    <h2
                        className="shrink-0 text-balance text-xl font-semibold tracking-tight text-foreground sm:text-2xl md:text-3xl"
                        style={accent ? { color: accent } : undefined}
                    >
                        {cat.name}
                    </h2>
                    {cat.description?.trim() ? (
                        <p className="mt-2.5 min-h-0 text-balance text-sm leading-relaxed text-muted-foreground line-clamp-4 sm:text-base sm:leading-relaxed sm:line-clamp-5">
                            {cat.description.trim()}
                        </p>
                    ) : null}
                    <div className="min-h-5 flex-1 basis-0" aria-hidden />
                    <span
                        className="mt-5 inline-flex min-h-10 w-full shrink-0 items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-medium transition-[opacity,transform] group-hover:opacity-95 sm:min-h-11 sm:w-auto sm:px-5"
                        style={{
                            borderColor: accent || "hsl(var(--primary))",
                            color: accent || "hsl(var(--primary))",
                            backgroundColor: accent
                                ? `color-mix(in srgb, ${accent} 12%, transparent)`
                                : "color-mix(in srgb, hsl(var(--primary)) 12%, transparent)",
                        }}
                    >
                        Ver más{" "}
                        <i
                            className="fa-solid fa-chevron-right ml-2 text-[0.7em] opacity-80"
                            aria-hidden
                        />
                    </span>
                </div>
            </article>
        </Link>
    );
}

export default function Categories() {
    const { cats } = usePage().props as unknown as {
        cats?: { categories?: HomeCategoryCard[] };
    };
    const categories = cats?.categories ?? [];

    if (!categories.length) {
        return null;
    }

    return (
        <section className="mt-8 break-words sm:mt-10" aria-label="Categorías">
            <div className="grid items-stretch gap-5 sm:grid-cols-2 sm:gap-6 md:mx-0 md:gap-8 lg:gap-10">
                {categories.map((cat) => (
                    <CategoryCard key={cat.slug} cat={cat} />
                ))}
            </div>
        </section>
    );
}
