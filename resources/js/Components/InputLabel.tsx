import { Label } from "@/Components/ui/label";

interface InputLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    value?: string;
}

export default function InputLabel({ value, className = '', children, ...props }: InputLabelProps) {
    return (
        <Label className={className} {...props}>
            {value ? value : children}
        </Label>
    );
}
