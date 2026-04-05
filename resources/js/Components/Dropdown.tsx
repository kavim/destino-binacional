import type React from "react";
import { Link } from "@inertiajs/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";

interface DropdownProps {
    children: React.ReactNode;
}

interface TriggerProps {
    children: React.ReactNode;
}

interface ContentProps {
    align?: "left" | "right";
    width?: string;
    contentClasses?: string;
    children: React.ReactNode;
}

type InertiaLinkProps = React.ComponentProps<typeof Link>;

type DropdownLinkProps = InertiaLinkProps & {
    className?: string;
};

const Dropdown = ({ children }: DropdownProps) => {
    return (
        <DropdownMenu>
            {children}
        </DropdownMenu>
    );
};

const Trigger = ({ children }: TriggerProps) => {
    return (
        <DropdownMenuTrigger asChild>
            {children}
        </DropdownMenuTrigger>
    );
};

const Content = ({ align = "right", children }: ContentProps) => {
    return (
        <DropdownMenuContent align={align === "right" ? "end" : "start"}>
            {children}
        </DropdownMenuContent>
    );
};

const DropdownLink = ({ className = "", children, ...props }: DropdownLinkProps) => {
    return (
        <DropdownMenuItem asChild>
            <Link
                {...props}
                className={className}
            >
                {children}
            </Link>
        </DropdownMenuItem>
    );
};

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;

export default Dropdown;
