import React from 'react';

type DeleteButtonProps = {
    onDelete: () => void;
    children: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
};

export default function DeleteButton({ onDelete, children, type = 'button' }: DeleteButtonProps) {
    return (
        <button
            className="inline-flex items-center rounded-md border border-transparent bg-destructive px-4 py-2 text-xs font-semibold uppercase tracking-widest text-destructive-foreground transition duration-150 ease-in-out hover:bg-destructive/90 focus:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background active:bg-destructive/95"
            tabIndex={-1}
            type={type}
            onClick={onDelete}
        >
            {children}
        </button>
    );
}
