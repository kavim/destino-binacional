import SeoHead from '@/Components/SeoHead';
import SiteLayout from '@/Layouts/SiteLayout';
import { usePage } from '@inertiajs/react';
import Header from './Header';
import TourList from './ToursList';
import Filters, { type TourFilterCategoryOption, type TourFiltersState } from './Filters';
import { trans } from '@/utils';
import { SEO_FALLBACK_IMAGE } from '@/lib/seo';

export default function Index({
    filters,
    filterCategories = [],
}: {
    filters?: TourFiltersState;
    filterCategories?: TourFilterCategoryOption[];
}) {
    const { url } = usePage();

    return (
        <SiteLayout>
            <SeoHead
                title="Tours"
                description={trans('seo.tours_description')}
                image={SEO_FALLBACK_IMAGE}
            />

            <Header />

            {/* Conteúdo sobrepõe ligeiramente o hero (só o degradê) para transição mais suave */}
            <div className="relative z-10 mx-auto min-w-0 max-w-7xl px-3 pb-14 pt-2 sm:px-5 sm:pb-16 lg:px-8">
                <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:gap-10">
                    <Filters key={url} filters={filters} filterCategories={filterCategories} />
                    <TourList />
                </div>
            </div>
        </SiteLayout>
    );
}
