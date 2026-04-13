import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';
import { Head, Link, usePage } from '@inertiajs/react';
import { Layers, Pencil, Plus } from 'lucide-react';

type ParentCategory = { id: number; name: string; color: string; icon: string };
type ChildCategory = { id: number; name: string };

export default function Index() {
    const { parent_categories, grouped_categories } = usePage().props as unknown as {
        parent_categories: ParentCategory[];
        grouped_categories: Record<number, ChildCategory[]>;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="mt-2 flex justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <img
                                src="/images/icons/category.svg"
                                alt=""
                                className="h-6 w-6 dark:invert"
                            />
                            <span>Categorias</span>
                        </div>
                    </div>
                    <div>
                        <Button asChild variant="success">
                            <Link href={route('categories.create')}>Crear nueva</Link>
                        </Button>
                    </div>
                </div>
            }
        >
            <Head title="Categorias" />
            <div className="py-8 sm:py-12">
                <div className="mx-auto max-w-7xl sm:px-4">
                    <Card className="overflow-hidden">
                        <CardHeader className="border-b border-border/60 bg-muted/20">
                            <div className="space-y-1">
                                <CardTitle className="flex items-center gap-2 text-base font-semibold tracking-tight">
                                    <Layers className="h-4 w-4 text-primary" />
                                    Jerarquía de categorías
                                </CardTitle>
                                <CardDescription>
                                    Categorías padre, subcategorías y accesos rápidos para editar o añadir
                                    hijos.
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {parent_categories.length > 0 ? (
                                <ul className="divide-y divide-border/80">
                                    {parent_categories.map((pc) => {
                                        const children = grouped_categories[pc.id] ?? [];
                                        return (
                                            <li key={pc.id} className="p-6 sm:p-8">
                                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                                    <div className="flex min-w-0 items-start gap-3">
                                                        <div
                                                            className="shrink-0 rounded-2xl p-2 shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                                                            style={{ backgroundColor: pc.color }}
                                                        >
                                                            <img
                                                                src={pc.icon}
                                                                alt=""
                                                                className="h-10 w-10 rounded-xl object-cover"
                                                            />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <h2 className="text-lg font-semibold tracking-tight text-foreground">
                                                                {pc.name}
                                                            </h2>
                                                            <p className="mt-1 text-sm text-muted-foreground">
                                                                {children.length === 0
                                                                    ? 'Sin subcategorías.'
                                                                    : `${children.length} subcategoría${children.length === 1 ? '' : 's'}.`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-9 w-9 shrink-0 self-start"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={route('categories.edit', pc.id)}
                                                            aria-label={`Editar ${pc.name}`}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                </div>

                                                {children.length > 0 ? (
                                                    <ul className="mt-5 space-y-2 border-l-2 border-border/60 pl-4 sm:ml-14 sm:pl-5">
                                                        {children.map((item) => (
                                                            <li
                                                                key={item.id}
                                                                className="flex items-center justify-between gap-3 rounded-xl border border-border/80 bg-muted/25 px-3 py-2.5 sm:px-4"
                                                            >
                                                                <span className="min-w-0 text-sm font-medium text-foreground">
                                                                    {item.name}
                                                                </span>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 shrink-0"
                                                                    asChild
                                                                >
                                                                    <Link
                                                                        href={route(
                                                                            'categories.edit',
                                                                            item.id,
                                                                        )}
                                                                        aria-label={`Editar ${item.name}`}
                                                                    >
                                                                        <Pencil className="h-3.5 w-3.5" />
                                                                    </Link>
                                                                </Button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : null}

                                                <div className="mt-5 sm:ml-14">
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link
                                                            href={route('categories.create', {
                                                                parent_id: pc.id,
                                                            })}
                                                        >
                                                            <Plus className="mr-1.5 h-4 w-4" />
                                                            Agregar subcategoría
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                                    <Layers
                                        className="mb-4 h-12 w-12 text-muted-foreground/70"
                                        strokeWidth={1.25}
                                        aria-hidden
                                    />
                                    <p className="text-lg font-semibold text-foreground">
                                        No hay categorías
                                    </p>
                                    <p className="mt-2 max-w-md text-pretty text-sm text-muted-foreground">
                                        Cree la primera categoría padre para organizar lugares y contenido.
                                    </p>
                                    <Button asChild className="mt-6" variant="success">
                                        <Link href={route('categories.create')}>Crear nueva</Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
