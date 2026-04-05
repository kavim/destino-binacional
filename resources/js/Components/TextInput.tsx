import { forwardRef, useCallback, useEffect, useRef } from 'react';
import type React from 'react';
import { Input } from "@/Components/ui/input";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    isFocused?: boolean;
}

export default forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref
) {
    const localRef = useRef<HTMLInputElement>(null);

    const setRefs = useCallback(
        (node: HTMLInputElement | null) => {
            localRef.current = node;
            if (typeof ref === 'function') {
                ref(node);
            } else if (ref != null) {
                (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
            }
        },
        [ref],
    );

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <Input
            {...props}
            type={type}
            className={className}
            ref={setRefs}
        />
    );
});
