import React, { useMemo } from 'react';
import { router } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { FolderTree, Tag } from 'lucide-react';

export type TourFiltersState = { category?: string | null };

export type TourFilterCategoryOption = {
    id: number;
    name: string;
    slug: string;
};

const visitOpts = {
    preserveState: true,
    preserveScroll: true,
    replace: true as const,
    only: ['tours', 'filters', 'filterCategories'] as const,
};

export default function Filters({
    filters,
    filterCategories = [],
}: {
    filters?: TourFiltersState;
    filterCategories?: TourFilterCategoryOption[];
}) {
    const activeSlug = useMemo(() => {
        const c = filters?.category;
        return typeof c === 'string' && c.trim() !== '' ? c.trim() : null;
    }, [filters?.category]);

    const applyCategory = (slug: string | null) => {
        const q = slug ? { category: slug } : {};
        router.get(route('site.tours.index'), q, visitOpts);
    };

    if (filterCategories.length === 0) {
        return null;
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-border/80 bg-card/95 shadow-md shadow-black/[0.04] backdrop-blur-md dark:border-border dark:bg-card/90 dark:shadow-black/20">
            <div className="flex flex-col gap-4 p-4 sm:p-5">
                <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <FolderTree className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                        <span className="text-sm font-semibold text-foreground">Categorias</span>
                    </div>
                    {activeSlug ? (
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                <Tag className="h-3.5 w-3.5" aria-hidden />
                                {filterCategories.find((c) => c.slug === activeSlug)?.name ??
                                    activeSlug}
                            </span>
                        </div>
                    ) : (
                        <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                            Filtre os tours pelas categorias associadas a cada roteiro.
                        </p>
                    )}
                </div>

                <div
                    className="flex flex-wrap gap-2 border-t border-border/60 pt-4 dark:border-border/80"
                    role="list"
                >
                    <button
                        type="button"
                        role="listitem"
                        onClick={() => applyCategory(null)}
                        className={cn(
                            'inline-flex min-h-10 items-center justify-center rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                            activeSlug === null
                                ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                                : 'border-border bg-background text-foreground hover:bg-muted',
                        )}
                    >
                        Todas
                    </button>
                    {filterCategories.map((c) => (
                        <button
                            key={c.id}
                            type="button"
                            role="listitem"
                            onClick={() => applyCategory(c.slug)}
                            className={cn(
                                'inline-flex min-h-10 items-center justify-center rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                                activeSlug === c.slug
                                    ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                                    : 'border-border bg-background text-foreground hover:bg-muted',
                            )}
                        >
                            {c.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
