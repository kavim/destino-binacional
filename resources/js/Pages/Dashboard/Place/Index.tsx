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
import { Head, Link, usePage } from "@inertiajs/react";
import { ChevronRight, MapPin } from "lucide-react";
import Pagination from "@/Shared/Pagination";
import SearchFilter from "./Partials/SearchFilter";

type City = { id: number; name: string };

type PlaceRow = {
  id: number;
  name: string;
  slug: string;
  order?: number | null;
  image: string;
  city?: City | null;
};

export default function Index() {
  const { places } = usePage().props as { places: { data: PlaceRow[]; links: unknown[] } };
  const { data, links } = places;

    return (
        <AuthenticatedLayout
            header={
            <div className="mt-2 flex justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <img src="/images/icons/locale.svg" alt="" className="h-6 w-6" />
                        <span>Locales</span>
                    </div>
                </div>
                <div className="px-2">
                    <Button asChild variant="success">
                        <Link href={route("places.create")}>Crear nuevo</Link>
                    </Button>
                </div>
            </div>
            }
        >
            <Head title="Locales" />
            <div className="py-8 sm:py-12">
                <div className="mx-auto max-w-7xl sm:px-4">
                    <Card className="overflow-hidden">
                        <CardHeader className="border-b border-border/60 bg-muted/20">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-base font-semibold tracking-tight">
                                        Directorio de locales
                                    </CardTitle>
                                    <CardDescription>
                                        Vista compacta con orden, ciudad y acceso rápido a edición.
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
                                        <TableHead>Local</TableHead>
                                        <TableHead className="hidden lg:table-cell">Ciudad</TableHead>
                                        <TableHead className="hidden md:table-cell w-[100px]">Orden</TableHead>
                                        <TableHead className="w-14 pr-6 text-right" />
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.map((place) => (
                                        <TableRow key={place.id} className="group">
                                            <TableCell className="pl-6">
                                                <div className="relative">
                                                    <img
                                                        src={place.image}
                                                        alt=""
                                                        className="h-14 w-14 rounded-lg object-cover shadow-sm ring-1 ring-border transition group-hover:ring-primary/30"
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-0.5">
                                                    <Link
                                                        href={route("places.edit", place.id)}
                                                        className="font-medium text-foreground transition hover:text-primary"
                                                    >
                                                        {place.name}
                                                    </Link>
                                                    <span className="font-mono text-xs text-muted-foreground">
                                                        /{place.slug}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell">
                                                {place.city?.name ? (
                                                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                                                        <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/70" />
                                                        {place.city.name}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">—</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <Badge variant="secondary" className="tabular-nums font-normal">
                                                    {place.order ?? "—"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="pr-6 text-right">
                                                <Button variant="ghost" size="icon" asChild className="h-9 w-9">
                                                    <Link
                                                        href={route("places.edit", place.id)}
                                                        aria-label={`Editar ${place.name}`}
                                                    >
                                                        <ChevronRight className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {data.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="h-24 text-center text-muted-foreground"
                                            >
                                                No hay locales que coincidan.
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
