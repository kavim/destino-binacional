import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm, usePage } from '@inertiajs/react';
import { Card, CardContent } from '@/Components/ui/card';
import Form, { type FormChangeEvent } from './Partials/Form';
import type { DayWorkingHours } from '@/Components/WorkingHours';
import type React from 'react';
import { useCallback, useRef } from 'react';
import { createGalleryState, submitEntityWithGallery, type GalleryState } from '@/lib/galleryForm';

export default function Create() {
    const { auth, recurrence_day_hour } = usePage().props as unknown as {
        auth: unknown;
        recurrence_day_hour: DayWorkingHours[];
    };

    const galleryStateRef = useRef<GalleryState>(createGalleryState());
    const handleGalleryChange = useCallback((state: GalleryState) => {
        galleryStateRef.current = state;
    }, []);

    const { data, setData, errors, processing } = useForm({
        title: '',
        description : '',
        price: '0',
        currency: 'BRL',
        featured_image: '',
        google_maps_src: '',
        order: '',
        meeting_point: '',
        guide: '',
        start: '',
        end: '',
        category_ids: [] as number[],
        recurrence_day_hour: recurrence_day_hour ?? [],
        recurrence_enabled: false,
        image: '',
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
        submitEntityWithGallery(route('tours.store'), 'post', data as Record<string, unknown>, galleryStateRef.current);
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={<h2 className="font-semibold text-xl text-foreground leading-tight">Crear Tour</h2>}
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
