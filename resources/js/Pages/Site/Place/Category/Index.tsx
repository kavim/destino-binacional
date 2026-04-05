import SiteLayout from '@/Layouts/SiteLayout';
import { Head, usePage } from '@inertiajs/react';
import Pagination, { type PaginationLink } from '@/Shared/Pagination';
import CategoryHeader from './CategoryHeader';
import PlaceCardList from '../PlaceCardList';

type SiteCategoryShow = {
    name: string;
    description: string | null;
    color: string | null;
    featured_image: string;
    icon: string;
};

const EMPTY_CATEGORY_COPY =
    'Próximamente compartiremos más detalles sobre esta categoría.';

type SiteCategoryIndexPageProps = {
    category: SiteCategoryShow;
    places: {
        data: Array<{ slug: string; name: string; image?: string }>;
        links: PaginationLink[];
    };
};

function foregroundForHex(hex: string | null | undefined): string {
    if (!hex || typeof hex !== 'string' || hex.length < 7) return '#ffffff';
    const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
    if (!m) return '#ffffff';
    const n = parseInt(m[1], 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 180 ? '#292929' : '#ffffff';
}

export default function Index() {
    const { places, category } = usePage().props as unknown as SiteCategoryIndexPageProps;
    const { data, links } = places;

    const bandBg = category.color?.trim() || undefined;
    const bandFg = bandBg ? foregroundForHex(bandBg) : undefined;

    return (
        <SiteLayout>
            <Head title={category.name} />

            <CategoryHeader category={category} />

            <div className="w-full">
                <div
                    className={`border-y border-border px-4 py-5 text-center text-sm leading-relaxed shadow-sm sm:px-6 sm:py-6 sm:text-base ${!bandBg ? 'bg-primary text-primary-foreground' : ''}`}
                    style={bandBg ? { backgroundColor: bandBg, color: bandFg } : undefined}
                >
                    <p className="mx-auto max-w-3xl text-balance whitespace-pre-line">
                        {category.description?.trim()
                            ? category.description.trim()
                            : EMPTY_CATEGORY_COPY}
                    </p>
                </div>
            </div>

            <div className="mx-auto my-5 max-w-full px-2 sm:px-4 lg:max-w-7xl lg:px-8">
                <PlaceCardList places={data} />
                <Pagination links={links} />
            </div>
        </SiteLayout>
    );
}
