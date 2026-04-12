import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm, usePage, router } from '@inertiajs/react';
import { Card, CardContent } from '@/Components/ui/card';
import Form, { type FormChangeEvent } from './Partials/Form';
import type React from 'react';

type PlaceRecord = Record<string, unknown> & {
    id: number;
    name?: string;
    description_es?: string;
    description_pt?: string;
    address?: string;
    city_id?: string | number;
    place_type_id?: string | number;
    image?: string;
    google_maps_src?: string;
    order?: string | number;
};

export default function Edit() {
    const { auth, place, category_ids } = usePage().props as unknown as {
        auth: unknown;
        place: PlaceRecord;
        category_ids: number[];
    };

    const { data, setData, errors, put, processing } = useForm({
        name: place.name ?? '',
        description_es: String(place.description_es ?? ''),
        description_pt: String(place.description_pt ?? ''),
        address: String(place.address ?? ''),
        category_ids: category_ids ?? [],
        city_id: place.city_id != null ? String(place.city_id) : '',
        place_type_id: place.place_type_id != null ? String(place.place_type_id) : '',
        featured_image: '',
        image: place.image != null ? String(place.image) : '',
        google_maps_src: String(place.google_maps_src ?? ''),
        order: place.order != null ? String(place.order) : '',
    });

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement> | FormChangeEvent) => {
        const t = event.target;
        const value = t.type === 'checkbox' ? Boolean(t.checked) : t.value;
        setData((prev) => ({ ...prev, [t.name]: value }) as typeof prev);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('places.update', place.id), { preserveScroll: true });
    };

    function onDelete() {
        if (confirm('Borrar este Local? ' + place.name)) {
            // router.delete();
            router.visit(route('places.destroy', place.id), {
                method: 'delete',
            })
        }
    }

    return (
        <AuthenticatedLayout
            auth={auth}
            header={<h2 className="font-semibold text-xl text-foreground leading-tight">Editar Local</h2>}
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <Card className="shadow-sm">
                        <CardContent className="p-4 sm:p-8">
                            <Form handleOnChange={handleOnChange} submit={submit} data={data} errors={errors} processing={processing} onDelete={onDelete}></Form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
