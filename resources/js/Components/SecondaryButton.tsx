import { Button, type ButtonProps } from "@/Components/ui/button";

export default function SecondaryButton({ type = 'button', className = '', disabled, children, ...props }: ButtonProps) {
    return (
        <Button variant="outline" type={type} disabled={disabled} className={className} {...props}>
            {children}
        </Button>
    );
}
