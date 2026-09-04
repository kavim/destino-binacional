const META_DESCRIPTION_MAX = 160;

export const SEO_FALLBACK_IMAGE = '/images/parque.webp';

export function htmlToMetaDescription(
    html: string | null | undefined,
    fallback: string,
    max = META_DESCRIPTION_MAX,
): string {
    const plain = (html ?? '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    const source = plain || fallback.trim();
    if (source.length <= max) {
        return source;
    }

    return `${source.slice(0, max - 1).trimEnd()}…`;
}

export function toAbsoluteUrl(pathOrUrl: string | null | undefined, origin: string): string {
    const fallback = `${origin.replace(/\/$/, '')}${SEO_FALLBACK_IMAGE}`;
    if (!pathOrUrl || pathOrUrl.trim() === '') {
        return fallback;
    }

    const value = pathOrUrl.trim();
    if (/^https?:\/\//i.test(value)) {
        return value;
    }

    const path = value.startsWith('/') ? value : `/${value}`;

    return `${origin.replace(/\/$/, '')}${path}`;
}
