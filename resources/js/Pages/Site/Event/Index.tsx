import SiteLayout from '@/Layouts/SiteLayout';
import { Head, usePage } from '@inertiajs/react';
import Header from './Header';
import EventList from './EventsList';
import Filters, { type EventFiltersState } from './Filters';

export default function Index({
    filters,
    category: _category,
}: {
    filters?: EventFiltersState;
    category?: unknown;
}) {
    const { url } = usePage();

    return (
        <SiteLayout>
            <Head title="Eventos" />

            <Header />

            {/* Conteúdo sobrepõe ligeiramente o hero (só o degradê) para transição mais suave */}
            <div className="relative z-10 mx-auto min-w-0 max-w-7xl px-3 pb-14 pt-2 sm:px-5 sm:pb-16 lg:px-8">
                <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:gap-10">
                    {/* key=url remonta o bloco a cada mudança de query — evita estado fantasma do formulário */}
                    <Filters key={url} filters={filters} />
                    <EventList />
                </div>
            </div>
        </SiteLayout>
    );
}
