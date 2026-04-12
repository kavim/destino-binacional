import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { router, usePage } from "@inertiajs/react";
import pickBy from "lodash/pickBy";
import { cn } from "@/lib/utils";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { ChevronRight, Filter, Loader2, Search, X } from "lucide-react";

export type DashboardListingFilterMode = "categories" | "tags";

type HierarchyOption = { id: string | number; name: string };
type GroupedMap = Record<string, HierarchyOption[]>;

type FilterValues = {
    search: string;
    parentId: string;
    childId: string;
};

function compactQuery(
    values: FilterValues,
    parentKey: string,
    childKey: string,
): Record<string, string> | { remember: "forget" } {
    const raw: Record<string, string | undefined> = {
        search: values.search || undefined,
        [parentKey]: values.parentId || undefined,
        [childKey]: values.childId || undefined,
    };
    const cleaned = pickBy(raw, (v) => typeof v === "string" && v.length > 0) as Record<string, string>;
    return Object.keys(cleaned).length ? cleaned : { remember: "forget" };
}

function hasActiveFilters(values: FilterValues): boolean {
    return [values.search, values.parentId, values.childId].some((v) => typeof v === "string" && v.length > 0);
}

function resolveHierarchyLabels(
    parentId: string,
    childId: string,
    parents: HierarchyOption[],
    grouped: GroupedMap,
    fallbackParent: string,
    fallbackChild: string,
): { parentName: string | null; subName: string | null } | null {
    if (!parentId && !childId) return null;

    const parent = parents.find((c) => String(c.id) === String(parentId));
    const subs =
        parentId != null && parentId !== "" ? grouped[parentId] ?? grouped[String(parentId)] : undefined;
    const sub = childId && subs?.length ? subs.find((o) => String(o.id) === String(childId)) : undefined;

    return {
        parentName: parent?.name ?? (parentId ? `${fallbackParent} #${parentId}` : null),
        subName: sub?.name ?? (childId ? `${fallbackChild} #${childId}` : null),
    };
}

type PageFilters = {
    search?: string;
    category_id?: string;
    sub_category_id?: string;
    parent_tag_id?: string;
    tag_id?: string;
};

type ListingPageProps = {
    filters: PageFilters;
    categories?: HierarchyOption[];
    grouped_categories?: GroupedMap;
    parent_tags?: HierarchyOption[];
    grouped_tags?: GroupedMap;
};

const COPY = {
    categories: {
        panelTitle: "Categorías",
        parentPlaceholder: "Categoría principal",
        childPlaceholder: "Subcategoría",
        childOptionAll: "Todas en esta categoría",
        summaryParentRemove: "Quitar categoría",
        summaryChildRemove: "Quitar subcategoría",
        hintOnlyParent: "Toda la categoría",
        hintOnlyParentSuffix: "(sin subcategoría concreta).",
        fallbackParent: "Categoría",
        fallbackChild: "Subcategoría",
        dialogAria: "Filtros por categoría",
    },
    tags: {
        panelTitle: "Etiquetas",
        parentPlaceholder: "Grupo de tags",
        childPlaceholder: "Tag",
        childOptionAll: "Todas las de este grupo",
        summaryParentRemove: "Quitar grupo de tags",
        summaryChildRemove: "Quitar tag",
        hintOnlyParent: "Todo el grupo",
        hintOnlyParentSuffix: "(sin tag concreto).",
        fallbackParent: "Tag grupo",
        fallbackChild: "Tag",
        dialogAria: "Filtros por etiquetas",
    },
} as const;

type Props = {
    mode?: DashboardListingFilterMode;
};

/**
 * Listados admin: locales/tours (categorías) o eventos (tags), misma barra y UX.
 */
export default function DashboardListingSearchFilter({ mode = "categories" }: Props) {
    const isTags = mode === "tags";
    const page = usePage().props as unknown as ListingPageProps;
    const { filters } = page;

    const parents = useMemo(
        () => (isTags ? page.parent_tags : page.categories) ?? [],
        [isTags, page.parent_tags, page.categories],
    );
    const grouped = useMemo(
        () => (isTags ? page.grouped_tags : page.grouped_categories) ?? {},
        [isTags, page.grouped_tags, page.grouped_categories],
    );

    const parentKey = isTags ? "parent_tag_id" : "category_id";
    const childKey = isTags ? "tag_id" : "sub_category_id";
    const copy = isTags ? COPY.tags : COPY.categories;

    const parentFromServer = filters[parentKey as keyof PageFilters];
    const childFromServer = filters[childKey as keyof PageFilters];

    const [opened, setOpened] = useState(false);
    const [loading, setLoading] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const [panelPosition, setPanelPosition] = useState({ top: 0, left: 0 });

    const [values, setValues] = useState<FilterValues>({
        search: filters.search ?? "",
        parentId: parentFromServer != null ? String(parentFromServer) : "",
        childId: childFromServer != null ? String(childFromServer) : "",
    });

    useEffect(() => {
        setValues({
            search: filters.search ?? "",
            parentId: parentFromServer != null ? String(parentFromServer) : "",
            childId: childFromServer != null ? String(childFromServer) : "",
        });
    }, [filters.search, parentFromServer, childFromServer]);

    const updatePanelPosition = useCallback(() => {
        const el = triggerRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const panelWidth = 288;
        let left = r.left;
        if (left + panelWidth > window.innerWidth - 16) {
            left = Math.max(16, window.innerWidth - panelWidth - 16);
        }
        setPanelPosition({
            top: r.bottom + 8,
            left,
        });
    }, []);

    useLayoutEffect(() => {
        if (!opened) return;
        updatePanelPosition();
    }, [opened, updatePanelPosition]);

    useEffect(() => {
        if (!opened) return;
        const onScrollOrResize = () => updatePanelPosition();
        window.addEventListener("scroll", onScrollOrResize, true);
        window.addEventListener("resize", onScrollOrResize);
        return () => {
            window.removeEventListener("scroll", onScrollOrResize, true);
            window.removeEventListener("resize", onScrollOrResize);
        };
    }, [opened, updatePanelPosition]);

    useEffect(() => {
        if (!opened) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpened(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [opened]);

    const applyFilters = useCallback(() => {
        setLoading(true);
        const query = compactQuery(values, parentKey, childKey);
        router.get(route(route().current() ?? ""), query, {
            replace: true,
            preserveState: true,
            onFinish: () => setLoading(false),
        });
        setOpened(false);
    }, [values, parentKey, childKey]);

    const visitWithValues = useCallback(
        (next: FilterValues) => {
            setValues(next);
            setLoading(true);
            const query = compactQuery(next, parentKey, childKey);
            router.get(route(route().current() ?? ""), query, {
                replace: true,
                preserveState: true,
                onFinish: () => setLoading(false),
            });
        },
        [parentKey, childKey],
    );

    function reset() {
        setOpened(false);
        setValues({ search: "", parentId: "", childId: "" });
        router.get(route(route().current() ?? ""));
    }

    function handleParentChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setValues((v) => ({
            ...v,
            parentId: e.target.value,
            childId: "",
        }));
    }

    function handleChildChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setValues((v) => ({ ...v, childId: e.target.value }));
    }

    function handleSearchInput(e: React.ChangeEvent<HTMLInputElement>) {
        setValues((v) => ({ ...v, search: e.target.value }));
    }

    const hierarchyActive = Boolean(values.parentId || values.childId);
    const showClear = hasActiveFilters(values);

    const hierarchyLabels = useMemo(
        () =>
            resolveHierarchyLabels(
                values.parentId,
                values.childId,
                parents,
                grouped,
                copy.fallbackParent,
                copy.fallbackChild,
            ),
        [values.parentId, values.childId, parents, grouped, copy.fallbackParent, copy.fallbackChild],
    );

    function removeParentHierarchyFilter() {
        visitWithValues({ ...values, parentId: "", childId: "" });
    }

    function removeChildHierarchyFilter() {
        visitWithValues({ ...values, childId: "" });
    }

    const filterPanel =
        opened &&
        typeof document !== "undefined" &&
        createPortal(
            <>
                <button
                    type="button"
                    aria-label="Cerrar filtros"
                    onClick={() => setOpened(false)}
                    className={cn(
                        "fixed inset-0 z-[100] bg-black/40 backdrop-blur-[1px] transition-opacity",
                        "animate-in fade-in duration-200 dark:bg-black/55",
                    )}
                />
                <div
                    role="dialog"
                    aria-label={copy.dialogAria}
                    className={cn(
                        "fixed z-[110] w-72 origin-top-left rounded-xl border border-border bg-popover p-4",
                        "text-popover-foreground shadow-xl shadow-black/10 dark:shadow-black/40",
                        "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200",
                    )}
                    style={{ top: panelPosition.top, left: panelPosition.left }}
                >
                    <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {copy.panelTitle}
                    </p>
                    <div className="flex flex-col gap-3">
                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            value={values.parentId}
                            name={parentKey}
                            onChange={handleParentChange}
                        >
                            <option value="" disabled hidden>
                                {copy.parentPlaceholder}
                            </option>
                            <option value="">Todas</option>
                            {parents.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>

                        <div
                            className={cn(
                                "overflow-hidden transition-all duration-300 ease-out",
                                values.parentId ? "max-h-24 opacity-100" : "max-h-0 opacity-0",
                            )}
                        >
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                value={values.childId}
                                name={childKey}
                                onChange={handleChildChange}
                                disabled={!values.parentId}
                            >
                                <option value="" disabled hidden>
                                    {copy.childPlaceholder}
                                </option>
                                <option value="">{copy.childOptionAll}</option>
                                {values.parentId &&
                                    (grouped[values.parentId] ?? grouped[String(values.parentId)])?.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.name}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <div className="flex gap-2 pt-1">
                            <Button
                                type="button"
                                size="sm"
                                className="flex-1 gap-1.5 transition-transform active:scale-[0.98]"
                                disabled={loading}
                                onClick={() => applyFilters()}
                            >
                                {loading ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                                ) : null}
                                Aplicar
                            </Button>
                            <Button type="button" variant="outline" size="sm" onClick={() => setOpened(false)}>
                                Cerrar
                            </Button>
                        </div>
                    </div>
                </div>
            </>,
            document.body,
        );

    const showHierarchySummary = hierarchyLabels && (values.parentId || values.childId);

    return (
        <div className="mr-4 flex w-full max-w-xl flex-col gap-2 sm:max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
                {filterPanel}
                <div
                    className={cn(
                        "group relative flex min-w-0 flex-1 overflow-hidden rounded-xl border bg-card shadow-sm transition-[box-shadow,border-color] duration-200 dark:shadow-black/20",
                        opened && "border-primary/40 shadow-md ring-2 ring-primary/20",
                        hierarchyActive && !opened && "border-primary/25",
                    )}
                >
                    <button
                        ref={triggerRef}
                        type="button"
                        onClick={() => setOpened((o) => !o)}
                        className={cn(
                            "relative z-10 shrink-0 border-r border-border px-3 transition-colors hover:bg-muted md:px-5",
                            "focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0",
                            opened && "bg-muted",
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <Filter
                                className={cn(
                                    "hidden h-4 w-4 shrink-0 text-muted-foreground md:block",
                                    hierarchyActive && "text-primary",
                                )}
                                aria-hidden
                            />
                            <span
                                className={cn(
                                    "hidden text-sm font-medium text-foreground transition-colors md:inline",
                                    hierarchyActive && "text-primary",
                                )}
                            >
                                Filtros
                            </span>
                            <svg
                                className={cn(
                                    "h-2 w-2 shrink-0 fill-current text-foreground transition-transform duration-200 md:ml-0",
                                    opened && "rotate-180",
                                )}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 961.243 599.998"
                                aria-hidden
                            >
                                <path d="M239.998 239.999L0 0h961.243L721.246 240c-131.999 132-240.28 240-240.624 239.999-.345-.001-108.625-108.001-240.624-240z" />
                            </svg>
                            {hierarchyActive ? (
                                <span
                                    className="absolute right-1.5 top-1.5 flex h-2 w-2 animate-pulse rounded-full bg-primary shadow-sm shadow-primary/50 md:right-2 md:top-2"
                                    aria-hidden
                                />
                            ) : null}
                        </div>
                    </button>
                    <input
                        className="relative min-w-0 flex-1 border-0 bg-transparent px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 md:px-5 md:text-[15px]"
                        autoComplete="off"
                        type="text"
                        name="search"
                        value={values.search}
                        onChange={handleSearchInput}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                applyFilters();
                            }
                        }}
                        placeholder="Buscar por slug…"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={loading}
                        className={cn(
                            "shrink-0 rounded-none rounded-r-xl hover:bg-primary/10",
                            loading && "text-primary",
                        )}
                        aria-label="Buscar"
                        onClick={() => applyFilters()}
                    >
                        {loading ? (
                            <Loader2 className="h-[1.125rem] w-[1.125rem] animate-spin" />
                        ) : (
                            <Search className="h-[1.125rem] w-[1.125rem] transition-transform duration-200 group-hover:scale-110" />
                        )}
                    </Button>
                </div>
                {showClear ? (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        onClick={reset}
                    >
                        <X className="h-4 w-4" />
                        <span className="hidden sm:inline">Limpiar</span>
                    </Button>
                ) : null}
            </div>

            {showHierarchySummary && hierarchyLabels ? (
                <div
                    className={cn(
                        "flex flex-col gap-2 rounded-lg border border-dashed border-border/80 bg-muted/30 px-3 py-2.5 animate-in fade-in slide-in-from-top-1 duration-200",
                        "dark:bg-muted/20",
                    )}
                >
                    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        <span className="select-none">Filtros activos</span>
                        {loading ? (
                            <Loader2 className="h-3 w-3 animate-spin text-primary" aria-hidden />
                        ) : null}
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                        {values.parentId && hierarchyLabels.parentName ? (
                            <Badge variant="secondary" className="h-7 max-w-full gap-1 pl-2.5 pr-1 font-normal shadow-sm">
                                <span className="truncate" title={hierarchyLabels.parentName}>
                                    {hierarchyLabels.parentName}
                                </span>
                                <button
                                    type="button"
                                    className="ml-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
                                    aria-label={`${copy.summaryParentRemove} ${hierarchyLabels.parentName}`}
                                    onClick={removeParentHierarchyFilter}
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ) : null}
                        {values.parentId && values.childId && hierarchyLabels.subName ? (
                            <>
                                <ChevronRight
                                    className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70"
                                    aria-hidden
                                />
                                <Badge
                                    variant="outline"
                                    className="h-7 max-w-full gap-1 border-primary/25 bg-background pl-2.5 pr-1 font-normal shadow-sm"
                                >
                                    <span className="truncate" title={hierarchyLabels.subName}>
                                        {hierarchyLabels.subName}
                                    </span>
                                    <button
                                        type="button"
                                        className="ml-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
                                        aria-label={`${copy.summaryChildRemove} ${hierarchyLabels.subName}`}
                                        onClick={removeChildHierarchyFilter}
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            </>
                        ) : null}
                    </div>
                    {values.parentId && !values.childId ? (
                        <p className="text-[11px] leading-snug text-muted-foreground">
                            {copy.hintOnlyParent} «{hierarchyLabels.parentName ?? "—"}»{" "}
                            {copy.hintOnlyParentSuffix}
                        </p>
                    ) : null}
                </div>
            ) : null}
        </div>
    );
}
