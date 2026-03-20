import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function TextInput({ type = 'text', className = '', isFocused = false, ...props }, ref) {
    const input = ref ? ref : useRef();

    return (
        <div className="flex flex-col items-start">
            <div>
                <input
                    {...props}
                    className={
                        'border-border bg-background text-foreground focus:border-indigo-500 focus:ring-indigo-500 focus:ring-offset-background rounded-md shadow-sm ' +
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
