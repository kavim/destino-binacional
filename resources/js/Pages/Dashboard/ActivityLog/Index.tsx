import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
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
import { Head, router, usePage } from '@inertiajs/react';
import { ClipboardList } from 'lucide-react';
import Pagination, { type PaginationLink } from '@/Shared/Pagination';
import { FormEvent } from 'react';

type ActivityUser = {
    id: number;
    name: string;
    email: string;
};

type ActivityRow = {
    id: number;
    action: 'created' | 'updated' | 'deleted';
    subject_type: string;
    subject_id: number | null;
    subject_label: string;
    created_at: string | null;
    user: ActivityUser | null;
};

type Filters = {
    search?: string | null;
    action?: string | null;
    subject_type?: string | null;
};

const actionLabel: Record<ActivityRow['action'], string> = {
    created: 'Creado',
    updated: 'Editado',
    deleted: 'Eliminado',
};

const typeLabel: Record<string, string> = {
    place: 'Locale',
    event: 'Evento',
    tour: 'Tour',
    category: 'Categoría',
    user: 'Usuario',
};

function formatWhen(iso: string | null): string {
    if (!iso) {
        return '—';
    }

    return new Date(iso).toLocaleString('es-UY', {
        dateStyle: 'short',
        timeStyle: 'short',
    });
}

export default function Index() {
    const { logs, filters } = usePage().props as unknown as {
        logs: { data: ActivityRow[]; links: PaginationLink[] };
        filters: Filters;
    };
    const { data, links } = logs;

    function applyFilters(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const query: Record<string, string> = {};
        for (const [key, value] of form.entries()) {
            if (typeof value === 'string' && value !== '') {
                query[key] = value;
            }
        }
        router.get(route('activity-logs.index'), query, {
            replace: true,
            preserveState: true,
        });
    }

    function clearFilters() {
        router.get(route('activity-logs.index'));
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="mt-2 flex items-center gap-2">
                    <ClipboardList className="h-6 w-6" />
                    <span>Actividad</span>
                </div>
            }
        >
            <Head title="Actividad" />
            <div className="py-8 sm:py-12">
                <div className="mx-auto max-w-7xl sm:px-4">
                    <Card className="overflow-hidden">
                        <CardHeader className="border-b border-border/60 bg-muted/20">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="flex items-center gap-2 text-base font-semibold tracking-tight">
                                        <ClipboardList className="h-4 w-4 text-primary" />
                                        Registro del panel
                                    </CardTitle>
                                    <CardDescription>
                                        Qué se creó, editó o eliminó, y quién lo hizo.
                                    </CardDescription>
                                </div>
                                <form
                                    className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center lg:w-auto lg:justify-end"
                                    onSubmit={applyFilters}
                                >
                                    <Input
                                        name="search"
                                        defaultValue={filters.search ?? ''}
                                        placeholder="Buscar por nombre…"
                                        className="sm:w-52"
                                    />
                                    <select
                                        name="action"
                                        defaultValue={filters.action ?? ''}
                                        className="flex h-10 rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                                    >
                                        <option value="">Todas las acciones</option>
                                        <option value="created">Creado</option>
                                        <option value="updated">Editado</option>
                                        <option value="deleted">Eliminado</option>
                                    </select>
                                    <select
                                        name="subject_type"
                                        defaultValue={filters.subject_type ?? ''}
                                        className="flex h-10 rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                                    >
                                        <option value="">Todos los tipos</option>
                                        <option value="place">Locale</option>
                                        <option value="event">Evento</option>
                                        <option value="tour">Tour</option>
                                        <option value="category">Categoría</option>
                                        <option value="user">Usuario</option>
                                    </select>
                                    <Button type="submit" size="sm">
                                        Filtrar
                                    </Button>
                                    <Button type="button" size="sm" variant="ghost" onClick={clearFilters}>
                                        Limpiar
                                    </Button>
                                </form>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="pl-6">Fecha</TableHead>
                                        <TableHead>Usuario</TableHead>
                                        <TableHead>Acción</TableHead>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead className="pr-6">Ítem</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="py-10 text-center text-sm text-muted-foreground"
                                            >
                                                Todavía no hay actividad registrada.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        data.map((row) => (
                                            <TableRow key={row.id}>
                                                <TableCell className="pl-6 whitespace-nowrap text-muted-foreground">
                                                    {formatWhen(row.created_at)}
                                                </TableCell>
                                                <TableCell>
                                                    {row.user ? (
                                                        <div>
                                                            <div className="font-medium">{row.user.name}</div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {row.user.email}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground">Usuario eliminado</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            row.action === 'deleted'
                                                                ? 'destructive'
                                                                : row.action === 'created'
                                                                  ? 'default'
                                                                  : 'secondary'
                                                        }
                                                    >
                                                        {actionLabel[row.action]}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {typeLabel[row.subject_type] ?? row.subject_type}
                                                </TableCell>
                                                <TableCell className="pr-6 font-medium">
                                                    {row.subject_label}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
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
