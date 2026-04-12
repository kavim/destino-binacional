import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Card, CardContent } from '@/Components/ui/card';
import Form from './Partials/Form';
import type React from 'react';
import type { CategoryParentSummary } from './Partials/Form';

type CategoryChangeEvent =
    | React.ChangeEvent<HTMLInputElement>
    | {
          target: {
              name: string;
              value: unknown;
              type?: string;
              checked?: boolean;
          };
      };

type CategoryRecord = Record<string, unknown> & {
    id: number;
    name_es?: string;
    name_pt?: string;
    featured_image?: string;
    icon?: string | null;
    icon_preview_url?: string | null;
    color?: string;
};

type CategoryFormData = {
    name_es: string;
    name_pt: string;
    icon: string;
    icon_preview_url?: string;
    icon_image: string | File;
    featured_image: string;
    image: string;
    color: string;
    parent_id: number | null;
};

export default function Edit() {
    const { auth, category, parent } = usePage().props as unknown as {
        auth: unknown;
        category: CategoryRecord;
        parent: CategoryParentSummary | null;
    };

    const { data, setData, errors, processing } = useForm<CategoryFormData>({
        name_es: category.name_es ? category.name_es : '',
        name_pt: category.name_pt ? category.name_pt : '',
        featured_image: category.featured_image ? category.featured_image : '',
        image: '',
        icon: category.icon != null && category.icon !== '' ? String(category.icon) : '',
        icon_preview_url:
            category.icon_preview_url != null && category.icon_preview_url !== ''
                ? String(category.icon_preview_url)
                : '',
        icon_image: '',
        color: category.color ? category.color : '#1c1c1c',
        parent_id: parent ? parent.id : null,
    });

    const handleOnChange = (event: CategoryChangeEvent) => {
        const t = event.target;
        const value = t.type === 'checkbox' ? Boolean(t.checked) : t.value;
        setData((prev) => ({ ...prev, [t.name]: value }) as CategoryFormData);
    };

    const onIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const img = e.target.files?.[0];
        if (img) setData('icon_image', img);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // put(route('categories.update', category.id));
        router.post(`/categories/${category.id}`, {
            forceFormData: true,
            _method: 'put',
            name_es: data.name_es,
            name_pt: data.name_pt,
            featured_image: data.featured_image,
            image: data.image,
            icon: data.icon,
            icon_image: data.icon_image,
            color: data.color,
            parent_id: data.parent_id,
        } as never);
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={<h2 className="font-semibold text-xl text-foreground leading-tight">Crear {data.parent_id ? 'SubCategoria' : 'Categoria'}</h2>}
        >
            <Head title="Crear Categoria" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <Card className="shadow-sm">
                        <CardContent className="space-y-6 p-4 sm:p-8">
                        {parent ? (
                            <div>
                                <div>
                                    <small>Agregando SubCategoria en:</small>
                                </div>
                                <div className='flex justify-start items-center mt-2'>
                                    <div className='p-2 rounded-full' style={{ backgroundColor: parent.color }}>
                                        <img src={parent.icon} alt={parent.name} className="w-10 h-10 rounded-full" />
                                    </div>
                                    <span className='font-semibold ml-3 text-lg' >{parent.name}</span>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h2 className='font-bold text-lg'>Agregando una categoria principal</h2>
                            </div>
                        )}
                        <Form handleOnChange={handleOnChange} submit={submit} data={data} errors={errors} processing={processing} parent={parent} onIconChange={onIconChange}></Form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
