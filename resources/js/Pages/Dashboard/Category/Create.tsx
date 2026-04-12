import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Card, CardContent } from '@/Components/ui/card';
import Form from './Partials/Form';
import type React from 'react';

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

type CategoryFormData = {
    name_es: string;
    name_pt: string;
    icon: string;
    icon_image: string | File;
    featured_image: string;
    image: string;
    color: string;
    parent_id: number | null;
};

export default function Create() {
    const { auth, parent } = usePage().props as unknown as {
        auth: unknown;
        parent: { id: number; name: string; color: string; icon: string } | null;
    };

    const generateRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const { data, setData, errors, post, processing } = useForm<CategoryFormData>({
        name_es: '',
        name_pt: '',
        icon: '',
        icon_image: '',
        featured_image: '',
        image: '',
        color: generateRandomColor(),
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
        post(route('categories.store'));
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
                        <Form handleOnChange={handleOnChange} submit={submit} data={data} errors={errors} onIconChange={onIconChange} processing={processing} parent={parent}></Form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
