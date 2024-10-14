import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm, usePage, router } from '@inertiajs/react';
import Form from './Partials/Form';

export default function Edit() {
    const { auth, tour, category_ids } = usePage().props;

    const { data, setData, errors, put, processing } = useForm({
        title: tour.title || '',
        description: tour.description || '',
        price: tour.price || '',
        currency: tour.currency || 'BRL',
        featured_image: '',
        image: tour.image,
        google_maps_src: tour.google_maps_src || '',
        meeting_point: tour.meeting_point || '',
        guide: tour.guide || '',
        start: tour.start || '',
        end: tour.end || '',
        category_ids: category_ids ? category_ids : [],
        recurrence_day_hour: tour.recurrence_day_hour || [],
        recurrence_enabled: tour.recurrence_enabled || '',
    });

    const handleOnChange = event => {

        console.log(event.target.name);
        console.log(event.target.value);

        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };

    const submit = e => {
        e.preventDefault();
        put(route('tours.update', tour.id), { preserveScroll: true });
    };

    function onDelete() {
        if (confirm('Borrar este Local? ' + tour.title)) {
            router.visit(route('tours.destroy', tour.id), {
                method: 'delete',
            })
        }
    }

    return (
        <AuthenticatedLayout
            auth={auth}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Editar Local</h2>}
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                        <Form handleOnChange={handleOnChange} submit={submit} data={data} errors={errors} processing={processing} onDelete={onDelete}></Form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
