/**
 * Só permite iframes de embed do Google Maps (evita javascript:/outros hosts no atributo src).
 */
export function safeGoogleMapsEmbedUrl(raw: string | undefined | null): string | undefined {
    if (raw == null || typeof raw !== 'string') return undefined;
    const t = raw.trim();
    if (!t) return undefined;
    try {
        const u = new URL(t);
        if (u.protocol !== 'https:') return undefined;
        const host = u.hostname.toLowerCase();
        const isGoogle =
            host === 'www.google.com' ||
            host === 'google.com' ||
            host === 'maps.google.com' ||
            host.endsWith('.google.com');
        if (!isGoogle) return undefined;
        const path = u.pathname.toLowerCase();
        if (!path.includes('/maps/embed')) return undefined;
        return u.toString();
    } catch {
        return undefined;
    }
}
