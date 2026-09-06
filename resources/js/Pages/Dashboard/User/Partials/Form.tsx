import type React from 'react';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import DeleteButton from '@/Shared/DeleteButton';

export type StaffRole = 'editor' | 'admin';

export type UserFormData = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: StaffRole;
};

export type RoleOption = {
    value: StaffRole;
    label: string;
};

type UserFormErrors = Record<string, string | undefined>;

type FormProps = {
    data: UserFormData;
    errors: UserFormErrors;
    processing: boolean;
    roles: RoleOption[];
    submit: (e: React.FormEvent) => void;
    setData: <K extends keyof UserFormData>(key: K, value: UserFormData[K]) => void;
    passwordRequired?: boolean;
    roleLocked?: boolean;
    onDelete?: () => void;
};

export default function Form({
    data,
    errors,
    processing,
    roles,
    submit,
    setData,
    passwordRequired = true,
    roleLocked = false,
    onDelete,
}: FormProps) {
    return (
        <form onSubmit={submit} className="space-y-6">
            <div>
                <InputLabel htmlFor="name" value="Nombre" />
                <Input
                    id="name"
                    type="text"
                    name="name"
                    value={data.name}
                    className="mt-1 block w-full"
                    autoComplete="name"
                    onChange={(e) => setData('name', e.target.value)}
                />
                <InputError message={errors.name} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="email" value="Email" />
                <Input
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full"
                    autoComplete="username"
                    onChange={(e) => setData('email', e.target.value)}
                />
                <InputError message={errors.email} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="role" value="Rol" />
                <select
                    id="role"
                    name="role"
                    value={data.role}
                    disabled={roleLocked}
                    onChange={(e) => setData('role', e.target.value as StaffRole)}
                    className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {roles.map((role) => (
                        <option key={role.value} value={role.value}>
                            {role.label}
                        </option>
                    ))}
                </select>
                {roleLocked ? (
                    <p className="mt-2 text-sm text-muted-foreground">
                        No se puede cambiar el rol del último administrador.
                    </p>
                ) : null}
                <InputError message={errors.role} className="mt-2" />
            </div>

            <div>
                <InputLabel
                    htmlFor="password"
                    value={passwordRequired ? 'Contraseña' : 'Nueva contraseña (opcional)'}
                />
                <Input
                    id="password"
                    type="password"
                    name="password"
                    value={data.password}
                    className="mt-1 block w-full"
                    autoComplete="new-password"
                    onChange={(e) => setData('password', e.target.value)}
                />
                <InputError message={errors.password} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="password_confirmation" value="Confirmar contraseña" />
                <Input
                    id="password_confirmation"
                    type="password"
                    name="password_confirmation"
                    value={data.password_confirmation}
                    className="mt-1 block w-full"
                    autoComplete="new-password"
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                />
                <InputError message={errors.password_confirmation} className="mt-2" />
            </div>

            {onDelete ? (
                <div className="mt-5 flex justify-between">
                    <DeleteButton type="button" onDelete={onDelete}>
                        Eliminar
                    </DeleteButton>
                    <Button disabled={processing}>Guardar</Button>
                </div>
            ) : (
                <div className="mt-5 flex justify-end">
                    <Button disabled={processing}>Guardar</Button>
                </div>
            )}
        </form>
    );
}
