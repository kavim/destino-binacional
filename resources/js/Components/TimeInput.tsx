import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function TextInput({ type = 'text', className = '', isFocused = false, ...props }, ref) {
    const input = ref ? ref : useRef();

    return (
        <div className="flex flex-col items-start">
            <div>
                <input
                    {...props}
                    className={
                        'rounded-md border border-input bg-background text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background dark:border-input ' +
                        className
                    }
                    type="datetime-local"
                    min="2000-06-01T08:30"
                    onChange={(e) => props.onChange(e)}
                />
            </div>
        </div>
    );
});
