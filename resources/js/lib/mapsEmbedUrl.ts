/**
 * Google Maps: URLs seguras para iframe e para abrir no site/app.
 */

function isAllowedGoogleMapsHost(host: string): boolean {
    const h = host.toLowerCase();
    return (
        h === 'www.google.com' ||
        h === 'google.com' ||
        h === 'maps.google.com' ||
        h.endsWith('.google.com')
    );
}

/**
 * Só permite iframes explícitos /maps/embed (HTTPS + Google).
 */
export function safeGoogleMapsEmbedUrl(raw: string | undefined | null): string | undefined {
    if (raw == null || typeof raw !== 'string') return undefined;
    const t = raw.trim();
    if (!t) return undefined;
    try {
        const u = new URL(t);
        if (u.protocol !== 'https:') return undefined;
        if (!isAllowedGoogleMapsHost(u.hostname)) return undefined;
        const path = u.pathname.toLowerCase();
        if (!path.includes('/maps/embed')) return undefined;
        return u.toString();
    } catch {
        return undefined;
    }
}

function extractIframeSrcFromHtml(t: string): string | undefined {
    const m = t.match(/\bsrc\s*=\s*["'](https:\/\/www\.google\.com\/maps\/embed[^"']+)["']/i);
    if (m) return m[1];
    const m2 = t.match(
        /\bsrc\s*=\s*["'](https:\/\/(?:www\.)?google\.com[^"']*\/maps\/embed[^"']*)["']/i,
    );
    if (m2) return m2[1];
    return undefined;
}

/**
 * Gera um `src` de iframe a partir do valor guardado na base (embed, ?pb=, /place, iframe HTML, etc.).
 * Se não for possível obter um embed seguro, devolve `undefined` (não mostrar iframe).
 */
export function normalizeGoogleMapsEmbedSrc(raw: string | undefined | null): string | undefined {
    if (raw == null || typeof raw !== 'string') return undefined;
    let t = raw.trim();
    if (!t) return undefined;

    if (t.startsWith('http://') && t.includes('google')) {
        t = `https://${t.slice('http://'.length)}`;
    }

    if (!/^https?:\/\//i.test(t)) {
        const fromIframe = extractIframeSrcFromHtml(t);
        if (fromIframe) t = fromIframe;
        else return undefined;
    }

    const strict = safeGoogleMapsEmbedUrl(t);
    if (strict) return strict;

    try {
        const u = new URL(t);
        if (u.protocol !== 'https:') return undefined;
        if (!isAllowedGoogleMapsHost(u.hostname)) return undefined;

        const path = u.pathname.toLowerCase();

        if (path.includes('/maps/embed')) {
            return u.toString();
        }

        if (path.includes('/maps') && u.search.includes('pb=')) {
            return `https://www.google.com/maps/embed${u.search}`;
        }

        const qParam = u.searchParams.get('q');
        if (qParam && path.includes('/maps')) {
            return `https://www.google.com/maps?q=${encodeURIComponent(qParam)}&output=embed`;
        }

        if (path.includes('/maps/search')) {
            const queryParam = u.searchParams.get('query') ?? u.searchParams.get('q');
            if (queryParam) {
                return `https://www.google.com/maps?q=${encodeURIComponent(queryParam)}&output=embed`;
            }
        }

        if (path.includes('/maps/') || path === '/maps') {
            return `https://www.google.com/maps?q=${encodeURIComponent(t)}&output=embed`;
        }
    } catch {
        return undefined;
    }

    return undefined;
}

/** Busca segura no Google Maps (Places API URL scheme). */
export function googleMapsSearchUrl(query: string): string {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query.trim())}`;
}

/**
 * URL para abrir o mesmo local no Google Maps (app/site).
 */
export function googleMapsOpenUrl(
    embedRaw: string | null | undefined,
    fallbackQuery?: string | null,
): string | undefined {
    const raw = typeof embedRaw === 'string' ? embedRaw.trim() : '';
    if (raw !== '') {
        try {
            const u = new URL(raw);
            if (
                u.protocol === 'https:' &&
                isAllowedGoogleMapsHost(u.hostname) &&
                u.search.includes('pb=')
            ) {
                return `https://www.google.com/maps${u.search}`;
            }
        } catch {
            // continuar
        }

        const normalized = normalizeGoogleMapsEmbedSrc(raw);
        if (normalized) {
            try {
                const u = new URL(normalized);
                if (u.search.includes('pb=')) {
                    return `https://www.google.com/maps${u.search}`;
                }
                const q = u.searchParams.get('q');
                if (q) {
                    return googleMapsSearchUrl(q);
                }
            } catch {
                // continuar
            }
        }

        const strict = safeGoogleMapsEmbedUrl(raw);
        if (strict) {
            try {
                const u = new URL(strict);
                if (u.search && u.search.length > 1) {
                    return `https://www.google.com/maps${u.search}`;
                }
            } catch {
                // continuar
            }
        }

        try {
            const u = new URL(raw);
            if (u.protocol === 'https:' && isAllowedGoogleMapsHost(u.hostname)) {
                const qParam = u.searchParams.get('q');
                if (qParam) {
                    return googleMapsSearchUrl(qParam);
                }
            }
        } catch {
            // continuar
        }
    }

    const fb = typeof fallbackQuery === 'string' ? fallbackQuery.trim() : '';
    if (fb !== '') {
        return googleMapsSearchUrl(fb);
    }
    return undefined;
}
