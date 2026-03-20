import { Link } from '@inertiajs/react';

interface ResponsiveNavLinkProps {
    active?: boolean;
    className?: string;
    children: React.ReactNode;
    href: string;
    method?: string;
    as?: string;
}

export default function ResponsiveNavLink({ active = false, className = '', children, ...props }: ResponsiveNavLinkProps) {
    return (
        <Link
            {...(props as any)}
            className={`w-full flex items-start pl-3 pr-4 py-2 border-l-4 ${
                active
                    ? 'border-primary text-primary bg-primary/10 focus:text-primary focus:bg-primary/15 focus:border-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-accent hover:border-border focus:text-foreground focus:bg-accent focus:border-border'
            } text-base font-medium focus:outline-none transition duration-150 ease-in-out ${className}`}
        >
            {children}
        </Link>
    );
}
