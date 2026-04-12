import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm, usePage, router } from '@inertiajs/react';
import { Card, CardContent } from '@/Components/ui/card';
import Form, { type FormChangeEvent } from './Partials/Form';
import type React from 'react';

type EventRecord = Record<string, unknown> & {
    id: number;
    title?: string;
    description?: string;
    google_maps_src?: string;
    address?: string;
    city_id?: string | number;
    price?: string | number;
    door_time?: string;
    start?: string;
    end?: string;
    is_online?: boolean;
    link?: string;
    image?: string;
};

export default function Edit() {
    const { auth, event, tag_ids } = usePage().props as unknown as {
        auth: unknown;
        event: EventRecord;
        tag_ids: number[];
    };

    const { data, setData, errors, put, processing } = useForm({
        title: event.title ?? '',
        description: String(event.description ?? ''),
        google_maps_src: event.google_maps_src ? String(event.google_maps_src) : '',
        address: event.address ? String(event.address) : '',
        city_id: event.city_id != null ? String(event.city_id) : '',
        category_id: null,
        price: event.price != null ? String(event.price) : '',
        door_time: event.door_time ? String(event.door_time) : '',
        start: event.start ? String(event.start) : '',
        end: event.end ? String(event.end) : '',
        is_online: Boolean(event.is_online),
        link: event.link ? String(event.link) : '',
        featured_image: '',
        image: event.image ? String(event.image) : '',
        tag_ids: tag_ids ?? [],
    });

    const onCorte = (image: string) => {
        setData('featured_image', image);
        setData('image', '');
    };

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement> | FormChangeEvent) => {
        const t = event.target;
        if (t.name === 'is_online') {
            setData('address', '');
            setData('city_id', '');
        }
        const value = t.type === 'checkbox' ? Boolean(t.checked) : t.value;
        setData((prev) => ({ ...prev, [t.name]: value }) as typeof prev);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('events.update', event.id), { preserveScroll: true });
    };

    function onDelete() {
        if (confirm('Borrar este evento? ' + event.title)) {
            router.visit(route('events.destroy', event.id), {
                method: 'delete',
            })
        }
    }

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="font-semibold text-xl text-foreground leading-tight">Editar Evento</h2>
            }
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <Card className="shadow-sm">
                        <CardContent className="p-4 sm:p-8">
                            <Form handleOnChange={handleOnChange} submit={submit} data={data} errors={errors} processing={processing} onCorte={onCorte} onDelete={onDelete}></Form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
