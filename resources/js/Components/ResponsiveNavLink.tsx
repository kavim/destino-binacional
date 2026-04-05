import type React from "react";
import { Link } from "@inertiajs/react";
import { cn } from "@/lib/utils";

type InertiaLinkProps = React.ComponentProps<typeof Link>;

interface ResponsiveNavLinkProps extends InertiaLinkProps {
    active?: boolean;
    className?: string;
    children: React.ReactNode;
}

export default function ResponsiveNavLink({
    active = false,
    className = "",
    children,
    ...props
}: ResponsiveNavLinkProps) {
    return (
        <Link
            {...props}
            className={cn(
                "flex w-full items-center border-l-4 pl-3 pr-4 py-3 text-base font-medium transition duration-150 ease-in-out focus:outline-none",
                active
                    ? "border-primary bg-primary/10 text-primary focus:border-primary focus:bg-primary/15 focus:text-primary"
                    : "border-transparent text-muted-foreground hover:border-border hover:bg-accent hover:text-foreground focus:border-border focus:bg-accent focus:text-foreground",
                className,
            )}
        >
            {children}
        </Link>
    );
}
