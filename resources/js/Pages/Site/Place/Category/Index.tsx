import SiteLayout from '@/Layouts/SiteLayout';
import { Head, usePage } from '@inertiajs/react';
import Pagination from '@/Shared/Pagination';
import CategoryHeader from './CategoryHeader';
import PlaceCardList from '../PlaceCardList';

type SiteCategoryShow = {
    name: string;
    description: string | null;
    color: string | null;
    featured_image: string;
    icon: string;
};

type SiteCategoryIndexPageProps = {
    category: SiteCategoryShow;
    places: {
        data: Array<{ slug: string; name: string; image?: string }>;
        links: unknown[];
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

            <div className='w-full'>
                <div
                    className={`border-y border-border px-6 py-6 text-center shadow-sm ${!bandBg ? 'bg-primary text-primary-foreground' : ''}`}
                    style={bandBg ? { backgroundColor: bandBg, color: bandFg } : undefined}
                >
                    {category.description}
                </div>
            </div>

            <div className="sm:max-w-full lg:max-w-7xl mx-auto my-5">
                <PlaceCardList places={data} />
                <Pagination links={links} />
            </div>
        </SiteLayout>
    );
}
