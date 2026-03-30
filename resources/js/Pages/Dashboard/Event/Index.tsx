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
import dayjs from "dayjs";
import "dayjs/locale/es";
import { CalendarRange, ChevronRight, Radio } from "lucide-react";
import SearchFilter from "./Partials/SearchFilter";
import Pagination from "@/Shared/Pagination";

dayjs.locale("es");

type EventRow = {
  id: number;
  title: string;
  image: string;
  start?: string | null;
  end?: string | null;
  is_online?: boolean;
};

function formatEventRange(start?: string | null, end?: string | null): string {
  if (!start && !end) return "—";
  const s = start ? dayjs(start) : null;
  const e = end ? dayjs(end) : null;
  if (s && e && s.isValid() && e.isValid()) {
    return `${s.format("D MMM")} — ${e.format("D MMM YYYY")}`;
  }
  if (s?.isValid()) return s.format("D MMM YYYY");
  if (e?.isValid()) return e.format("D MMM YYYY");
  return "—";
}

export default function Index() {
  const { events } = usePage().props as unknown as {
    events: { data: EventRow[]; links: unknown[] };
  };
  const { data, links } = events;

    return (
        <AuthenticatedLayout
            header={
            <div className="mt-2 flex justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <img
                            src="/images/icons/eventos_dark.svg"
                            alt=""
                            className="h-6 w-6 dark:invert"
                        />
                        <span>Eventos</span>
                    </div>
                </div>
                <div>
                    <Button asChild variant="success">
                        <Link href={route("events.create")}>Crear nuevo</Link>
                    </Button>
                </div>
            </div>
            }
        >
            <Head title="Eventos" />
            <div className="py-8 sm:py-12">
                <div className="mx-auto max-w-7xl sm:px-4">
                    <Card className="overflow-hidden">
                        <CardHeader className="border-b border-border/60 bg-muted/20">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="flex items-center gap-2 text-base font-semibold tracking-tight">
                                        <CalendarRange className="h-4 w-4 text-primary" />
                                        Calendario editorial
                                    </CardTitle>
                                    <CardDescription>
                                        Fechas, modalidad presencial u online, y enlace directo al detalle.
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
                                        <TableHead className="w-[88px] pl-6">Cartel</TableHead>
                                        <TableHead>Evento</TableHead>
                                        <TableHead className="hidden md:table-cell">Cuándo</TableHead>
                                        <TableHead className="hidden sm:table-cell w-[120px]">Modalidad</TableHead>
                                        <TableHead className="w-14 pr-6 text-right" />
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.map((event) => (
                                        <TableRow key={event.id} className="group">
                                            <TableCell className="pl-6">
                                                <img
                                                    src={event.image}
                                                    alt=""
                                                    className="h-14 w-14 rounded-lg object-cover shadow-sm ring-1 ring-border transition group-hover:ring-primary/30"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Link
                                                    href={route("events.edit", event.id)}
                                                    className="font-medium text-foreground transition hover:text-primary"
                                                >
                                                    {event.title}
                                                </Link>
                                                <p className="mt-1 text-xs text-muted-foreground md:hidden">
                                                    {formatEventRange(event.start, event.end)}
                                                </p>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell text-muted-foreground">
                                                {formatEventRange(event.start, event.end)}
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                {event.is_online ? (
                                                    <Badge
                                                        variant="outline"
                                                        className="gap-1 border-primary/40 font-normal text-primary"
                                                    >
                                                        <Radio className="h-3 w-3" />
                                                        Online
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="font-normal">
                                                        Presencial
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="pr-6 text-right">
                                                <Button variant="ghost" size="icon" asChild className="h-9 w-9">
                                                    <Link
                                                        href={route("events.edit", event.id)}
                                                        aria-label={`Editar ${event.title}`}
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
                                                No hay eventos que coincidan.
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
