import SiteLayout from '@/Layouts/SiteLayout';
import { Head } from '@inertiajs/react';
import Header from './Header';
import TourList from "./ToursList";

export default function Index() {
    return (
        <SiteLayout>
            <Head title='Tour' />

            <Header />

            <div className="mx-auto my-5 max-w-full px-2 sm:px-4 lg:max-w-7xl lg:px-8">
                <TourList />
            </div>
        </SiteLayout>
    );
}
