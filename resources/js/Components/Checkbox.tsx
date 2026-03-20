import { Checkbox as ShadCheckbox } from "@/Components/ui/checkbox";
import { Label } from "@/Components/ui/label";

interface CheckboxProps {
    isChecked?: boolean;
    className?: string;
    label?: string;
    name?: string;
    value?: string | number;
    onChange?: (e: any) => void;
}

export default function Checkbox({ isChecked = false, className = '', label, name, value, onChange, ...props }: CheckboxProps) {
    const handleChange = (checked: boolean) => {
        if (onChange) {
            const syntheticEvent = {
                target: {
                    name,
                    value,
                    type: 'checkbox',
                    checked,
                },
            };
            onChange(syntheticEvent);
        }
    };

    return (
        <div className={`inline-flex items-center space-x-2 ${className}`}>
            <ShadCheckbox
                defaultChecked={isChecked}
                name={name}
                value={String(value ?? '')}
                onCheckedChange={handleChange}
                {...props}
            />
            {label && <Label className="cursor-pointer">{label}</Label>}
        </div>
    );
}
