import React from 'react';

export default ({ onDelete, children }) => (
  <button
    className="inline-flex items-center px-4 py-2 bg-red-800 dark:bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-red-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-red-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-red-800 transition ease-in-out duration-150"
    tabIndex="-1"
    type="button"
    onClick={onDelete}
  >
    {children}
  </button>
);
