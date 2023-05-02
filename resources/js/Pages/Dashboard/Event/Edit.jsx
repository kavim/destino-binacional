import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Inertia } from '@inertiajs/inertia';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import Form from './Partials/Form';

export default function Edit() {
    const { auth, event } = usePage().props;

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        title: event.title,
        description: event.description ? event.description : "<p>Descripción del Evento</p>",
        google_maps_src: event.google_maps_src ? event.google_maps_src : '',
        address: event.address ? event.address : '',
        city_id: event.city_id ? event.city_id : '',
        category_id: event.category_id ? event.category_id : '',
        price: event.price ? event.price : '',
        door_time: event.door_time ? event.door_time : '',
        start: event.start ? event.start : '',
        end: event.end ? event.end : '',
        is_online: event.is_online ? true : false,
        link: event.link ? event.link : '',
        featured_image: '',
        image: event.image ? event.image : '',
    });

    const onCorte = (image) => {
        setData('featured_image', image);
        setData('image', null);
    }

    const handleOnChange = event => {
        if (event.target.name === 'is_online') {
            setData('address', '');
            setData('city_id', '');
        }
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };

    const submit = e => {
        e.preventDefault();
        put(route('events.update', event.id), { preserveScroll: true });
    };

    function onDelete() {
        if (confirm('Borrar este evento? ' + event.title)) {
            Inertia.delete(route('events.destroy', event.id));
        }
    }

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Editar Evento</h2>
            }
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                        <Form handleOnChange={handleOnChange} submit={submit} data={data} errors={errors} processing={processing} onCorte={onCorte} onDelete={onDelete}></Form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
