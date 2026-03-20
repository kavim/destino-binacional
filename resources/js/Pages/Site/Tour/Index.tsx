import React from 'react';
import SiteLayout from '@/Layouts/SiteLayout';
import { Head } from '@inertiajs/react';
import Header from './Header';
import Filters from './Filters';
import TourList from "./ToursList";

export default function Index({ filters }) {
    return (
        <SiteLayout>
            <Head title='Tour' />

            <Header/>

            {/*<Filters filters={filters} />*/}

            <div>
                <TourList></TourList>
            </div>
        </SiteLayout>
    );
}
