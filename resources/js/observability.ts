/**
 * Envia erros não tratados do frontend para o backend (observabilidade).
 */
function reportFrontendError({ message, url, file, line, stack, level = 'error' }) {
    const apiUrl = typeof window !== 'undefined' && typeof window.axios !== 'undefined' ? '/api/observability/errors' : null;
    if (!apiUrl) return;

    const payload = { message, url: url || window.location?.href, file, line, stack, level };
    window.axios.post(apiUrl, payload).catch(() => {});
}

if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
        reportFrontendError({
            message: event.message || String(event.error),
            url: event.filename || window.location?.href,
            file: event.filename,
            line: event.lineno,
            stack: event.error?.stack,
        });
    });

    window.addEventListener('unhandledrejection', (event) => {
        const message = event.reason?.message || String(event.reason);
        reportFrontendError({
            message: `Unhandled promise: ${message}`,
            url: window.location?.href,
            file: undefined,
            line: undefined,
            stack: event.reason?.stack,
            level: 'error',
        });
    });
}
