import { Button, type ButtonProps } from "@/Components/ui/button";

export default function PrimaryButton({ className = '', disabled, children, ...props }: ButtonProps) {
    return (
        <Button variant="default" disabled={disabled} className={className} {...props}>
            {children}
        </Button>
    );
}
