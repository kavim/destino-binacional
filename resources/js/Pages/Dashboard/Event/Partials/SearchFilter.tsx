import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";
import { usePrevious } from "react-use";
import pickBy from "lodash/pickBy";

export default () => {
    const { filters, grouped_categories, categories } = usePage().props as unknown as {
        filters: { search?: string; category_id?: string };
        grouped_categories: Record<string, Array<{ id: string | number; name: string }>>;
        categories: Array<{ name: string }>;
    };
    const [opened, setOpened] = useState(false);

    const [values, setValues] = useState({
        search: filters.search || "",
        category_id: filters.category_id || "",
    });

    const prevValues = usePrevious(values);

    function reset() {
        setValues({
            search: "",
            category_id: "",
        });
    }

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            // https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
            if (prevValues) {
                const query = Object.keys(pickBy(values)).length
                    ? pickBy(values)
                    : { remember: "forget" };
                router.get(route(route().current()), query, {
                    replace: true,
                    preserveState: true,
                });
            }
        }, 1500);

        return () => clearTimeout(delayDebounceFn);
    }, [values]);

    function handleChange(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) {
        const key = e.target.name;
        const value = e.target.value;

        setValues((values) => ({
            ...values,
            [key]: value,
        }));

        if (opened) setOpened(false);
    }

    return (
        <div className="flex items-center w-full max-w-md mr-4">
            <div className="relative flex w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm dark:shadow-black/20">
                <div
                    style={{ top: "100%" }}
                    className={`absolute ${opened ? "" : "hidden"}`}
                >
                    <div
                        onClick={() => setOpened(false)}
                        className="fixed inset-0 z-20 bg-black/40 dark:bg-black/55"
                    ></div>
                    <div className="relative z-30 mt-2 w-64 rounded-xl border border-border bg-popover px-4 py-6 text-popover-foreground shadow-lg dark:shadow-black/35">
                        <select
                            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm w-36"
                            value={values.category_id}
                            name="category_id"
                            onChange={handleChange}
                        >
                            <option value="" disabled hidden>
                                Categoría
                            </option>
                            {Object.keys(grouped_categories).map(
                                (group, index) => {
                                    return (
                                        <optgroup
                                            key={index}
                                            label={categories[index].name}
                                        >
                                            {grouped_categories[group].map(
                                                (option, index) => {
                                                    return (
                                                        <option
                                                            key={index}
                                                            value={option.id}
                                                        >
                                                            {option.name}
                                                        </option>
                                                    );
                                                }
                                            )}
                                        </optgroup>
                                    );
                                }
                            )}
                        </select>
                    </div>
                </div>
                <button
                    onClick={() => setOpened(true)}
                    className="z-10 border-r border-border rounded-l px-4 hover:bg-muted focus:z-10 focus:border-border focus:outline-none focus:ring-2 focus:ring-ring md:px-6"
                >
                    <div className="flex items-baseline">
                        <span className="hidden text-foreground md:inline">
                            Filter
                        </span>
                        <svg
                            className="w-2 h-2 text-foreground fill-current md:ml-2"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 961.243 599.998"
                        >
                            <path d="M239.998 239.999L0 0h961.243L721.246 240c-131.999 132-240.28 240-240.624 239.999-.345-.001-108.625-108.001-240.624-240z" />
                        </svg>
                    </div>
                </button>
                <input
                    className="relative w-full rounded-r border-0 bg-background px-6 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0"
                    autoComplete="off"
                    type="text"
                    name="search"
                    value={values.search}
                    onChange={handleChange}
                    placeholder="Search…"
                />
            </div>
            <button
                onClick={reset}
                className="ml-3 text-sm text-muted-foreground hover:text-foreground focus:text-primary focus:outline-none"
                type="button"
            >
                Reset
            </button>
        </div>
    );
};
