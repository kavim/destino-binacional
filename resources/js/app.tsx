import './bootstrap';
import './observability';
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
        const root = createRoot(el);
        root.render(
            <ThemeProvider defaultTheme="light" storageKey="destino-ui-theme">
                <App {...props} />
            </ThemeProvider>
        );
    },
    progress: {
        delay: 0,
        color: '#6366f1',
        includeCSS: true,
        showSpinner: true,
    },
});
