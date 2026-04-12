import { forwardRef } from 'react';

export type TimeInputProps = {
    type?: string;
    className?: string;
    isFocused?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>;

export default forwardRef<HTMLInputElement, TimeInputProps>(function TimeInput(
    { type: _type = 'text', className = '', isFocused: _isFocused = false, onChange, ...props },
    ref,
) {
    return (
        <div className="flex flex-col items-start">
            <div>
                <input
                    {...props}
                    ref={ref}
                    className={
                        'rounded-md border border-input bg-background text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background dark:border-input ' +
                        className
                    }
                    type="datetime-local"
                    min="2000-06-01T08:30"
                    onChange={(e) => onChange?.(e)}
                />
            </div>
        </div>
    );
});
