export const COOKIE_CONSENT_KEY = 'destino_cookie_consent';

export const GA_MEASUREMENT_ID = 'G-95ZBQW1Y5E';
export const HOTJAR_ID = 5086643;

export type CookieConsentValue = 'accepted' | 'rejected';

declare global {
    interface Window {
        dataLayer?: unknown[];
        gtag?: (...args: unknown[]) => void;
        hj?: ((...args: unknown[]) => void) & { q?: unknown[] };
        _hjSettings?: { hjid: number; hjsv: number };
        __destinoAnalyticsLoaded?: boolean;
    }
}

export function getCookieConsent(): CookieConsentValue | null {
    if (typeof window === 'undefined') {
        return null;
    }

    const stored = window.localStorage.getItem(COOKIE_CONSENT_KEY);

    if (stored === 'accepted' || stored === 'rejected') {
        return stored;
    }

    return null;
}

export function setCookieConsent(value: CookieConsentValue): void {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, value);
}

export function loadAnalytics(): void {
    if (typeof window === 'undefined' || window.__destinoAnalyticsLoaded) {
        return;
    }

    window.__destinoAnalyticsLoaded = true;

    window.hj =
        window.hj ||
        function hjStub(...args: unknown[]) {
            window.hj!.q = window.hj!.q || [];
            window.hj!.q.push(args);
        };
    window._hjSettings = { hjid: HOTJAR_ID, hjsv: 6 };

    const hotjar = document.createElement('script');
    hotjar.async = true;
    hotjar.src = `https://static.hotjar.com/c/hotjar-${HOTJAR_ID}.js?sv=6`;
    document.head.appendChild(hotjar);

    const gtagScript = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(gtagScript);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
        window.dataLayer?.push(args);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID);
}

export function loadAnalyticsIfConsented(): void {
    if (getCookieConsent() === 'accepted') {
        loadAnalytics();
    }
}
