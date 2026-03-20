import { Button, type ButtonProps } from "@/Components/ui/button";

export default function DangerButton({ className = '', disabled, children, ...props }: ButtonProps) {
    return (
        <Button variant="destructive" disabled={disabled} className={className} {...props}>
            {children}
        </Button>
    );
}
