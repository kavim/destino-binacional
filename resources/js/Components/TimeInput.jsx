import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function TextInput({ type = 'text', className = '', isFocused = false, ...props }, ref) {
    const input = ref ? ref : useRef();

    return (
        <div className="flex flex-col items-start">
            <div>
                <input
                    {...props}
                    className={
                        'border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm ' +
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
