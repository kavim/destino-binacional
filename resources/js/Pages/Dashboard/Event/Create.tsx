import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm, usePage } from '@inertiajs/react';
import { Card, CardContent } from '@/Components/ui/card';
import Form, { type FormChangeEvent } from './Partials/Form';
import { EVENT_FORM_FIELD_ORDER, notifyFormValidationErrors } from '@/lib/formValidationFeedback';
import type React from 'react';
import { useCallback, useRef } from 'react';
import { createGalleryState, submitEntityWithGallery, type GalleryState } from '@/lib/galleryForm';

export default function Create() {
    const { auth } = usePage().props as unknown as { auth: unknown };

    const galleryStateRef = useRef<GalleryState>(createGalleryState());
    const handleGalleryChange = useCallback((state: GalleryState) => {
        galleryStateRef.current = state;
    }, []);

    const { data, setData, errors, processing } = useForm({
        title: '',
        description: '',
        google_maps_src: '',
        address: '',
        city_id: '',
        category_id: null,
        price: '',
        door_time: '',
        start: '',
        end: '',
        is_online: false,
        link: '',
        featured_image: '',
        image: '' as string,
        tag_ids: [],
    });

    const onCorte = (image: string) => {
        setData('featured_image', image);
        setData('image', '');
    };

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement> | FormChangeEvent) => {
        const t = event.target;
        const value = t.type === 'checkbox' ? Boolean(t.checked) : t.value;
        setData((prev) => ({ ...prev, [t.name]: value }) as typeof prev);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        submitEntityWithGallery(route('events.store'), 'post', data as Record<string, unknown>, galleryStateRef.current, {
            preserveScroll: true,
            onError: (validationErrors) => {
                notifyFormValidationErrors(validationErrors, EVENT_FORM_FIELD_ORDER);
            },
        });
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={<h2 className="font-semibold text-xl text-foreground leading-tight">Crear Evento</h2>}
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <Card className="shadow-sm">
                        <CardContent className="p-4 sm:p-8">
                            <Form
                                handleOnChange={handleOnChange}
                                submit={submit}
                                data={data}
                                errors={errors}
                                processing={processing}
                                onCorte={onCorte}
                                onGalleryChange={handleGalleryChange}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
