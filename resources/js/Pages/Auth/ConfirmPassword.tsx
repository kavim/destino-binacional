import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Head, useForm } from '@inertiajs/react';
import type React from 'react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, [reset]);

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setData('password', event.target.value);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('password.confirm'));
    };

    return (
        <GuestLayout>
            <Head title="Confirm Password" />

            <div className="mb-4 text-sm text-muted-foreground">
                This is a secure area of the application. Please confirm your password before continuing.
            </div>

            <form onSubmit={submit}>
                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <Input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoFocus
                        onChange={handleOnChange}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-end mt-4">
                    <Button type="submit" className="ml-4" disabled={processing}>
                        Confirm
                    </Button>
                </div>
            </form>
        </GuestLayout>
    );
}
