import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm, usePage, router } from '@inertiajs/react';
import { Card, CardContent } from '@/Components/ui/card';
import Form, { type FormChangeEvent } from './Partials/Form';
import type { DayWorkingHours } from '@/Components/WorkingHours';
import type React from 'react';

export default function Edit() {
    const { auth, tour, category_ids } = usePage().props as unknown as {
        auth: unknown;
        tour: Record<string, unknown> & { id: number; title?: string };
        category_ids: number[];
    };

    const recurrenceRaw = tour.recurrence_day_hour;
    const recurrence_day_hour: DayWorkingHours[] = Array.isArray(recurrenceRaw)
        ? (recurrenceRaw as DayWorkingHours[])
        : [];

    const { data, setData, errors, put, processing } = useForm({
        title: String(tour.title ?? ''),
        description: String(tour.description ?? ''),
        price: String(tour.price ?? ''),
        currency: String(tour.currency ?? 'BRL'),
        featured_image: '',
        image: tour.image != null ? String(tour.image) : '',
        google_maps_src: String(tour.google_maps_src ?? ''),
        meeting_point: String(tour.meeting_point ?? ''),
        guide: String(tour.guide ?? ''),
        start: String(tour.start ?? ''),
        end: String(tour.end ?? ''),
        category_ids: category_ids ? category_ids : [],
        recurrence_day_hour,
        recurrence_enabled: Boolean(tour.recurrence_enabled),
    });

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement> | FormChangeEvent) => {
        const t = event.target;
        const value = t.type === 'checkbox' ? Boolean(t.checked) : t.value;
        setData((prev) => ({ ...prev, [t.name]: value }) as typeof prev);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('tours.update', tour.id), { preserveScroll: true });
    };

    function onDelete() {
        if (confirm('Borrar este tour? ' + tour.title)) {
            router.visit(route('tours.destroy', tour.id), {
                method: 'delete',
            })
        }
    }

    return (
        <AuthenticatedLayout
            auth={auth}
            header={<h2 className="font-semibold text-xl text-foreground leading-tight">Editar Tour</h2>}
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
