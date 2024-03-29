import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import Form from './Partials/Form';

export default function Create() {
    const { auth } = usePage().props;

    const { data, setData, errors, post, reset, processing, recentlySuccessful } = useForm({
        name: '',
        description_es: '',
        description_pt: '',
        address: '',
        city_id: '',
        place_type_id: '',
        featured_image: '',
        google_maps_src: '',
        order: '',
        category_ids: [],
    });

    const onCorte = (image) => {
        setData('featured_image', image);
        setData('image', null);
    }

    const handleOnChange = event => {
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };

    const submit = e => {
        e.preventDefault();
        post(route('places.store'));
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Crear Local</h2>}
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                        <Form handleOnChange={handleOnChange} submit={submit} data={data} errors={errors} processing={processing} onCorte={onCorte}></Form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
