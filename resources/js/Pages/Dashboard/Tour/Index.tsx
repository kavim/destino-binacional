import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { formatCurrencyCents } from "@/lib/format";
import { Head, Link, usePage } from "@inertiajs/react";
import { Banknote, ChevronRight, Route } from "lucide-react";
import Pagination, { type PaginationLink } from "@/Shared/Pagination";
import SearchFilter from "./Partials/SearchFilter";

type TourRow = {
  id: number;
  title: string;
  image: string;
  price?: number | null;
  currency?: string | null;
};

export default function Index() {
  const { tours } = usePage().props as unknown as {
    tours: { data: TourRow[]; links: PaginationLink[] };
  };
  const { data, links } = tours;

    return (
        <AuthenticatedLayout
            header={
            <div className="mt-2 flex justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <img
                            src="/images/icons/tours_dark.svg"
                            alt=""
                            className="h-6 w-6 dark:invert"
                        />
                        <span>Tours</span>
                    </div>
                </div>
                <div className="px-2">
                    <Button asChild variant="success">
                        <Link href={route("tours.create")}>Crear nuevo</Link>
                    </Button>
                </div>
            </div>
            }
        >
            <Head title="Tours" />
            <div className="py-8 sm:py-12">
                <div className="mx-auto max-w-7xl sm:px-4">
                    <Card className="overflow-hidden">
                        <CardHeader className="border-b border-border/60 bg-muted/20">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="flex items-center gap-2 text-base font-semibold tracking-tight">
                                        <Route className="h-4 w-4 text-primary" />
                                        Catálogo de tours
                                    </CardTitle>
                                    <CardDescription>
                                        Precio por moneda y acceso rápido a cada ficha para editar.
                                    </CardDescription>
                                </div>
                                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
                                    <SearchFilter />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="w-[88px] pl-6">Vista</TableHead>
                                        <TableHead>Tour</TableHead>
                                        <TableHead className="hidden sm:table-cell w-[140px]">Precio</TableHead>
                                        <TableHead className="hidden md:table-cell w-[88px]">Moneda</TableHead>
                                        <TableHead className="w-14 pr-6 text-right" />
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.map((tour) => {
                                        const priceLabel = formatCurrencyCents(
                                            tour.price,
                                            tour.currency
                                        );
                                        return (
                                            <TableRow key={tour.id} className="group">
                                                <TableCell className="pl-6">
                                                    <img
                                                        src={tour.image}
                                                        alt=""
                                                        className="h-14 w-14 rounded-lg object-cover shadow-sm ring-1 ring-border transition group-hover:ring-primary/30"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Link
                                                        href={route("tours.edit", tour.id)}
                                                        className="font-medium text-foreground transition hover:text-primary"
                                                    >
                                                        {tour.title}
                                                    </Link>
                                                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground sm:hidden">
                                                        <Banknote className="h-3 w-3" />
                                                        {priceLabel}
                                                    </p>
                                                </TableCell>
                                                <TableCell className="hidden sm:table-cell">
                                                    <span className="tabular-nums font-medium text-foreground">
                                                        {priceLabel}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <Badge variant="outline" className="font-mono font-normal">
                                                        {tour.currency ?? "BRL"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="pr-6 text-right">
                                                    <Button variant="ghost" size="icon" asChild className="h-9 w-9">
                                                        <Link
                                                            href={route("tours.edit", tour.id)}
                                                            aria-label={`Editar ${tour.title}`}
                                                        >
                                                            <ChevronRight className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {data.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="h-24 text-center text-muted-foreground"
                                            >
                                                No hay tours que coincidan.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
                <div className="mt-8 flex justify-center">
                    <Pagination links={links} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
