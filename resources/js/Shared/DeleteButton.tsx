import React from 'react';

export default ({ onDelete, children }) => (
  <button
    className="inline-flex items-center rounded-md border border-transparent bg-destructive px-4 py-2 text-xs font-semibold uppercase tracking-widest text-destructive-foreground transition duration-150 ease-in-out hover:bg-destructive/90 focus:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background active:bg-destructive/95"
    tabIndex="-1"
    type="button"
    onClick={onDelete}
  >
    {children}
  </button>
);
