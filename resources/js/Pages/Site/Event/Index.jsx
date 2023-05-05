import React, { useState } from 'react';
import SiteLayout from '@/Layouts/SiteLayout';
import { Head, useForm } from '@inertiajs/react';
import Header from './Header';
import EventList from './EventsList';
import DataPickerInputStart from '@/Shared/DataPickerInputStart';
import DataPickerInputEnd from '@/Shared/DataPickerInputEnd';
import PrimaryButton from '@/Components/PrimaryButton';
import { trans } from '@/utils';
import Filters from './Filters';

export default function Index({ filters, events, category }) {
    return (
        <SiteLayout>
            <Head title='Eventos' />

            <Header category={category} />

            <Filters filters={filters} />

            <div>
                <EventList events={events}></EventList>
            </div>
        </SiteLayout>
    );
}
