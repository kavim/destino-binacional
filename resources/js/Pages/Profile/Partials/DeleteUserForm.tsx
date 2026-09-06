import { useRef, useState } from 'react';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import InputError from '@/Components/InputError';
import { useForm } from '@inertiajs/react';
import type React from 'react';

export default function DeleteUserForm({ className }: { className?: string }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e: React.FormEvent) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-medium text-foreground">Delete Account</h2>

                <p className="mt-1 text-sm text-muted-foreground">
                    Once your account is deleted, all of its resources and data will be permanently deleted. Before
                    deleting your account, please download any data or information that you wish to retain.
                </p>
            </header>

            <Button variant="destructive" onClick={confirmUserDeletion}>
                Delete Account
            </Button>

            <Dialog
                open={confirmingUserDeletion}
                onOpenChange={(open) => {
                    if (!open) {
                        closeModal();
                    }
                }}
            >
                <DialogContent className="sm:max-w-2xl">
                    <form onSubmit={deleteUser}>
                        <DialogHeader>
                            <DialogTitle>Are you sure you want to delete your account?</DialogTitle>
                            <DialogDescription>
                                Once your account is deleted, all of its resources and data will be permanently deleted.
                                Please enter your password to confirm you would like to permanently delete your account.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="mt-6">
                            <Label htmlFor="password" className="sr-only">
                                Password
                            </Label>

                            <Input
                                id="password"
                                type="password"
                                name="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="mt-1 block w-3/4"
                                autoFocus
                                placeholder="Password"
                            />

                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={closeModal}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="destructive" disabled={processing}>
                                Delete Account
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </section>
    );
}
