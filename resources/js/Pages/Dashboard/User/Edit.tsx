import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent } from '@/Components/ui/card';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import type React from 'react';
import Form, { type RoleOption, type StaffRole, type UserFormData } from './Partials/Form';

type ManagedUser = {
    id: number;
    name: string;
    email: string;
    role: StaffRole | 'user';
    is_sole_admin: boolean;
};

export default function Edit() {
    const { managedUser, roles, auth } = usePage().props as unknown as {
        managedUser: ManagedUser;
        roles: RoleOption[];
        auth: { user: { id: number } | null };
    };

    const initialRole: StaffRole = managedUser.role === 'admin' ? 'admin' : 'editor';
    const canDelete = !managedUser.is_sole_admin && managedUser.id !== auth.user?.id;

    const { data, setData, errors, put, processing } = useForm<UserFormData>({
        name: managedUser.name,
        email: managedUser.email,
        password: '',
        password_confirmation: '',
        role: initialRole,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('users.update', managedUser.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-foreground">
                    Editar usuario
                </h2>
            }
        >
            <Head title="Editar usuario" />
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
                                passwordRequired={false}
                                roleLocked={managedUser.is_sole_admin}
                                onDelete={
                                    canDelete
                                        ? () => router.delete(route('users.destroy', managedUser.id))
                                        : undefined
                                }
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
