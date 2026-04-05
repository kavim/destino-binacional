import './bootstrap';
import { registerInertiaObservability } from './observability';
import '../css/app.css';
import 'react-date-picker/dist/DatePicker.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ThemeProvider } from '@/Components/ThemeProvider';

const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
    setup({ el, App, props }) {
        registerInertiaObservability();
        const root = createRoot(el);
        root.render(
            <ThemeProvider defaultTheme="system" storageKey="destino-ui-theme">
                <App {...props} />
            </ThemeProvider>
        );
    },
    progress: {
        delay: 0,
        color: '#355bc8',
        includeCSS: true,
        showSpinner: true,
    },
});
