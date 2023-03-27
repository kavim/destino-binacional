import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import Form from './Partials/Form';

export default function Edit() {
    const { auth, place } = usePage().props;

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        name: place.name,
        description_es: place.description_es,
        description_pt: place.description_pt,
        address: place.address,
        category_id: place.category_id,
        city_id: place.city_id,
        place_type_id: place.place_type_id,
        featured_image: '',
        image: place.image,
        google_maps_src: place.google_maps_src,
    });

    const handleOnChange = event => {
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };

    const submit = e => {
        e.preventDefault();
        put(route('places.update', place.id), { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Create Place</h2>}
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                        <Form handleOnChange={handleOnChange} submit={submit} data={data} errors={errors} processing={processing}></Form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
