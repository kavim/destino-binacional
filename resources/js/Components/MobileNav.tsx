import { usePage } from "@inertiajs/react";
import Flags from "@/Components/Flags";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";

type MobileNavProps = {
    cats: {
        categories: Array<{
            slug: string;
            color: string;
            icon: string;
            name: string;
        }>;
    };
};

const rowClass =
    "inline-flex min-h-12 w-full items-center rounded-md px-4 py-3 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground";

export default function MobileNav() {
    const { cats } = usePage().props as unknown as MobileNavProps;
    const categories = cats?.categories ?? [];

    return (
        <div className="overflow-x-hidden">
            <ResponsiveNavLink href={route("site.events.index")} className="items-stretch">
                <span className={rowClass}>
                    <span className="rounded-full bg-primary/85 p-1">
                        <img
                            src="/images/icons/eventos.svg"
                            alt=""
                            className="h-6 w-6 rounded-full"
                            width={24}
                            height={24}
                        />
                    </span>
                    <span className="ml-2 text-lg font-semibold">Eventos</span>
                </span>
            </ResponsiveNavLink>

            <ResponsiveNavLink href={route("site.tours.index")} className="items-stretch">
                <span className={rowClass}>
                    <span className="rounded-full bg-primary/85 p-1">
                        <img
                            src="/images/icons/tours.svg"
                            alt=""
                            className="h-6 w-6 rounded-full"
                            width={24}
                            height={24}
                        />
                    </span>
                    <span className="ml-2 text-lg font-semibold">Tours</span>
                </span>
            </ResponsiveNavLink>

            {categories.map((cat) => (
                <ResponsiveNavLink
                    key={cat.slug}
                    href={route("site.categories.show", {
                        CategoryParentIdentifier: cat.slug,
                    })}
                    className="items-stretch"
                >
                    <span className={rowClass}>
                        <span
                            className="rounded-full p-1"
                            style={{ backgroundColor: cat.color }}
                        >
                            <img
                                src={cat.icon}
                                alt=""
                                aria-hidden
                                className="h-6 w-6 rounded-full"
                                width={24}
                                height={24}
                            />
                        </span>
                        <span className="ml-2 text-lg font-semibold">{cat.name}</span>
                    </span>
                </ResponsiveNavLink>
            ))}

            <div className="flex justify-center p-3">
                <Flags />
            </div>
        </div>
    );
}
