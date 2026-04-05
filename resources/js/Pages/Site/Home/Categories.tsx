import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

const FALLBACK_FEATURED = '/images/parque.webp';
const FALLBACK_ICON = '/images/icons/default.svg';

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

    return (
        <Link
            href={route('site.categories.show', cat.slug)}
            className="cursor-pointer"
        >
            <div className="relative overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm dark:shadow-black/20">
                <figure className="overflow-hidden bg-muted">
                    <img
                        src={featuredSrc}
                        alt=""
                        width={1280}
                        height={720}
                        loading="lazy"
                        decoding="async"
                        className="aspect-video w-full object-cover"
                        onError={() => {
                            setFeaturedSrc((prev) =>
                                prev !== FALLBACK_FEATURED
                                    ? FALLBACK_FEATURED
                                    : prev,
                            );
                        }}
                    />
                </figure>
                <div className="relative z-10 flex flex-col space-y-1.5 p-6">
                    <div className="flex flex-col justify-center text-center align-middle">
                        <img
                            src={iconSrc}
                            alt=""
                            width={96}
                            height={96}
                            decoding="async"
                            className="mx-auto h-24 w-24 object-contain"
                            onError={() => {
                                setIconSrc((prev) =>
                                    prev !== FALLBACK_ICON ? FALLBACK_ICON : prev,
                                );
                            }}
                        />
                        <h2
                            className="mt-3 text-balance text-2xl font-semibold sm:text-3xl md:text-4xl"
                            style={{ color: cat.color || undefined }}
                        >
                            {cat.name}
                        </h2>
                        {cat.description?.trim() ? (
                            <p className="mt-2 text-balance text-sm leading-relaxed text-muted-foreground line-clamp-4 sm:text-base sm:line-clamp-5">
                                {cat.description.trim()}
                            </p>
                        ) : null}
                        <span
                            className="mt-4 inline-flex min-h-10 items-center justify-center rounded-md border px-4 py-2 text-xs font-medium transition-colors hover:opacity-90 sm:min-h-0 sm:px-3 sm:py-1.5"
                            style={{
                                borderColor: cat.color || 'hsl(var(--primary))',
                                color: cat.color || 'hsl(var(--primary))',
                                backgroundColor: cat.color
                                    ? `color-mix(in srgb, ${cat.color} 14%, transparent)`
                                    : 'color-mix(in srgb, hsl(var(--primary)) 14%, transparent)',
                            }}
                        >
                            Ver más{' '}
                            <i
                                className="fa-solid fa-chevron-right ml-2"
                                aria-hidden
                            />
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default function Categories() {
    const { categories } = usePage().props as unknown as {
        categories: HomeCategoryCard[];
    };

    if (!categories?.length) {
        return null;
    }

    return (
        <div className="mt-5 grid gap-4 overflow-hidden break-words p-2 sm:grid-cols-2 sm:gap-2 md:mx-4 md:grid-cols-2 md:p-0">
            {categories.map((cat) => (
                <CategoryCard key={cat.slug} cat={cat} />
            ))}
        </div>
    );
}
