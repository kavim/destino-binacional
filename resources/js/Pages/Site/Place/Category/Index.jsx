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
                <div className='shadow-sm text-white p-6 bg-cyan-800 text-center'>
                    {category.description}
                </div>
            </div>

            {/* <Filter category={category}></Filter> */}

            <div className="sm:max-w-full lg:max-w-7xl mx-auto my-5">
                <PlaceCardList places={data} />
                <Pagination links={links} />
            </div>
        </SiteLayout>
    );
}
