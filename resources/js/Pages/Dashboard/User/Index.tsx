import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import { Head, Link, usePage } from '@inertiajs/react';
import { Users } from 'lucide-react';
import Pagination, { type PaginationLink } from '@/Shared/Pagination';

type UserRow = {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'editor' | 'user';
    created_at: string | null;
};

const roleLabel: Record<UserRow['role'], string> = {
    admin: 'Admin',
    editor: 'Editor',
    user: 'Usuario',
};

export default function Index() {
    const { users } = usePage().props as unknown as {
        users: { data: UserRow[]; links: PaginationLink[] };
    };
    const { data, links } = users;

    return (
        <AuthenticatedLayout
            header={
                <div className="mt-2 flex justify-between">
                    <div className="flex items-center gap-2">
                        <Users className="h-6 w-6" />
                        <span>Usuarios</span>
                    </div>
                    <Button asChild variant="success">
                        <Link href={route('users.create')}>Crear usuario</Link>
                    </Button>
                </div>
            }
        >
            <Head title="Usuarios" />
            <div className="py-8 sm:py-12">
                <div className="mx-auto max-w-7xl sm:px-4">
                    <Card className="overflow-hidden">
                        <CardHeader className="border-b border-border/60 bg-muted/20">
                            <div className="space-y-1">
                                <CardTitle className="flex items-center gap-2 text-base font-semibold tracking-tight">
                                    <Users className="h-4 w-4 text-primary" />
                                    Acceso al panel
                                </CardTitle>
                                <CardDescription>
                                    Editores gestionan el contenido. Admins también ven analytics y
                                    pueden administrar usuarios.
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="pl-6">Nombre</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead className="w-[120px]">Rol</TableHead>
                                        <TableHead className="w-14 pr-6 text-right" />
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.map((user) => (
                                        <TableRow key={user.id} className="group">
                                            <TableCell className="pl-6">
                                                <Link
                                                    href={route('users.edit', user.id)}
                                                    className="font-medium text-foreground transition hover:text-primary"
                                                >
                                                    {user.name}
                                                </Link>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {user.email}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={user.role === 'admin' ? 'default' : 'secondary'}
                                                >
                                                    {roleLabel[user.role] ?? user.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="pr-6 text-right">
                                                <Link
                                                    href={route('users.edit', user.id)}
                                                    className="text-sm text-primary hover:underline"
                                                >
                                                    Editar
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="border-t border-border/60 p-4">
                                <Pagination links={links} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
