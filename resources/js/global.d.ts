/// <reference types="vite/client" />

import type RouteFn from 'ziggy-js';

declare global {
    var route: RouteFn;

    function trans(key: string, replacements?: Record<string, string | number>): string;

    interface Window {
        axios: import('axios').AxiosStatic;
        _translations: Record<string, string>;
    }
}

export {};
