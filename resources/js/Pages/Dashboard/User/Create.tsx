import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent } from '@/Components/ui/card';
import { Head, useForm, usePage } from '@inertiajs/react';
import type React from 'react';
import Form, { type RoleOption, type UserFormData } from './Partials/Form';

export default function Create() {
    const { roles } = usePage().props as unknown as { roles: RoleOption[] };

    const { data, setData, errors, post, processing } = useForm<UserFormData>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'editor',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('users.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-foreground">
                    Crear usuario
                </h2>
            }
        >
            <Head title="Crear usuario" />
            <div className="py-12">
                <div className="mx-auto max-w-2xl space-y-6 sm:px-6 lg:px-8">
                    <Card className="shadow-sm">
                        <CardContent className="space-y-6 p-4 sm:p-8">
                            <Form
                                data={data}
                                errors={errors}
                                processing={processing}
                                roles={roles}
                                submit={submit}
                                setData={(key, value) => setData(key, value)}
                                passwordRequired
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
