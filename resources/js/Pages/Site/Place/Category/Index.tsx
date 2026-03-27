import SiteLayout from '@/Layouts/SiteLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import Pagination from '@/Shared/Pagination';
import CategoryHeader from './CategoryHeader';
import Filter from './Filter';
import PlaceCardList from '../PlaceCardList';

export default function Index() {
    const { places, category } = usePage().props;
    const { data, links } = places;

    return (
        <SiteLayout>
            <Head title={category.name} />

            <CategoryHeader category={category} />

            <div className='w-full'>
                <div className="border-y border-border bg-primary px-6 py-6 text-center text-primary-foreground shadow-sm">
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
