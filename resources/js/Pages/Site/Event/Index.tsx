import SiteLayout from '@/Layouts/SiteLayout';
import { Head } from '@inertiajs/react';
import Header from './Header';
import EventList from './EventsList';
import Filters, { type EventFiltersState } from './Filters';

export default function Index({
    filters,
    category,
}: {
    filters?: EventFiltersState;
    category?: unknown;
}) {
    return (
        <SiteLayout>
            <Head title='Eventos' />

            <Header category={category} />

            <div className="mx-auto my-5 max-w-full space-y-4 px-2 sm:px-4 lg:max-w-7xl lg:px-8">
                <Filters filters={filters ?? {}} />
                <EventList />
            </div>
        </SiteLayout>
    );
}
