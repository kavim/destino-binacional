import { Link } from '@inertiajs/react';

interface NavLinkProps {
    active?: boolean;
    className?: string;
    children: React.ReactNode;
    href: string;
}

export default function NavLink({ active = false, className = '', children, ...props }: NavLinkProps) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-primary text-foreground focus:border-primary '
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border focus:text-foreground focus:border-border ') +
                className
            }
        >
            {children}
        </Link>
    );
}
